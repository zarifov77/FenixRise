import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./index.css";

// Create a client
const queryClient = new QueryClient();

// Apply saved theme before first render to avoid flash
const saved = localStorage.getItem("fenixrise-theme") || "dark";
document.documentElement.setAttribute("data-theme", saved);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
