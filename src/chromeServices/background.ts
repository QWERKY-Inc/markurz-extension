function setMessage(token: string | null) {
  chrome.tabs.query({ status: "complete" }, (tabs) => {
    tabs.map((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { token });
      }
    });
  });
}

chrome.cookies.onChanged.addListener((reason) => {
  if (
    reason.cookie.domain === "www.deepform.net" &&
    reason.cookie.name === "__Secure-next-auth.session-token"
  ) {
    setMessage(reason.cookie.value);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async function () {
    if (request.type === "GET_COOKIE") {
      const cookie = await chrome.cookies.getAll({
        domain: "www.deepform.net",
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
