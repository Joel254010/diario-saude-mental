import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Localiza o elemento raiz no HTML
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Renderiza a aplicação
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
