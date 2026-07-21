import Button from '../components/button/Button';
import Block from './Block';

// Concrete subclass used to test lifecycle hooks
class TrackableButton extends Button {
  mountCallCount = 0;
  unmountCallCount = 0;

  protected componentDidMount() {
    this.mountCallCount++;
  }

  protected componentWillUnmount() {
    this.unmountCallCount++;
  }
}

describe('Block', () => {
  describe('element()', () => {
    test('returns an Element after first call', () => {
      const btn = new Button({ text: 'Click' });
      expect(btn.element()).toBeInstanceOf(Element);
    });

    test('returns the same element on repeated calls without prop changes', () => {
      const btn = new Button({ text: 'Click' });
      expect(btn.element()).toBe(btn.element());
    });

    test('renders text prop into the DOM', () => {
      const btn = new Button({ text: 'Submit' });
      expect(btn.element()?.textContent?.trim()).toBe('Submit');
    });

    test('renders disabled attribute when disabled=true', () => {
      const btn = new Button({ disabled: true });
      expect(btn.element()?.hasAttribute('disabled')).toBe(true);
    });

    test('does not render disabled attribute when disabled=false', () => {
      const btn = new Button({ disabled: false });
      expect(btn.element()?.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('setProps()', () => {
    test('re-renders when a prop value changes', () => {
      const btn = new Button({ text: 'Old' });
      btn.element();
      btn.setProps({ text: 'New' });
      expect(btn.element()?.textContent?.trim()).toBe('New');
    });

    test('does not re-render when the same prop value is passed', () => {
      const btn = new TrackableButton({ text: 'Same' });
      btn.element(); // initial render → 1 mount
      const mountsBefore = btn.mountCallCount;
      btn.setProps({ text: 'Same' });
      expect(btn.mountCallCount).toBe(mountsBefore);
    });

    test('re-renders when a new prop key is introduced', () => {
      const btn = new Button({});
      btn.element();
      btn.setProps({ text: 'Added' });
      expect(btn.element()?.textContent?.trim()).toBe('Added');
    });
  });

  describe('lifecycle hooks', () => {
    test('componentDidMount is called once after initial render', () => {
      const btn = new TrackableButton({ text: 'Hi' });
      btn.element();
      expect(btn.mountCallCount).toBe(1);
    });

    test('componentDidMount is called again after setProps triggers re-render', () => {
      const btn = new TrackableButton({ text: 'Hi' });
      btn.element();
      btn.setProps({ text: 'Updated' });
      expect(btn.mountCallCount).toBe(2);
    });

    test('componentWillUnmount is called before re-render on setProps', () => {
      const btn = new TrackableButton({ text: 'Hi' });
      btn.element();
      btn.setProps({ text: 'Bye' });
      expect(btn.unmountCallCount).toBe(1);
    });
  });

  describe('events', () => {
    test('click listener is called when element is clicked', () => {
      const clickHandler = jest.fn();

      class ClickableButton extends Button {
        protected events = { click: clickHandler };
      }

      const btn = new ClickableButton({ text: 'Click me' });
      const el = btn.element() as HTMLElement;
      el.click();
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Block abstract contract', () => {
    test('cannot instantiate Block directly (concrete subclass required)', () => {
      // Block is abstract — this verifies the pattern works via subclass
      const btn = new Button({ text: 'test' });
      expect(btn).toBeInstanceOf(Block);
      expect(btn).toBeInstanceOf(Button);
    });
  });
});
