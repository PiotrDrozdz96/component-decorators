import { Component, Ref } from 'decorators';
import WebRouterDirective, { WebRoutes } from 'directivities/web-router';
import whenDefined from 'helpers/whenDefined';

import LoadingProvider from '../providers/loader/loader.provider';

import template from './root.component.html';
import './root.component.scss';

const routes: WebRoutes = {
  '1': () => '<div>1</div>',
  '2': () => '<div>2</div>',
  'todo-list': () => '<app-todo-list></app-todo-list>',
  '**': () => '<div>404</div>',
  default: () => '<div>default</div>',
};

@Component({ selector: 'app-root', template, providers: [LoadingProvider] })
export default class RootComponent extends HTMLElement {
  @Ref('web-router') $routerElement: WebRouterDirective;

  connectedCallback() {
    whenDefined('web-router', () => {
      this.$routerElement.init(routes);
    });
  }
}
