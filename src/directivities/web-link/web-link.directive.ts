import { Component, Attr } from '../../decorators';
import webHistory from '../../helpers/webHistory';

import './web-link.directive.css';

type LinkType = 'back' | 'forward' | 'go' | 'push' | 'replace';

@Component({ selector: 'web-link' })
export default class WebLinkComponent extends HTMLElement {
  @Attr('type') type: LinkType;
  @Attr('delta', 'number') delta: number;
  @Attr('data', 'json') data: any;
  @Attr('href') href: string;

  onclick = () => {
    switch (this.type) {
      case 'back':
        webHistory.back();
        break;
      case 'forward':
        webHistory.forward();
        break;
      case 'go':
        webHistory.go(this.delta);
        break;
      case 'push':
        webHistory.pushState(this.data, this.href);
        break;
      case 'replace':
        webHistory.replaceState(this.data, this.href);
        break;
    }
  }
}
