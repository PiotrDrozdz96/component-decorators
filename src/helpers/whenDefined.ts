const whenDefined = (selector, callback: () => void) => {
  window.customElements.whenDefined(selector).then(callback);
};

export default whenDefined;
