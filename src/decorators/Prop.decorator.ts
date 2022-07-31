/* eslint-disable func-names */

export default function Prop(selector: string, arg: string = 'innerHTML') {
  return function (target: Object, key: string | symbol) {
    const getter = function (this: HTMLElement) {
      return this.querySelector(selector)[arg];
    };

    const setter = function (this: HTMLElement, value: any) {
      this.querySelector(selector)[arg] = value;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
