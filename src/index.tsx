import { ApolloProvider } from "@apollo/client";
import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import ReactDOM from "react-dom/client";
import { apolloClient } from "src/apollo";
import ExtensionApp from "src/extension/ExtensionApp";
import { MARKURZ_DIV_NAME } from "src/lib/dom";
import App from "./App";
import theme from "./theme";

/**
 * Gets the cookie for the logged-in user.
 * If there is one, inject the token in the page.
 * If there is none, open a login page instead.
 */
// function injectPlugin(token: string) {
//   chrome.tabs.query(
//     {
//       active: true,
//       currentWindow: true,
//     },
//     (tabs) => {
//       chrome.scripting?.executeScript({
//         target: { tabId: tabs[0].id || 0 },
//         args: [{ token }],
//         func: (args) => {
//           if (args.token) {
//             sessionStorage.setItem("markurz-token", args.token);
//           } else {
//             sessionStorage.removeItem("markurz-token");
//           }
//         },
//       });
//     }
//   );
// }

function injectExtension() {
  const prevApp = document.getElementById(MARKURZ_DIV_NAME);
  // Make sure we don't have doubloons
  if (prevApp) {
    prevApp.outerHTML = "";
  }
  const app = document.createElement("div");
  app.id = MARKURZ_DIV_NAME;
  app.style.position = "absolute";
  app.style.zIndex = "2147483647";
  document.documentElement.appendChild(app);

  const root = ReactDOM.createRoot(app);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ScopedCssBaseline sx={{ backgroundColor: "transparent" }}>
              {process.env.REACT_APP_SIMULATE_LOCALLY && <ExtensionApp />}
              <App />
            </ScopedCssBaseline>
          </LocalizationProvider>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>,
  );
}

if (chrome.cookies) {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <ScopedCssBaseline>
            <ExtensionApp />
          </ScopedCssBaseline>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>,
  );
  // Inject the plugin only in the content
} else {
  injectExtension();
}
