import { Component, Attr } from 'decorators';

import webHistory from 'helpers/webHistory';

export interface WebRoutes {
  [key: string]: () => string;
  '**': () => string;
  default: () => string;
}

@Component({
  selector: 'web-router',
  style: { position: 'relative', width: '100%', height: '100%' },
})
export default class WebRouterDirective extends HTMLElement {
  public routes: WebRoutes;
  private subDirectory: string = null;

  @Attr('level', 'number') level: number;

  public init(routes: WebRoutes) {
    this.routes = routes;
    this.setPage();
    webHistory.addEventListener(this.setPage);
  }

  disconnectedCallback() {
    webHistory.removeEventListener(this.setPage);
  }

  private setPage = async () => {
    const [, ...paths] = window.location.pathname.split('/');
    const subDirectory = paths[this.level || 0];
    let component: string;
    if (!subDirectory) {
      component = await this.routes.default();
    } else if (this.routes[subDirectory]) {
      component = await this.routes[subDirectory]();
    } else {
      component = await this.routes['**']();
    }

    if (this.subDirectory !== subDirectory) {
      this.subDirectory = subDirectory;
      this.innerHTML = component;
    }
  }
}
