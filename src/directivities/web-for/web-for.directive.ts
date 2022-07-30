import _differenceBy from 'lodash/differenceBy';
import _map from 'lodash/map';
import _forEach from 'lodash/forEach';


import { Component, Attr } from '../../decorators';
import Observable from '../../helpers/Observable';
import htmlMap from '../../helpers/htmlMap';
import createHtmlTemplate, { HtmlTemplate } from '../../helpers/createHtmlTemplate';
import _ce from '../../helpers/createElement';

@Component({ selector: 'web-for' })
export default class WebForDirective<T> extends HTMLElement {
  @Attr('key') key: string;

  private template: HtmlTemplate;

  public collection = new Observable<Array<T>>([]);

  public initChild: ($child: HTMLElement) => void = () => {};

  connectedCallback() {
    this.template = createHtmlTemplate(this.innerHTML);
    this.innerHTML = '';

    this.collection.subscribe((collection: Array<T>, oldCollection: Array<T>) => {
      const elementsToRemove = _map(_differenceBy(oldCollection, collection, this.key), this.key);
      _forEach(elementsToRemove, (key) => {
        const elementToRemove = this.querySelector(`[key="${key}"]`);
        this.removeChild(elementToRemove);
      });

      const elementsToAdd = _differenceBy(collection, oldCollection, this.key);
      const newChilds = _ce('template', {
        innerHTML: htmlMap(elementsToAdd, this.template),
      }) as HTMLTemplateElement;

      while (newChilds.content.children.length) {
        const $child = newChilds.content.children[0];
        this.appendChild($child);
        this.initChild($child as HTMLElement);
      }

      const currentOrder = _map(this.children, (child) => child.getAttribute('key'));
      const newOrder = _map(collection, (element) => element[this.key]);
      currentOrder.sort((b, a) => {
        const indexA = newOrder.indexOf(a);
        const indexB = newOrder.indexOf(b);
        if (indexA > indexB) {
          this.insertBefore(this.querySelector(`[key="${b}"]`), this.querySelector(`[key="${a}"]`));
        }
        return indexA - indexB;
      });
    });
  }
}
