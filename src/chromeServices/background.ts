import { decode } from "next-auth/jwt";

async function setMessage(token: string | undefined) {
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
          .sendMessage(tab.id, { token: decoded?.user?.accessToken })
          .catch((e) =>
            console.error(`Could not send message to the tab ${tab.id}`, e)
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
    setMessage(reason.removed ? undefined : reason.cookie.value);
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
        sendResponse({ token: decoded?.user?.accessToken });
        return;
      }
    }
    sendResponse({ token: undefined });
  })();
  return true;
});

export {};
