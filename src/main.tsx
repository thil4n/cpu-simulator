import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import Canvas from "./canvas";

import { MemoryProvider, LoggerProvider } from "@context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoggerProvider>
      <MemoryProvider>
        <Canvas />
      </MemoryProvider>
    </LoggerProvider>
  </React.StrictMode>
);
