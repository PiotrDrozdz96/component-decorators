/* eslint-disable func-names */

type AttrType = 'string' | 'boolean' | 'number' | 'json';

export default function Attr(name: string, type: AttrType = 'string') {
  return function (target: Object, key: string | symbol) {
    const getter = function (this: HTMLElement) {
      switch (type) {
        case 'boolean':
          return this.hasAttribute(name);
        case 'number':
          return Number(this.getAttribute(name));
        case 'json':
          return JSON.parse(this.getAttribute(name));
        case 'string':
        default:
          return this.getAttribute(name);
      }
    };

    const setter = function (this: HTMLElement, next: string | null) {
      switch (type) {
        case 'boolean':
          if (next) {
            this.setAttribute(name, '');
          } else {
            this.removeAttribute(name);
          }
          break;
        case 'json':
          this.setAttribute(name, JSON.stringify(next));
          break;
        case 'number':
        case 'string':
        default:
          this.setAttribute(name, next);
      }
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
