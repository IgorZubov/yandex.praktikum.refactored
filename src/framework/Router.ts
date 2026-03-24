type RouteCallback = () => void;

interface Route {
  path: string;
  callback: RouteCallback;
}

export default class Router {
  private routes: Route[] = [];
  private notFoundCallback?: RouteCallback;

  use(path: string, callback: RouteCallback): this {
    this.routes.push({ path, callback });
    return this;
  }

  onNotFound(callback: RouteCallback): this {
    this.notFoundCallback = callback;
    return this;
  }

  start(): void {
    window.addEventListener('popstate', () => this.resolve());
    this.resolve();
  }

  go(path: string): void {
    window.history.pushState({}, '', path);
    this.resolve();
  }

  private resolve(): void {
    const currentPath = window.location.pathname;
    const route = this.routes.find((r) => r.path === currentPath);

    if (route) {
      route.callback();
    } else if (this.notFoundCallback) {
      this.notFoundCallback();
    }
  }
}
