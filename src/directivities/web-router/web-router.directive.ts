import { Component } from '../../decorators';

export interface WebRoutes {
  [key: string]: () => string;
  default: () => string;
}

@Component({ selector: 'web-router' })
export default class WebRouterDirective extends HTMLElement {
  public routes: WebRoutes;

  public init(routes: WebRoutes) {
    this.routes = routes;
    this.setPage();
    window.addEventListener('popstate', this.setPage);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.setPage);
  }

  private setPage = () => {
    if (this.routes[window.location.pathname]) {
      this.innerHTML = this.routes[window.location.pathname]();
    } else {
      this.innerHTML = this.routes.default();
    }
  }
}
