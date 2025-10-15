// src/App.tsx
import React, { useLayoutEffect, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

/**
 * 🌙 Tema global escuro/claro sincronizado com localStorage e sistema
 */
function useGlobalTheme() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("darkModeEnabled");
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldDark =
      stored === "true" || (stored === null && systemPrefersDark);

    if (shouldDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "darkModeEnabled") {
        const root = document.documentElement;
        if (e.newValue === "true") root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (ev: MediaQueryListEvent) => {
      const stored = localStorage.getItem("darkModeEnabled");
      if (stored === null) {
        const root = document.documentElement;
        if (ev.matches) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
}

function AppContent() {
  useGlobalTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lavender-400 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Respire fundo. Seu momento de paz começa agora.
          </p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
