chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const id = tabs[0].id;
    if (id) {
      chrome.tabs.sendMessage(id, "refresh", () => {
        if (!chrome.runtime.lastError) {
          /* empty */
        }
      });
    }
  });
});
