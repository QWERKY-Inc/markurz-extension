import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const app = document.createElement("div");
app.id = "markurz-root";
document.body.appendChild(app);

const root = ReactDOM.createRoot(app);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
