/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import _defer from 'lodash/defer';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';

type ChildNodeWithRerender<T> = ChildNode & {
  rerender: (item: T, i: number) => void;
};

class WebArray<T> extends Array<T> {
  public setDOM: () => void = () => {};

  constructor(
    public parent: HTMLElement,
    public selector: string,
    public createItem: (item: T, index: number) => HTMLElement,
  ) {
    super();
    Object.setPrototypeOf(this, Object.create(WebArray.prototype));
  }

  private get $list(): HTMLElement {
    return this.parent.querySelector(this.selector);
  }

  private rerender(startIndex = 0) {
    if (_isFunction(_get(this.$list, 'firstElementChild.rerender'))) {
      for (let i = startIndex; i < this.length; i++) {
        (this.$list.childNodes[i] as ChildNodeWithRerender<T>).rerender(this[i], i);
      }
    }
  }

  public pop(): T {
    const removedItem = super.pop();
    this.setDOM();
    if (this.$list) {
      this.$list.removeChild(this.$list.lastElementChild);
    }
    return removedItem;
  }

  public push(...items: Array<T>): number {
    const { length } = this;
    super.push(...items);
    this.setDOM();
    if (this.$list) {
      items.forEach((item: T, index: number) => {
        this.$list.appendChild(this.createItem.call(this.parent, item, length + index));
      });
    }

    return this.length;
  }

  public shift(): T {
    const removedItem = super.shift();
    this.setDOM();
    if (this.$list) {
      this.$list.removeChild(this.$list.firstChild);
    }
    this.rerender();

    return removedItem;
  }

  public splice(index: number, howmany: number, ...items: Array<T>): Array<T> {
    const removedItems = super.splice(index, howmany, ...items);
    this.setDOM();
    if (this.$list) {
      Array.from(this.$list.childNodes).splice(index, howmany).forEach((child) => {
        this.$list.removeChild(child);
      });
      items.forEach((item) => {
        this.$list.insertBefore(
          this.createItem.call(this.parent, item),
          this.$list.childNodes[index],
        );
      });
    }
    this.rerender(index + items.length);

    return removedItems;
  }

  public set(items: Array<T>) {
    super.splice(0, this.length);
    if (this.$list) {
      this.$list.innerHTML = '';
    }
    this.push(...items);
  }
}

export default function WebArrayDecorator(
  selector: string,
  createItem: (item: any, index: number) => HTMLElement,
) {
  return function (target: Object, key: string | symbol) {
    let webArray: WebArray<any>;

    const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
    const valueSetter: (v: Array<any>) => void = descriptor ? descriptor.set : () => {};

    const getter = function (this: HTMLElement) {
      return webArray;
    };

    const setter = function (this: HTMLElement, next: Array<any>) {
      webArray = new WebArray(this, selector, createItem);
      webArray.setDOM = () => valueSetter.call(this, [...webArray]);
      valueSetter.call(this, next);
      _defer(() => {
        webArray.set(next);
      });
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
