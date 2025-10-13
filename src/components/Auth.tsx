import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error("Por favor, digite seu nome");
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 🌸 Padrão visual sutil de fundo */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      {/* 🌟 Card principal */}
      <div className="w-full max-w-lg relative">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 backdrop-blur-sm bg-opacity-95 transform scale-105 transition-all">
          {/* Ícone superior */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-lavender-400 to-blue-300 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-lavender-600 to-blue-500 bg-clip-text text-transparent">
            Diário de Saúde Mental
          </h1>

          <p className="text-center text-gray-600 mb-10 text-base">
            Bem-vindo(a) ao seu espaço de calma e gratidão 🌸
          </p>

          {/* 🔐 Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
                  placeholder="Como você gostaria de ser chamado?"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-lavender-500 to-blue-400 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
            </button>
          </form>

          {/* Alternar modo login/cadastro */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-lavender-600 hover:text-lavender-700 text-sm font-medium transition-colors"
            >
              {isSignUp
                ? "Já tem uma conta? Entre"
                : "Não tem conta? Cadastre-se"}
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Mais um projeto desenvolvido por{" "}
            <span className="font-semibold text-lavender-700">My GlobyX</span>
          </p>
          <p className="mt-1 text-gray-500">
            Inspirando Transformações Reais 🌿
          </p>
        </div>
      </div>
    </div>
  );
}
