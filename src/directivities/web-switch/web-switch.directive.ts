import { Component, Attr, OnAttrChange } from 'decorators';

interface WebSwitchSlots {
  [key: string]: string,
}

@Component({ selector: 'web-switch', slots: true })
export default class WebSwitchDirective extends HTMLElement {
  private $slots: WebSwitchSlots;

  @Attr('state') state: string;

  public onStateChange: (state: string) => void = () => {};

  @OnAttrChange('state')
  stateChange(state, oldState) {
    if (state !== oldState) {
      this.innerHTML = this.$slots[state] || '';
      this.onStateChange(state);
    }
  }
}
