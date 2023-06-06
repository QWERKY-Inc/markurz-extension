function setMessage(token: string | null) {
  chrome.tabs.query({ status: "complete" }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs
          .sendMessage(tab.id, { token })
          .catch((e) =>
            console.error(`Could not send message to the tab ${tab.id}`, e)
          );
      }
    });
  });
}

chrome.cookies.onChanged.addListener((reason) => {
  if (
    reason.cookie.domain === process.env.REACT_APP_LOGIN_URL &&
    reason.cookie.name === "__Secure-next-auth.session-token"
  ) {
    setMessage(reason.removed ? null : reason.cookie.value);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async function () {
    if (request.type === "GET_COOKIE") {
      const cookie = await chrome.cookies.getAll({
        domain: process.env.REACT_APP_LOGIN_URL,
        name: "__Secure-next-auth.session-token",
      });
      if (cookie.length) {
        sendResponse({ token: cookie[0].value });
        return;
      }
    }
    sendResponse({ token: null });
  })();
  return true;
});

export {};
