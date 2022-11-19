chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(1);
  // if (tab.id) {
  //   // if (changeInfo.status == "complete") {
  //   chrome.tabs.sendMessage(tab.id, "enable", () => {
  //     if (!window.chrome.runtime.lastError) {
  //       /* empty */
  //     }
  //   });
  // }
  //   // chrome.scripting.executeScript({
  //   //   files: ["src/script.js"],
  //   //   target: { tabId: tab.id },
  //   // });
  //   // }
  // }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(2);
  // chrome.tabs.sendMessage(activeInfo.tabId, "enable", () => {
  //   if (!window.chrome.runtime.lastError) {
  //     /* empty */
  //   }
  // });
});

chrome.webNavigation.onCommitted.addListener(() => {
  console.log(3);
  // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  //   const id = tabs[0].id;
  //   if (id) {
  //     chrome.tabs.sendMessage(id, "enable", function () {
  //       if (!window.chrome.runtime.lastError) {
  //         /* empty */
  //       }
  //     });
  //   }
  // });
});
