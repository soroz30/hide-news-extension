export const ACTIVE = "active";
export const WORDS = "words";
export const REFRESH = "refresh";
export const extensionApi = chrome || browser;

export const getSvgUrl = (svg: any) => {
  if (window.chrome) {
    return window.chrome.runtime.getURL(svg.toString());
  }

  return svg;
};

export const refreshActiveTab = () => {
  extensionApi.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const id = tabs[0].id;
    if (id) {
      extensionApi.tabs.sendMessage(id, { message: REFRESH }, () => {
        if (!extensionApi.runtime.lastError) {
          /* empty */
        }
      });
    }
  });
};
