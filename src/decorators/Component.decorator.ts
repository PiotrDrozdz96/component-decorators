/* eslint-disable func-names */
import createHtmlTemplate from '../helpers/createHtmlTemplate';


interface ComponentConfig {
  selector: string,
  template?: string,
  extends?: string,
  style?: Object,
  providers?: Array<new () => HTMLElement>,
  slots?: boolean;
}

interface Slots {
  [key: string]: string
}

export default function Component(
  { selector, template = '', extends: ext, style, providers = [], slots }: ComponentConfig,
) {
  return function<T extends {new (...args: any[]): HTMLElement}>(constructor: T) {
    if (selector.indexOf('-') <= 0) {
      throw new Error('You need at least 1 dash in the custom element name!');
    }

    class CustomElement extends constructor {
      public $slots: Slots;
      
      constructor(...args) {
        super(...args);

        let lastChild: HTMLElement = this;
        providers.forEach((Provider) => {
          const provider = new Provider();
          lastChild.appendChild(provider);
          lastChild = provider;
        });

        if (slots) {
          const slotsWrapper = document.createElement('div');
          slotsWrapper.innerHTML = this.innerHTML;
          this.$slots = {};
          [...slotsWrapper.querySelectorAll('template')].forEach((node) => {
            this.$slots[node.getAttribute('slot')] = node.innerHTML;
          });
        }

        if (template) {
          const htmlTemplate = createHtmlTemplate(template);
          lastChild.innerHTML = htmlTemplate(this);
        }

        if (style) {
          Object.keys(style).forEach((key: string) => {
            this.style[key] = style[key];
          });
        }
      }
    }

    window.customElements.define(selector, CustomElement, { extends: ext });

    return CustomElement;
  };
}
