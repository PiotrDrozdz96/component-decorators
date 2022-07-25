interface ElementParams {
  [index: string]: any,
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  qualifiedName: K | string,
  params: ElementParams | null,
  children?: Array<Element>,
): HTMLElementTagNameMap[K] | HTMLElement {
  const element = document.createElement(qualifiedName);

  if(params) {
    Object.keys(params).forEach((key: string) => {
      element[key] = params[key];
    });
  }

  if (children) {
    children.forEach((child: Element) => {
      element.appendChild(child);
    });
  }

  return element;
}

export default createElement;
