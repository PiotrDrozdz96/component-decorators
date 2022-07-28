import { Component, Attr, OnAttrChange } from '../../decorators';

interface WebIfSlots {
  then: string;
  else: string;
}

@Component({ selector: 'web-if', slots: true })
export default class WebIfDirective extends HTMLElement {
  private $slots: WebIfSlots;
  
  @Attr('condition', 'boolean') condition: boolean;

  public onConditionChange: (condition: boolean) => void = () => {};

  @OnAttrChange('condition')
  conditionChange(condition, oldCondition) {
    if (condition !== oldCondition) {
      this.innerHTML = this.condition ? this.$slots.then : this.$slots.else;
      this.onConditionChange(this.condition);
    }
  }
}
