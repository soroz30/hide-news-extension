export const extensionApi = chrome || browser;

export const getSvgUrl = (svg: any) => {
  if (window.chrome) {
    return window.chrome.runtime.getURL(svg.toString());
  }

  return svg;
};
