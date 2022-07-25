/* eslint-disable func-names */

export default function Context(selector: string) {
  return function (target: Object, key: string | symbol) {
    const getter = function (this: HTMLElement) {
      return this.closest(selector);
    };

    Object.defineProperty(target, key, {
      get: getter,
      enumerable: true,
      configurable: true,
    });
  };
}
