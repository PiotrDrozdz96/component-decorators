/* eslint-disable func-names */

export default function OnClick(selector: string) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const connectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, 'connectedCallback');

    function connectedCallback() {
      this.querySelector(selector).onclick = () => { descriptor.value.call(this); };
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
