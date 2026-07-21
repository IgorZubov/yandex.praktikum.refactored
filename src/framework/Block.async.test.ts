import Block, { type BlockOwnProps } from './Block';

// Lets all pending microtasks (resolved promises) flush before continuing.
const flushPromises = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

// --- Test component -------------------------------------------------------

interface MessageFeedProps extends BlockOwnProps {
  messages: string[];
  loading: boolean;
  // Optional so it is absent (not null) until an error actually occurs.
  // Block.setProps skips re-renders when ANY incoming prop value matches the
  // current value, so pairing a changed prop with `error: null === null` would
  // silently suppress the update — keeping error absent avoids that trap.
  error?: string;
}

/**
 * Simulates a component that fetches a list of messages from a server.
 * The injected `api` function stands in for a real network call, making it
 * easy to resolve, reject, or delay responses in tests.
 */
class MessageFeed extends Block<MessageFeedProps> {
  protected template = `
    <div class="feed">
      {{#if loading}}<span class="loader">Loading…</span>{{/if}}
      {{#if error}}<p class="error">{{error}}</p>{{/if}}
      {{#each messages}}<p class="message">{{this}}</p>{{/each}}
    </div>
  `;

  private api: () => Promise<string[]>;

  constructor(api: () => Promise<string[]>) {
    // error is intentionally absent from initial props — see note above.
    super({ messages: [], loading: false });
    this.api = api;
  }

  async load(): Promise<void> {
    // Only pass the single prop that changes so setProps always sees a diff.
    this.setProps({ loading: true });
    try {
      const messages = await this.api();
      // Block.setProps skips re-renders when ANY incoming prop value equals
      // the current value. If error is already absent (undefined) and we pass
      // error:undefined again, that key matches and blocks the update. So we
      // only include error:undefined when there is actually a previous error
      // to clear — in that case the value changes (string → undefined) and
      // setProps fires correctly.
      if (this.props.error !== undefined) {
        this.setProps({ messages, loading: false, error: undefined });
      } else {
        this.setProps({ messages, loading: false });
      }
    } catch {
      // loading flips true→false; error is new or changed — always a re-render.
      this.setProps({ error: 'Failed to load messages', loading: false });
    }
  }
}

// Helper selectors
const loader   = (feed: MessageFeed) => feed.element()!.querySelector('.loader');
const errorEl  = (feed: MessageFeed) => feed.element()!.querySelector('.error');
const messages = (feed: MessageFeed) => feed.element()!.querySelectorAll('.message');

// --- Tests ----------------------------------------------------------------

