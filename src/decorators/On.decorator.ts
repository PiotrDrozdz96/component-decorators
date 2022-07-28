/* eslint-disable func-names */

export default function On(selector: string, name: string) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const connectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, 'connectedCallback');

    function connectedCallback() {
      this.querySelector(selector)[name] = (...props) => { descriptor.value.call(this, ...props); };
      if (connectedCallbackDescriptor) {
        connectedCallbackDescriptor.value.call(this);
      }
    }

    Object.defineProperty(target, 'connectedCallback', {
      value: connectedCallback,
      configurable: true,
    });
  };
}
