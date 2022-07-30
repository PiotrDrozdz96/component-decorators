/* eslint-disable func-names */

export default function Prop(selector: string, arg: string = 'innerHTML') {
  return function (target: Object, key: string | symbol) {
    const getter = function (this: HTMLElement) {
      return this.querySelector(selector)[arg];
    };

    Object.defineProperty(target, key, {
      get: getter,
      enumerable: true,
      configurable: true,
    });
  };
}
