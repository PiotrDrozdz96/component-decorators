class WebHistory {
  back(): void { window.history.back(); }
  forward(): void { window.history.forward(); }
  go(delta?: number): void { window.history.go(delta); }
  get length(): number { return window.history.length; }
  pushState(data: any, title): void {
    window.history.pushState(data, title, `${window.location.origin}${title}`);
    window.dispatchEvent(new Event('popstate'));
  }
  replaceState(data: any, title): void {
    window.history.replaceState(data, title, `${window.location.origin}${title}`);
    window.dispatchEvent(new Event('popstate'));
  }
  get scrollRestoration(): ScrollRestoration { return window.history.scrollRestoration; }
  get state(): any { return window.history.state; }
}

const webHistory = new WebHistory();

export default webHistory;
