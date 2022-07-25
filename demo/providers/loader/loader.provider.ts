import { Component } from 'decorators';
import Observable from 'helpers/Observable';

import { LOADER_PROVIDER } from './loader.consumer';

@Component({ selector: LOADER_PROVIDER })
export default class LoaderProvider extends HTMLElement {
  public loading = new Observable<boolean>(false);
}
