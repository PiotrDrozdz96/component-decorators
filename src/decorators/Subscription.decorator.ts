/* eslint-disable func-names */
import _isFunction from 'lodash/isFunction';

export default function Subscription() {
  return function (target: Object, key: string, descriptor: PropertyDescriptor) {
    const connectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
      target, 'connectedCallback',
    );

    const disconnectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
      target, 'disconnectedCallback',
    );

    function connectedCallback() {
      this[`_un${key}`] = descriptor.value.call(this);
      connectedCallbackDescriptor?.value.call(this);
    }

    function disconnectedCallback() {
      if (_isFunction(this[`_un${key}`])) {
        this[`_un${key}`]();
        disconnectedCallbackDescriptor?.value.call(this);
      }
    }

    Object.defineProperty(target, 'connectedCallback', {
      value: connectedCallback,
      configurable: true,
      enumerable: true,
    });

    Object.defineProperty(target, 'disconnectedCallback', {
      value: disconnectedCallback,
      configurable: true,
      enumerable: true,
    });
  };
}
