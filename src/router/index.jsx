import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Canvas from "../pages/Canvas";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Canvas />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
