# Web component decorators

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

### `#Prop(selector, argument)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |
| argument      | string | determines which property you want get |

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


## Directivities

```` import 'component-decorators/directivities````

### `<web-for>`

#### Parameters

| Name          | Type    | Description                                      |
| ------------- | ------  | ---------------------                            |
| collection    | Observable<Array> | Iterated array                         |
| initChild     | ($child: HTMLElement) | function will be fire when new child was added to DOM | 


### `<web-if>`

#### Attributes

| Name          | Type    | Description                                      |
| ------------- | ------  | ---------------------                            |
| condition     | boolean | Condition determines which slot will be rendered |

#### Methods

| Name          | Description                                      |
| ------------- | ---------------------                            |
| onConditionChange: (condition: boolean) => void | Fired when condition will change |

#### Slots

| Name          | Description                       |
| ------------- | ---------------------             |
| then          | Rendered when condition is true   |
| else          | Rendered whend condition is false |


### `<web-router>`

#### Attributes

| Name          | Type                 | Description                                      |
| ------------- | ------               | ---------------------                            |
| level         | number (default: 0)  | Determines which url directory will be checked   |


`<web-router>` is component changing content based on window.location.pathname. To use web-router you must initialize it like this.
  
````ts
  const routes: WebRoutes = {
  '/1': () => '<div>1</div>',
  '/2': () => '<div>2</div>',
  '/todo-list': () => '<app-todo-list></app-todo-list>',
  default: () => '<div>default</div>',
};

@Component({ selector: 'app-root', template })
export default class RootComponent extends HTMLElement {
  @Ref('web-router') $routerElement: WebRouterDirective;

  connectedCallback() {
    whenDefined('web-router', () => {
      this.$routerElement.init(routes);
    });
  }
}
````

### `<web-switch>`

#### Attributes

| Name          | Type    | Description                             |
| ------------- | ------  | ---------------------                   |
| state         | string  | Determines which slot will be rendered  |

#### Methods

| Name          | Description                                           |
| ------------- | ---------------------                                 |
| onStateChange: (state: string) => void | Fired when state will change |

#### Slots

| Name          | Description                               |
| ------------- | ---------------------                     |
| String        | Rendered when state is equal as slot name |

### '<web-link>`
  
`<web-link>` is special link component which cooperate with `<web-router>`
  
#### Attributes

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| type          | 'back' \| 'forward' \| 'go' \| 'push' \| 'replace' | Name of method from window.history |
| delta         | number | argument to back method |
| data          | json   | state to push and replace method |
| href          | string | href to push and replace method |
  
  
## Helpers
  
`import [helperName] from 'component-decorators/helpers/[helperName]`
  
### `createElement(quelifiedName, params, children)`
  
#### Parameters
  
| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| quelifiedName | string | Name of tag. It used in `document.createElement(qualifiedName)`  |
| params        | ElementParams \| null | Params for created element |
| children      | Element[] (optional) | Children for created element |

### `createCustomElement(quelifiedName, params, children)`

#### Parameters
  
| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| quelifiedName | string | Name of custom tag.   |
| attributes    | object | Atrtibutes of custom element |
| props         | object | Other props of custom element |

### `createHtmlTemplate(template: string)`

This function create function template with the same rules i described higher describing @Component decorator.

#### Examples

````ts
  this.tableRowTemplate = createHtmlTemplate(this.$slots.trow);

  this.innerHtml = template(this);
````

### `htmlMap(collection, iteratte)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| collection    | array of objects | collection to iterrate  |
| iteratte      | function(item) | callback function to map |

The basic usage is use this function to loop rendering with using template from `createHtmlTemplate`.

````ts
  this.tbody = htmlMap(collection, this.tableRowTemplate);
````

### `new Observable<T>(data: T)`
  
This class create Observable value
  
#### Methods
  
`subscribe((data: T, oldData: T) => void, runInit) => unsubscribe`
  
`next(data: T) => void;`

`get() => T`
  
#### Examples
  
##### Declaration
````ts
  public loading = new Observable<boolean>(false);
````
  
##### Observe
  
````ts
  private loadingUnsubscribe: () => void;
  
  connectedCallback() {
    this.loadingUnsubscribe = this.loaderProvider.loading.subscribe((loading) => {
      this.style.display = loading ? 'flex' : 'none';
    }, true);
  }

  disconnectedCallback() {
    this.loadingUnsubscribe();
  }
````
  
##### Change value
  
````ts
  connectedCallback() {
    this.loaderProvider.loading.next(true);
    setTimeout(() => {
      this.loaderProvider.loading.next(false);
    }, 1000);
  }
````

### `webHistory`
It is special version of window.history contain exactly the same properties, but cooperate with `<web-router>`
  
### `whenDefine(selector, callback)`
It is syntactic sugar for `window.customElements.whenDefined(selector).then(callback)`
