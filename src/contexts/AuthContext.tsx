// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type SupaUser = {
  id: string;
  email: string;
};

type SupaProfile = {
  id: string;
  nome: string;
  email: string;
  water_goal: number;
  notifications_enabled: boolean;
  dark_mode_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

type AuthContextType = {
  user: SupaUser | null;
  profile: SupaProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<SupaProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<SupaProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
   🧩 1. Ao montar, busca sessão ativa e carrega perfil
  ====================================================== */
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Erro ao obter sessão:", error);

      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUser({ id: sessionUser.id, email: sessionUser.email! });
        await loadProfile(sessionUser.id);
      }
      setLoading(false);
    };

    fetchSession();

    // Listener para login/logout automático
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          // 🔁 Redireciona automaticamente para a tela de login
          navigate("/", { replace: true });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  /* =====================================================
   🧩 2. Carregar perfil do usuário logado
  ====================================================== */
  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("Perfil não encontrado:", error.message);
      return;
    }

    setProfile(data);
  }

  /* =====================================================
   🧩 3. Cadastro
  ====================================================== */
  async function signUp(email: string, password: string, name: string) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw new Error(error.message);
    }

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });

      const { error: insertError } = await supabase.from("usuarios").insert([
        {
          id: data.user.id,
          nome: name,
          email: data.user.email,
          water_goal: 8,
          notifications_enabled: true,
          dark_mode_enabled: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) console.error("Erro ao inserir usuário:", insertError);
      await loadProfile(data.user.id);
    }

    setLoading(false);
  }

  /* =====================================================
   🧩 4. Login
  ====================================================== */
  async function signIn(email: string, password: string) {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw new Error(error.message);
    }

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });
      await loadProfile(data.user.id);
    }

    setLoading(false);
  }

  /* =====================================================
   🧩 5. Logout (corrigido)
  ====================================================== */
  async function signOut() {
    try {
      // Sai do Supabase e limpa tudo
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setProfile(null);

      // 🔁 Redireciona imediatamente para a tela de login
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  /* =====================================================
   🧩 6. Atualização de perfil
  ====================================================== */
  async function updateProfile(updates: Partial<SupaProfile>) {
    if (!user) return;

    const { data, error } = await supabase
      .from("usuarios")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    setProfile(data);
  }

  /* =====================================================
   🧩 7. Provider
  ====================================================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================================
 🔹 Hook para consumir o contexto
===================================================== */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
