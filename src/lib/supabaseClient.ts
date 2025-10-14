import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔍 Verificação segura — evita erro em tela branca
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis do Supabase não foram carregadas corretamente.");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey);
  throw new Error("As variáveis do Supabase estão ausentes. Verifique o arquivo .env na raiz do projeto.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("✅ Supabase Client inicializado com sucesso!");
