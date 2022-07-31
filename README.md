# Web component decorators &middot; [![npm version](https://img.shields.io/npm/v/component-decorators.svg?style=flat)](https://www.npmjs.com/package/component-decorators)

## Decorators

```` import {} from 'component-decorators````

### `@Component({ options })`

#### Options

| Name     | Type              | Description                                                                                     |
| -------  | ----------------- | ----------------------------------------------------------------------------------------------- |
| selector | string            | Name of the tag to use. Must include a '-' (minus)                                              |
| template | string (optional) | An inline template for an web component                                                         |
| extends  | string (optional) | The extends property, specifies the built-in element your element inherits from, if any (only relevant to customized built-in elements)|
| style    | CSSStyleDeclarations (optional) | The style property specifies an inline style for an element.                      |
| providers | Component[] (optional) | Array of components/providers, which become parents of template                           |
| slots     | boolean (optional)     | Enable slots in custom component                                                          |

Replacement for customElements.define(tagname, element, options). To be put right above the class declaration of the web component. In template you can interpolate paramaters of component lik this `<template slot="{{states.TABLE}}">`. WARNING! It's only initial value. If value will be change, in DOM stay initial value. If you want rerender value use @State decorator or change value in other way. Additionally if component use slots and filled it with own parameters you can use scopeProps to keep interpolate inside template.
````html
  <template slot="trow">
    <tr id="{{ scopeProps('id') }}">
      <td>{{ scopeProps('name') }}</td>
    </tr>
  </template>
````

### `@Attr(name, type)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| name          | string | Name of the attribute |
| type          | 'string' \| 'boolean' \| 'number' \| \'json' (default: 'string') | Type determines how attribute will be getting and setting |

To be put right above the property of component. This decorator strictly connect parameter with attribute.

### `@Context(selector)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for parent component/provider |

To be put right above the property of component. This decorator assings the property the value this.closest(selector).

### `@Listener(selector, type)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |
| type          | string | The name of the event |

To be put right above the method of component. Replacement for this.querySelector(selector).addEventListener.call(this, type, method);

### `@OnAttrChange(name)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| name          | string | Name of attribute     |

To be put right above the method of component. Method will be call when attribute was change;

### `@On(selector, methodName)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |
| methodName    | string ex. 'onclick' | determines which method you want set |

To be put right above the method of component. Replacement for this.querySelector(selector)[methodName] = (...props) => method.call(this, ...props)

### `@Prop(selector, argument)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |
| argument      | string | determines which property you want get/set |

To be put right above the property of component. Replacement for this.querySelector(selector)[argument]

### `@Ref(selector)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |

To be put right above the property of component. This decorator assings the property the value this.querySelector(selector)

### `@State(...selectors)`

To be put right above the property of component. Selectors define which element in DOM and how shuld be change after change value of property.

#### Examples

````ts
  @State('[helloMessage]')
  public helloMessage: string;
````

Now when property helloMessage was change element `[helloMessage].innerHtml` = helloMessage.


Also you can modified value before putting to DOM

````ts
  @State({ '[completedTaskCounter]': (value) => value.length })
  public array: any[];
````

A decorator configured this way change element `[completedTaskCounter].innerHtml` = array.length.


Other option is change other property of selected element not only innerHtml.

````ts
  @State({ '[completedTaskCounter].color': (value) => value.length ? 'green' : 'red' })
  public array: any[];
````

### `@Subscription()`

To be put right above the method of component. Method will be fire inside connectedCallback. Decorated method should return another function which will be fire in disconnectedCallback to unsubscribe.


## More
To see more information about library please visit our [wiki](https://github.com/PiotrDrozdz96/component-decorators/wiki)
