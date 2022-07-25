/* eslint-disable func-names */

export default function Listener(selector: string, type: string) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const connectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, 'connectedCallback');
    const disconnectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, 'disconnectedCallback');

    function eventListener(event: Event) {
      descriptor.value.call(this, event);
    }

    function connectedCallback() {
      this.querySelector(selector).addEventListener.call(this, type, eventListener);
      if (connectedCallbackDescriptor) {
        connectedCallbackDescriptor.value.call(this);
      }
    }

    function disconnectedCallback() {
      this.querySelector(selector).removeEventListener.call(this, type, eventListener);
      if (disconnectedCallbackDescriptor) {
        disconnectedCallbackDescriptor.value.call(this);
      }
    }

    Object.defineProperty(target, 'connectedCallback', {
      value: connectedCallback,
    });

    Object.defineProperty(target, 'disconnectedCallback', {
      value: disconnectedCallback,
    });
  };
}
