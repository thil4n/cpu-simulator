import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import Canvas from "./canvas";

import { MemoryProvider } from "@context/MemoryContext";
import { LoggerProvider } from "@context/LoggerContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoggerProvider>
      <MemoryProvider>
        <Canvas />
      </MemoryProvider>
    </LoggerProvider>
  </React.StrictMode>
);
