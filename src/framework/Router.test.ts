import Router from './Router';

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
    window.history.pushState({}, '', '/');
  });

  describe('use()', () => {
    test('returns the router instance for chaining', () => {
      const result = router.use('/test', jest.fn());
      expect(result).toBe(router);
    });

    test('supports chaining multiple use() calls', () => {
      const result = router.use('/a', jest.fn()).use('/b', jest.fn());
      expect(result).toBe(router);
    });
  });

  describe('onNotFound()', () => {
    test('returns the router instance for chaining', () => {
      const result = router.onNotFound(jest.fn());
      expect(result).toBe(router);
    });
  });

  describe('go()', () => {
    test('calls the callback registered for the given path', () => {
      const cb = jest.fn();
      router.use('/about', cb);
      router.go('/about');
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test('does not call callbacks for non-matching routes', () => {
      const cbA = jest.fn();
      const cbB = jest.fn();
      router.use('/a', cbA).use('/b', cbB);
      router.go('/a');
      expect(cbA).toHaveBeenCalledTimes(1);
      expect(cbB).not.toHaveBeenCalled();
    });

    test('calls notFoundCallback when no route matches', () => {
      const notFound = jest.fn();
      router.onNotFound(notFound);
      router.go('/nowhere');
      expect(notFound).toHaveBeenCalledTimes(1);
    });

    test('does not call notFoundCallback when a route matches', () => {
      const notFound = jest.fn();
      const home = jest.fn();
      router.use('/', home).onNotFound(notFound);
      router.go('/');
      expect(notFound).not.toHaveBeenCalled();
    });

    test('updates window.location.pathname', () => {
      router.use('/profile', jest.fn());
      router.go('/profile');
      expect(window.location.pathname).toBe('/profile');
    });
  });

  describe('start()', () => {
    test('resolves the current path immediately on start', () => {
      const cb = jest.fn();
      window.history.pushState({}, '', '/');
      router.use('/', cb);
      router.start();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test('calls notFoundCallback on start when no route matches current path', () => {
      const notFound = jest.fn();
      window.history.pushState({}, '', '/unknown');
      router.onNotFound(notFound);
      router.start();
      expect(notFound).toHaveBeenCalledTimes(1);
    });

    test('resolves route on popstate event', () => {
      const cb = jest.fn();
      router.use('/', cb);
      router.start();
      cb.mockClear();

      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
});
