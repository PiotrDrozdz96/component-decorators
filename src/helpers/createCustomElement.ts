import _reduce from 'lodash/reduce';
import _forEach from 'lodash/forEach';

import _ce from '../helpers/createElement';

interface ElementParams {
  [index: string]: any,
}

function createCustomElement(
  selector: string,
  attributes?: ElementParams,
  props?: ElementParams,
): Element {
  const attributesString = _reduce(attributes, (result, value, key) => (
    `${result} ${key}="${value}"`
  ), '');
  const $tempWrapper = _ce('template', {
    innerHTML: `<${selector}${attributesString}></${selector}>`,
  }) as HTMLTemplateElement;
  const $element = $tempWrapper.content.children[0];

  if (props) {
    _forEach(props, (value, key) => {
      $element[key] = value;
    });
  }

  return $element;
}

export default createCustomElement;
