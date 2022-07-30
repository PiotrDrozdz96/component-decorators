import { Component, Attr, OnAttrChange } from 'decorators';

@Component({ selector: 'web-if' })
export default class WebIfDirective extends HTMLElement {
  @Attr('condition', 'boolean') condition: boolean;

  private content: string;

  constructor() {
    super();
    this.content = this.innerHTML;
    if (!this.condition) {
      this.innerHTML = '';
    }
  }

  @OnAttrChange('condition')
  conditionChange() {
    this.innerHTML = this.condition ? this.content : '';
  }
}
