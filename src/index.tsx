import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";

const app = document.createElement("div");
app.id = "markurz-root";
document.body.appendChild(app);

const root = ReactDOM.createRoot(app);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
