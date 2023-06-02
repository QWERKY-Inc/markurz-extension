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

chrome.cookies.getAll(
  { domain: "www.deepform.net", name: "__Secure-next-auth.session-token" },
  (cookie) => {
    if (cookie.length) {
      setMessage(cookie[0].value);
    } else {
      setMessage(null);
    }
  }
);

export {};
