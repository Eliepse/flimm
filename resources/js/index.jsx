import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./app.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/authProvider.jsx";

//import "../scss/app.scss";
import "./bootstrap";

const root = createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
);
