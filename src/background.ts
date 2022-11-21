import { extensionApi } from "./common";

extensionApi.tabs.onActivated.addListener(() => {
  extensionApi.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const id = tabs[0].id;
    if (id) {
      extensionApi.tabs.sendMessage(id, "refresh", () => {
        if (!extensionApi.runtime.lastError) {
          /* empty */
        }
      });
    }
  });
});
