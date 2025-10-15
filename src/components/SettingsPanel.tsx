// src/components/SettingsPanel.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  UserCircle,
  BellRing,
  Moon,
  Trash,
  Save,
  LogOut,
} from "lucide-react";

type Props = {
  onBack: () => void;
};

export default function SettingsPanel({ onBack }: Props) {
  const { user, profile, updateProfile, signOut } = useAuth();

  // ⛳ Corrigido: de name para nome
  const [nome, setNome] = useState(profile?.nome || "");
  const [waterGoal, setWaterGoal] = useState<number>(profile?.water_goal || 8);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    profile?.notifications_enabled ?? true
  );
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(
    profile?.dark_mode_enabled ?? false
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* =====================================================
   🌓 Modo escuro – sincroniza com localStorage
  ====================================================== */
  useEffect(() => {
    const savedDark = localStorage.getItem("darkModeEnabled") === "true";
    setDarkModeEnabled(savedDark);
    if (savedDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (darkModeEnabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkModeEnabled", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkModeEnabled", "false");
    }
  }, [darkModeEnabled]);

  /* =====================================================
   💾 Salvar alterações de perfil
  ====================================================== */
  async function handleSave() {
    if (!user) return;
    setLoading(true);
    setSaved(false);

    try {
      await updateProfile({
        nome,
        water_goal: waterGoal,
        notifications_enabled: notificationsEnabled,
        dark_mode_enabled: darkModeEnabled,
      });
      setSaved(true);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  /* =====================================================
   🗑️ Exclusão de conta (usa signOut)
  ====================================================== */
  async function handleDeleteAccount() {
    if (!user) return;
    try {
      await signOut(); // o contexto já redireciona
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
    }
  }

  /* =====================================================
   🚪 Logout manual
  ====================================================== */
  async function handleLogout() {
    try {
      await signOut();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-lavender-600 to-blue-500 bg-clip-text text-transparent">
          Configurações
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transition-colors">
          {/* Nome */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UserCircle className="w-4 h-4" />
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
            />
          </div>

          {/* Meta de Hidratação */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta de Hidratação (copos/dia)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={waterGoal}
              onChange={(e) => setWaterGoal(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
            />
          </div>

          {/* Notificações */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <BellRing className="w-5 h-5 text-lavender-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Notificações
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lembretes diários
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                notificationsEnabled
                  ? "bg-lavender-500"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Modo escuro */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-lavender-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Modo Noturno
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tema escuro
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkModeEnabled(!darkModeEnabled)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkModeEnabled
                  ? "bg-gradient-to-r from-lavender-500 to-blue-400"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  darkModeEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sucesso */}
          {saved && (
            <div className="bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-xl p-4 text-center transition-all">
              <p className="text-green-800 dark:text-green-100 font-medium">
                Configurações salvas com sucesso!
              </p>
            </div>
          )}

          {/* Salvar */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-lavender-500 to-blue-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>

          {/* 🔹 Botão de Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-300 font-medium hover:text-blue-800 dark:hover:text-white py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>

          {/* Exclusão */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash className="w-5 h-5" />
                Excluir Conta
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Tem certeza? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-all"
                  >
                    Confirmar Exclusão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Mais um projeto desenvolvido por{" "}
            <span className="font-semibold">My GlobyX</span>
          </p>
          <p className="mt-1">Inspirando Transformações Reais 🌿</p>
        </div>
      </div>
    </div>
  );
}
