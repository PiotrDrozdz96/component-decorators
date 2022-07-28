import _template from 'lodash/template';
import _templateSettings from 'lodash/templateSettings';

export type HtmlTemplate = (values: Object) => string;

const scopeProps = (value: string): string => `{{${value}}}`;

const createHtmlTemplate = (template: string): HtmlTemplate => {
  _templateSettings.interpolate = /{{([\s\S]+?)}}/g;

  return _template(template, {
    imports: { scopeProps },
  });
};

export default createHtmlTemplate;
