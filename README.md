# Web component decorators

## Decorators

```` import {} from 'web-components-decorators/decorators````

### `@Component({ options })`

#### Options

| Name     | Type              | Description                                                                                     |
| -------  | ----------------- | ----------------------------------------------------------------------------------------------- |
| selector | string            | Name of the tag to use. Must include a '-' (minus)                                              |
| template | string (optional) | An inline template for an web component                                                         |
| extends  | string (optional) | The extends property, specifies the built-in element your element inherits from, if any (only relevant to customized built-in elements)|
| style    | CSSStyleDeclarations (optional) | The style property specifies an inline style for an element.                      |
| providers | Component[] (optional) | Array of components/providers, which become parents of template                           |

Replacement for customElements.define(tagname, element, options). To be put right above the class declaration of the web component.

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

### `@OnClick(selector)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |

To be put right above the method of component. Replacement for this.querySelector(selector).onclick = () => method.call(this)

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


### `@WebArray(selector, createItem)`

#### Parameters

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| selector      | string | Selector for child of component |
| createItem    | (item: any, index: number) => HTMLElement | Function changning array elements into HTMLElement |

To be put right above the array property of component. This decorator is special decorator for arrays which expand array prototype to better rerendering. In initial this decorator put into element selected by selector mapped array items. Next you can use methods  of array like pop, push, shift, splice and new method set to change completly elements of array.

## Directivities

```` import {} from 'web-components/directivities````

### `<web-if>`

#### Example

````html
  <web-if isEmptyList>
    <div then>{{messages.emptyState}}</div>
    <ul else todoList></ul>
  </web-if>
````

Inside <web-if> tag you must put two element one with attribute `then` and second with attribute `else`. Based on web-if.condition, component render correct element. You can manipulate condition using `@State` decorator.


````ts
  @State({ 'web-if[isEmptyList].condition': _isEmpty })
  public taskList: Array<string> = [];
````

### `<web-router>`

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

### '<web-link>`
  
`<web-link>` is special link component which cooperate with `<web-router>`
  
#### Attributes

| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| type          | 'back' \| 'forward' \| 'go' \| 'push' \| 'replace' | Name of method from window.history |
| delta         | number | argument to back method |
| data          | any    | state to push and replace method |
| href          | string | href to push and replace method |
  
  
## Helpers
  
`import {} from 'web-components-decorators/helpers`
  
### `createElement(quelifiedName, params, children)`
  
#### Parameters
  
| Name          | Type   | Description           |
| ------------- | ------ | --------------------- |
| quelifiedName | string | Name of tag. It used in `document.createElement(qualifiedName)`  |
| params        | ElementParams \| null | Params for created element |
| children      | Element[] (optional) | Children for created element |
  
### `new Observable<T>(data: T)`
  
This class create Observable value
  
#### Methods
  
`subscribe((data: T, oldData: T) => void, runInit) => unsubscribe`
  
`next(data: T) => void;`
  
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
