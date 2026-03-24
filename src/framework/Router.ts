type RouteCallback = () => void;

interface Route {
  path: string;
  callback: RouteCallback;
}

export default class Router {
  private routes: Route[] = [];
  private notFoundCallback?: RouteCallback;
  // Vite sets BASE_URL from --base flag: '/' in dev, '/yandex.praktikum.refactored/' on GH Pages
  private base = import.meta.env.BASE_URL.replace(/\/$/, '');

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
    window.history.pushState({}, '', this.base + path);
    this.resolve();
  }

  private resolve(): void {
    const routePath = window.location.pathname.slice(this.base.length) || '/';
    const route = this.routes.find((r) => r.path === routePath);

    if (route) {
      route.callback();
    } else if (this.notFoundCallback) {
      this.notFoundCallback();
    }
  }
}
