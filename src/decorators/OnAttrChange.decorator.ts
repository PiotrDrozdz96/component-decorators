/* eslint-disable func-names */

export default function OnAttrChange(name: string) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const observedAttributesDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
      target.constructor, 'observedAttributes',
    );

    const attributeChangedCallbackDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
      target, 'attributeChangedCallback',
    );

    const observedAttributes: Array<string> = observedAttributesDescriptor
      ? observedAttributesDescriptor.value : [];

    observedAttributes.push(name);

    function getter() {
      return observedAttributes;
    }

    function attributeChangedCallback(
      currentName: string,
      oldValue: string | null,
      value: string | null,
    ) {
      if (currentName === name) {
        descriptor.value.call(this, value, oldValue);
      } else if (attributeChangedCallbackDescriptor) {
        attributeChangedCallbackDescriptor.value.call(this, currentName, oldValue, value);
      }
    }

    Object.defineProperty(target.constructor, 'observedAttributes', {
      get: getter,
    });

    Object.defineProperty(target, 'attributeChangedCallback', {
      value: attributeChangedCallback,
    });
  };
}
