import { decode } from "next-auth/jwt";
import { genericOnClick } from "src/chromeServices/contextMenu";

function broadcastMessageToAllTabs(message: object) {
  chrome.tabs.query({ status: "complete" }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs
          .sendMessage(tab.id, message)
          .catch((e) =>
            console.error(
              `Could not send message to the tab [${tab.id}/${tab.title}]`,
              e,
            ),
          );
      }
    });
  });
}

async function setToken(token: string | null) {
  const decoded = token
    ? ((await decode({
        token,
        secret: process.env.REACT_APP_NEXTAUTH_SECRET as string,
      })) as { user: { accessToken: string } })
    : undefined;
  broadcastMessageToAllTabs({ token: decoded?.user?.accessToken || null });
}

chrome.cookies.onChanged.addListener(async (reason) => {
  if (
    reason.cookie.domain === process.env.REACT_APP_COOKIE_DOMAIN &&
    reason.cookie.name === process.env.REACT_APP_COOKIE_NAME
  ) {
    // On overwrite, removed is also true when it is actually updating the cookie, so we avoid to remove it for
    // flickering
    await setToken(
      reason.removed && reason.cause !== "overwrite"
        ? null
        : reason.cookie.value,
    );
  }
});

// @ts-ignore
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

// @ts-ignore
browser.runtime.onInstalled.addListener(async function () {
  chrome.contextMenus.create(
    {
      title: "Mark with Markurz",
      contexts: ["selection", "page"],
      id: "markurz",
    },
    function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Context menu error: " + chrome.runtime.lastError.message,
        );
      }
    },
  );

  const content_scripts = chrome.runtime.getManifest().content_scripts;
  // Reloads all the current scripts in the tabs to avoid any issues after an update
  if (content_scripts) {
    for (const cs of content_scripts) {
      for (const tab of await chrome.tabs.query({ url: cs.matches })) {
        if (tab.id !== undefined) {
          chrome.scripting
            .executeScript({
              target: { tabId: tab.id },
              files: cs.js || [],
            })
            .catch((e) =>
              console.error(
                `Failed to reload scripts for tab [${tab.id}/${tab.title}]`,
                e,
              ),
            );
        }
      }
    }
  }
});

// @ts-ignore
browser.contextMenus.onClicked.addListener(genericOnClick);

export {};
