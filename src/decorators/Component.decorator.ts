/* eslint-disable func-names */
import _template from 'lodash/template';
import _templateSettings from 'lodash/templateSettings';

interface ComponentConfig {
  selector: string,
  template?: string,
  extends?: string,
  style?: Object,
  providers?: Array<new () => HTMLElement>,
}

export default function Component(
  { selector, template = '', extends: ext, style, providers = [] }: ComponentConfig,
) {
  return function<T extends {new (...args: any[]): HTMLElement}>(constructor: T) {
    if (selector.indexOf('-') <= 0) {
      throw new Error('You need at least 1 dash in the custom element name!');
    }

    _templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    class CustomElement extends constructor {
      constructor(...args) {
        super(...args);

        let lastChild: HTMLElement = this;
        providers.forEach((Provider) => {
          const provider = new Provider();
          lastChild.appendChild(provider);
          lastChild = provider;
        });

        if (template) {
          const compiled = _template(template);
          lastChild.innerHTML = compiled(this);
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
