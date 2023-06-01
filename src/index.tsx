import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";

/**
 * Gets the cookie for the logged-in user.
 * If there is one, inject the token in the page.
 * If there is none, open a login page instead.
 */
function injectPlugin(token: string) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.scripting?.executeScript({
        target: { tabId: tabs[0].id || 0 },
        args: [{ token }],
        func: (args) => {
          if (args.token) {
            sessionStorage.setItem("markurz-token", args.token);
          } else {
            sessionStorage.removeItem("markurz-token");
          }
        },
      });
    }
  );
}

if (chrome.cookies) {
  chrome.cookies.onChanged.addListener((reason) => {
    if (
      reason.cookie.domain === "www.deepform.net" &&
      reason.cookie.name === "__Secure-next-auth.session-token"
    ) {
      injectPlugin(reason.removed ? "" : reason.cookie.value);
    }
  });
  chrome.cookies.getAll(
    { domain: "www.deepform.net", name: "__Secure-next-auth.session-token" },
    (cookie) => {
      if (cookie.length) {
        injectPlugin(cookie[0].value);
      } else {
        injectPlugin("");
      }
    }
  );
  // Inject the plugin only in the content
} else {
  const prevApp = document.getElementById("markurz-root");
  // Make sure we don't have doubloons
  if (prevApp) {
    prevApp.outerHTML = "";
  }
  const app = document.createElement("div");
  app.id = "markurz-root";
  document.documentElement.appendChild(app);

  const root = ReactDOM.createRoot(app);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
