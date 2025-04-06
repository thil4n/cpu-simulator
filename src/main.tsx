import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import Canvas from "./canvas";

import { MemoryProvider, LoggerProvider, RegisterProvider } from "@context";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LoggerProvider>
            <RegisterProvider>
                <MemoryProvider>
                    <Canvas />
                </MemoryProvider>
            </RegisterProvider>
        </LoggerProvider>
    </React.StrictMode>
);
