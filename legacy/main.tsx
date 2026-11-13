import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import App from "./App";

import { MemoryProvider, LoggerProvider, RegisterProvider, ExecutionProvider } from "@context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoggerProvider>
      <RegisterProvider>
        <MemoryProvider>
          <ExecutionProvider>
            <App />
          </ExecutionProvider>
        </MemoryProvider>
      </RegisterProvider>
    </LoggerProvider>
  </React.StrictMode>
);
