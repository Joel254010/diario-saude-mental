import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "./lib/supabaseClient"; // ✅ importa o cliente Supabase

// Testa conexão com Supabase (apenas para debug inicial)
console.log("🔗 Conectando ao Supabase:", import.meta.env.VITE_SUPABASE_URL);

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

// 🔹 Função assíncrona para testar a conexão com Supabase
async function testarConexao() {
  try {
    const { error } = await supabase
      .from("pg_stat_activity")
      .select("*", { head: true, count: "exact" });

    if (error) {
      console.error("❌ Erro ao conectar Supabase:", error.message);
    } else {
      console.log("✅ Supabase conectado com sucesso!");
    }
  } catch (err) {
    console.error("❌ Falha inesperada na conexão Supabase:", err);
  }
}

// Chama o teste assim que o app inicia
testarConexao();
