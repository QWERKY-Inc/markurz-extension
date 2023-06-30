import { decode } from "next-auth/jwt";
import { genericOnClick } from "src/chromeServices/contextMenu";

async function setMessage(token: string | null) {
  const decoded = token
    ? ((await decode({
        token,
        secret: process.env.REACT_APP_NEXTAUTH_SECRET as string,
      })) as { user: { accessToken: string } })
    : undefined;
  chrome.tabs.query({ status: "complete" }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs
          .sendMessage(tab.id, { token: decoded?.user?.accessToken || null })
          .catch((e) =>
            console.error(
              `Could not send message to the tab [${tab.id}/${tab.title}]`,
              e
            )
          );
      }
    });
  });
}

chrome.cookies.onChanged.addListener((reason) => {
  if (
    reason.cookie.domain === process.env.REACT_APP_COOKIE_DOMAIN &&
    reason.cookie.name === process.env.REACT_APP_COOKIE_NAME
  ) {
    setMessage(reason.removed ? null : reason.cookie.value);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async function () {
    if (request.type === "GET_COOKIE") {
      const cookie = await chrome.cookies.getAll({
        domain: process.env.REACT_APP_COOKIE_DOMAIN,
        name: process.env.REACT_APP_COOKIE_NAME,
      });
      if (cookie.length) {
        const decoded = cookie[0].value
          ? ((await decode({
              token: cookie[0].value,
              secret: process.env.REACT_APP_NEXTAUTH_SECRET as string,
            })) as { user: { accessToken: string } })
          : undefined;
        sendResponse({ token: decoded?.user?.accessToken || null });
        return;
      }
    }
    sendResponse({ token: null });
  })();
  return true;
});

chrome.contextMenus.onClicked.addListener(genericOnClick);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create(
    {
      title: "Mark with Markurz",
      contexts: ["selection", "page"],
      id: "markurz",
    },
    function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Context menu error: " + chrome.runtime.lastError.message
        );
      }
    }
  );
});

export {};
