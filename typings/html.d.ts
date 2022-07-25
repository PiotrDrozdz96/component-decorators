declare module '*.html' {
  const template: string;
  export default template;
}

interface HTMLElement {
  connectedCallback(): void;
}

interface Element {
  rerender(item: any, index: number);
}

interface ChildNode {
  rerender(item: any, index: number);
}
