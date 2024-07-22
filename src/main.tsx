import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/main.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Canvas from "./canvas";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ToastContainer />
        <Canvas />
    </React.StrictMode>
);
