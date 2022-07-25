import { Component, Context } from 'decorators';

import { LOADER_PROVIDER, LoaderProvider } from '../providers/loader/loader.consumer';

import './loader.component.scss';
import template from './loader.component.html';

@Component({ selector: 'app-loader', template, style: { display: 'none' } })
export default class LoaderComponent extends HTMLElement {
  private loadingUnsubscribe: () => void;

  @Context(LOADER_PROVIDER) loaderProvider: LoaderProvider;

  connectedCallback() {
    this.loadingUnsubscribe = this.loaderProvider.loading.subscribe((loading) => {
      this.style.display = loading ? 'flex' : 'none';
    }, true);
  }

  disconnectedCallback() {
    this.loadingUnsubscribe();
  }
}
