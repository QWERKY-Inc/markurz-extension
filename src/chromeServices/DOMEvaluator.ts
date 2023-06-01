import { DOMMessage, DOMMessageResponse } from "../types";

// Function called when a new message is received
const messagesFromReactAppListener = async (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[content.js]. Message received", msg);

  if (msg.type === "GET_COOKIE") {
    chrome.cookies.getAll(
      { domain: "www.deepform.net", name: "__Secure-next-auth.session-token" },
      (cookie) => {
        console.log("get cookie", cookie);
        if (cookie.length) {
          sendResponse({ title: cookie[0].value || "", headlines: [] });
        } else {
          sendResponse({ title: "nothing" || "", headlines: [] });
        }
      }
    );
    return;
  }

  const headlines = Array.from(document.getElementsByTagName<"h1">("h1")).map(
    (h1) => h1.innerText
  );

  // Prepare the response object with information about the site
  const response: DOMMessageResponse = {
    title: document.title,
    headlines,
  };

  sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
