export const genericOnClick = (info: chrome.contextMenus.OnClickData) => {
  chrome.tabs.query(
    { status: "complete", active: true, lastFocusedWindow: true },
    (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, {
              pageUrl: info.pageUrl,
              selectionText: info.selectionText,
              type: "OPEN_DRAWER",
            })
            .catch((e) =>
              console.error(
                `Could not send message to the tab [${tab.id}/${tab.title}]`,
                e,
              ),
            );
        }
      });
    },
  );
};
