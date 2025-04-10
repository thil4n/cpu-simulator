import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import App from "./App";

import { MemoryProvider, LoggerProvider, RegisterProvider } from "@context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoggerProvider>
      <RegisterProvider>
        <MemoryProvider>
          <App />
        </MemoryProvider>
      </RegisterProvider>
    </LoggerProvider>
  </React.StrictMode>
);
