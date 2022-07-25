/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import _isObject from 'lodash/isObject';
import _forEach from 'lodash/forEach';
import _split from 'lodash/split';
import _defer from 'lodash/defer';

interface PropertyDictionary {
  [key: string]: (value: any, old: any) => {}
}

type SelectorValue = string | PropertyDictionary;

export default function State(...selectors: Array<SelectorValue>) {
  return function (target: Object, key: string | symbol) {
    let val;

    function setDOM(value) {
      _forEach(selectors, (selectorValue) => {
        if (!_isObject(selectorValue)) {
          const [selector, prop = 'innerHTML'] = _split(selectorValue, '.');
          const element = this.querySelector(selector);
          if (element) { element[prop] = value; }
        } else {
          _forEach(selectorValue, (pipe, selectorKey) => {
            const [selector, prop = 'innerHTML'] = _split(selectorKey, '.');
            const element = this.querySelector(selector);
            if (element) { element[prop] = pipe(value, val); }
          });
        }
      });
    }

    const getter = function (this: HTMLElement) {
      return val;
    };

    const setter = function (this: HTMLElement, next) {
      if (val !== next) {
        setDOM.call(this, next);
        val = next;
      }
    };

    const connectedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
      target, 'connectedCallback',
    );

    function connectedCallback(...props) {
      _defer(() => { setDOM.call(this, val); });
      if (connectedCallbackDescriptor) {
        connectedCallbackDescriptor.value.call(this, ...props);
      }
    }

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(target, 'connectedCallback', {
      value: connectedCallback,
      configurable: true,
    });
  };
}
