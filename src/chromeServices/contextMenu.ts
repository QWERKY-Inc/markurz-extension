export const genericOnClick = (info: chrome.contextMenus.OnClickData) => {
  // @ts-ignore
  browser.tabs
    .query({ status: "complete", active: true, lastFocusedWindow: true })
    .then((tabs: any[]) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          // @ts-ignore
          browser.tabs
            .sendMessage(tab.id, {
              pageUrl: info.pageUrl,
              selectionText: info.selectionText,
              type: "OPEN_DRAWER",
            })
            .catch((e: any) =>
              console.error(
                `Could not send message to the tab [${tab.id}/${tab.title}]`,
                e,
              ),
            );
        }
      });
    });
};
