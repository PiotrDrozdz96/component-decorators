import { Component } from '../../decorators';

@Component({ selector: 'web-if' })
export default class WebIfDirective extends HTMLElement {
  private _condition: boolean;
  private thenTemplate: Element;
  private elseTemplate: Element;

  constructor() {
    super();
    this.thenTemplate = this.querySelector('[then]') as Element;
    this.elseTemplate = this.querySelector('[else]') as Element;
    this.innerHTML = '';
    this.appendChild(this.condition
      ? this.thenTemplate.cloneNode(true)
      : this.elseTemplate.cloneNode(true));
  }

  get condition(): boolean { return this._condition; }
  set condition(val: boolean) {
    if (this._condition !== val) {
      this.innerHTML = '';
      this.appendChild(val
        ? this.thenTemplate.cloneNode(true)
        : this.elseTemplate.cloneNode(true));
      this._condition = val;
    }
  }
}
