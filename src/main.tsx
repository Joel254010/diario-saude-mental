import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ importa o Provider

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Agora envolve tudo com o contexto */}
      <App />
    </AuthProvider>
  </StrictMode>
);
