import { ApolloProvider } from "@apollo/client";
import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import ReactDOM from "react-dom/client";
import { apolloClient } from "src/apollo";
import ExtensionApp from "src/extension/ExtensionApp";
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

if (chrome.cookies) {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
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
    </React.StrictMode>
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
  app.style.position = "absolute";
  app.style.zIndex = "99999";
  document.documentElement.appendChild(app);

  const root = ReactDOM.createRoot(app);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ScopedCssBaseline sx={{ backgroundColor: "transparent" }}>
              <App />
            </ScopedCssBaseline>
          </LocalizationProvider>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
}
