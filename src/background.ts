chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const id = tabs[0].id;
    if (id) {
      chrome.tabs.sendMessage(id, "refresh", () => {
        if (!window.chrome.runtime.lastError) {
          /* empty */
        }
      });
    }
  });
});
