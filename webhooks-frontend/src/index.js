import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// NeetoUI CSS imported locally due to React build restrictions
// The CSS file is automatically copied from node_modules via scripts in package.json
// This solves the issue where React cannot resolve @bigbinary/neetoui/dist/index.css
import "./neetoui.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// React 18+ entry point
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
