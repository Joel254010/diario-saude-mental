import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type LocalUser = {
  id: string;
  email: string;
  password: string;
  name: string;
};

type LocalProfile = {
  id: string;
  name: string;
  water_goal: number;
  notifications_enabled: boolean;
  dark_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: LocalUser | null;
  profile: LocalProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<LocalProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão salva
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedProfile = localStorage.getItem("auth_profile");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    setLoading(false);
  }, []);

  // Função para criar novo usuário
  async function signUp(email: string, password: string, name: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const existing = users.find((u: LocalUser) => u.email === email);
    if (existing) throw new Error("E-mail já cadastrado.");

    const newUser: LocalUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Cria também o perfil
    const newProfile: LocalProfile = {
      id: newUser.id,
      name,
      water_goal: 8,
      notifications_enabled: true,
      dark_mode_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${newUser.id}`, JSON.stringify(newProfile));

    // Define sessão
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    localStorage.setItem("auth_profile", JSON.stringify(newProfile));
    setUser(newUser);
    setProfile(newProfile);
  }

  // Função para login
  async function signIn(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u: LocalUser) => u.email === email && u.password === password
    );

    if (!found) throw new Error("Credenciais inválidas.");

    const savedProfile = localStorage.getItem(`profile_${found.id}`);
    const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;

    localStorage.setItem("auth_user", JSON.stringify(found));
    if (parsedProfile)
      localStorage.setItem("auth_profile", JSON.stringify(parsedProfile));

    setUser(found);
    setProfile(parsedProfile);
  }

  // Função de logout
  async function signOut() {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_profile");
    setUser(null);
    setProfile(null);
  }

  // Atualiza o perfil
  async function updateProfile(updates: Partial<LocalProfile>) {
    if (!user) return;

    const key = `profile_${user.id}`;
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    const updated = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem("auth_profile", JSON.stringify(updated));
    setProfile(updated);
  }

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
