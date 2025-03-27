import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import Canvas from "./canvas";

import { MemoryProvider } from "@context/MemoryContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MemoryProvider>
      <Canvas />
    </MemoryProvider>
  </React.StrictMode>
);