describe('Block (async / network simulation)', () => {
  describe('initial state', () => {
    test('renders with no messages, no loader, no error before any fetch', () => {
      const feed = new MessageFeed(jest.fn());
      feed.element();

      expect(messages(feed)).toHaveLength(0);
      expect(loader(feed)).toBeNull();
      expect(errorEl(feed)).toBeNull();
    });
  });

  describe('loading state', () => {
    test('shows loader immediately after load() is called', async () => {
      // A promise we control: never resolves until we say so.
      let resolve!: (v: string[]) => void;
      const pending = new Promise<string[]>(r => { resolve = r; });

      const feed = new MessageFeed(() => pending);
      feed.element();

      // load() runs setProps({ loading: true }) synchronously before the first
      // await, so the DOM reflects the loading state right away.
      const loadPromise = feed.load();
      expect(loader(feed)).not.toBeNull();

      resolve([]);
      await loadPromise;
    });

    test('removes loader after fetch completes', async () => {
      const feed = new MessageFeed(() => Promise.resolve(['hi']));
      feed.element();

      await feed.load();

      expect(loader(feed)).toBeNull();
    });
  });

  describe('successful fetch', () => {
    test('renders returned messages in the DOM', async () => {
      const serverMessages = ['Hello', 'World', 'From server'];
      const feed = new MessageFeed(() => Promise.resolve(serverMessages));
      feed.element();

      await feed.load();

      expect(messages(feed)).toHaveLength(3);
      expect(messages(feed)[0].textContent).toBe('Hello');
      expect(messages(feed)[2].textContent).toBe('From server');
    });

    test('handles an empty messages array gracefully', async () => {
      const feed = new MessageFeed(() => Promise.resolve([]));
      feed.element();

      await feed.load();

      expect(messages(feed)).toHaveLength(0);
      expect(errorEl(feed)).toBeNull();
    });
  });

  describe('failed fetch', () => {
    test('shows error message when the API rejects', async () => {
      const feed = new MessageFeed(() => Promise.reject(new Error('Network error')));
      feed.element();

      await feed.load();

      expect(errorEl(feed)).not.toBeNull();
      expect(errorEl(feed)!.textContent).toBe('Failed to load messages');
    });

    test('clears messages and loader when fetch fails', async () => {
      const feed = new MessageFeed(() => Promise.reject(new Error('500')));
      feed.element();

      await feed.load();

      expect(messages(feed)).toHaveLength(0);
      expect(loader(feed)).toBeNull();
    });
  });

  describe('retry after failure', () => {
    test('clears the error and shows new messages on a successful retry', async () => {
      let callCount = 0;
      const unreliableApi = () => {
        callCount++;
        return callCount === 1
          ? Promise.reject(new Error('First attempt failed'))
          : Promise.resolve([`Retry message ${callCount}`]);
      };

      const feed = new MessageFeed(unreliableApi);
      feed.element();

      await feed.load(); // fails
      expect(errorEl(feed)).not.toBeNull();

      await feed.load(); // succeeds
      // error becomes undefined → Handlebars treats it as falsy → not rendered
      expect(errorEl(feed)).toBeNull();
      expect(messages(feed)).toHaveLength(1);
      expect(messages(feed)[0].textContent).toBe('Retry message 2');
    });
  });

  describe('sequential fetches', () => {
    test('second fetch replaces messages from the first', async () => {
      let callCount = 0;
      // Each call returns a fresh array so reference equality never fools setProps.
      const api = () => {
        callCount++;
        return Promise.resolve(
          callCount === 1 ? ['First batch'] : ['Second A', 'Second B'],
        );
      };

      const feed = new MessageFeed(api);
      feed.element();

      await feed.load();
      expect(messages(feed)).toHaveLength(1);

      await feed.load();
      expect(messages(feed)).toHaveLength(2);
      expect(messages(feed)[0].textContent).toBe('Second A');
    });
  });

  describe('delayed network response (fake timers)', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    test('shows loader during a 2-second delay and messages afterwards', async () => {
      const delayedApi = () =>
        new Promise<string[]>(resolve =>
          setTimeout(() => resolve(['Delayed message']), 2000),
        );

      const feed = new MessageFeed(delayedApi);
      feed.element();

      const loadPromise = feed.load();

      // The response hasn't arrived yet.
      expect(loader(feed)).not.toBeNull();
      expect(messages(feed)).toHaveLength(0);

      // Fast-forward past the timeout, then flush the microtask queue.
      jest.runAllTimers();
      await loadPromise;

      expect(loader(feed)).toBeNull();
      expect(messages(feed)).toHaveLength(1);
      expect(messages(feed)[0].textContent).toBe('Delayed message');
    });

    test('handles two sequential delayed fetches', async () => {
      let batch = 0;
      const api = () =>
        new Promise<string[]>(resolve =>
          setTimeout(() => resolve([`Batch ${++batch}`]), 1000),
        );

      const feed = new MessageFeed(api);
      feed.element();

      const first = feed.load();
      jest.runAllTimers();
      await first;

      const second = feed.load();
      jest.runAllTimers();
      await second;

      expect(messages(feed)[0].textContent).toBe('Batch 2');
    });
  });

  describe('API call tracking', () => {
    test('calls the API exactly once per load() invocation', async () => {
      let callCount = 0;
      // Use a factory so every call returns a distinct array reference,
      // preventing false "no change" short-circuits in setProps.
      const api = jest.fn().mockImplementation(() =>
        Promise.resolve([`msg-${++callCount}`]),
      );
      const feed = new MessageFeed(api);
      feed.element();

      await feed.load();
      await feed.load();
      await feed.load();

      expect(api).toHaveBeenCalledTimes(3);
    });
  });

  describe('flushPromises helper', () => {
    test('state is visible after awaiting flushPromises when caller ignores the promise', async () => {
      const feed = new MessageFeed(() => Promise.resolve(['Flushed']));
      feed.element();

      // Fire and forget — caller does not hold the promise.
      feed.load();

      // flushPromises schedules a macrotask; by the time it resolves, all
      // microtasks (including the resolved API promise) have already run.
      await flushPromises();

      expect(messages(feed)).toHaveLength(1);
      expect(messages(feed)[0].textContent).toBe('Flushed');
    });
  });
});
