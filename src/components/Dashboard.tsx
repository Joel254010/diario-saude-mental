import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getDailyMessage } from "../data/messages";
import {
  SunMedium,
  Droplet,
  BookOpen,
  TrendingUp,
  Target,
  Mail,
  Settings,
  LogOut,
  Heart,
  Utensils,
} from "lucide-react";

import DailyJournal from "./DailyJournal";
import Progress from "./Progress";
import Challenges from "./Challenges";
import FutureLetters from "./FutureLetters";
import SettingsPanel from "./SettingsPanel";
import CardapioSaudavel from "./CardapioSaudavel";
import SOSButton from "./SOSButton";
import { supabase } from "../lib/supabaseClient";

type View =
  | "dashboard"
  | "journal"
  | "progress"
  | "challenges"
  | "letters"
  | "settings"
  | "cardapio";

type Registro = {
  id: string;
  id_usuario: string;
  data: string;
  humor: string | null;
  descricao: string | null;
  created_at: string;
  water_intake?: number;
};

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [todayEntry, setTodayEntry] = useState<Registro | null>(null);
  const [recentEntries, setRecentEntries] = useState<Registro[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);

  const today = new Date().toISOString().split("T")[0];
  const dailyMessage = getDailyMessage();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    if (user?.id) {
      fetchTodayEntry();
      fetchRecentEntries();
    }
  }, [user]);

  async function fetchTodayEntry() {
    const { data, error } = await supabase
      .from("registros")
      .select("*")
      .eq("id_usuario", user!.id)
      .eq("data", today)
      .single();

    if (data) {
      setTodayEntry(data);
      setWaterIntake(data.water_intake || 0);
    } else {
      setTodayEntry(null);
      setWaterIntake(0);
    }
  }

  async function fetchRecentEntries() {
    const { data } = await supabase
      .from("registros")
      .select("*")
      .eq("id_usuario", user!.id)
      .order("data", { ascending: false })
      .limit(7);

    if (data) {
      setRecentEntries(data);
    }
  }

  async function incrementWater() {
    const newAmount = waterIntake + 1;
    setWaterIntake(newAmount);

    if (todayEntry) {
      const { error } = await supabase
        .from("registros")
        .update({ water_intake: newAmount })
        .eq("id", todayEntry.id);

      if (!error) fetchTodayEntry();
    } else {
      const { data, error } = await supabase
        .from("registros")
        .insert({
          id_usuario: user!.id,
          data: today,
          humor: null,
          descricao: null,
          water_intake: newAmount,
        })
        .select()
        .single();

      if (data) {
        setTodayEntry(data);
        fetchRecentEntries();
      }
    }
  }

  const waterGoal = profile?.water_goal || 8;
  const waterProgress = Math.min((waterIntake / waterGoal) * 100, 100);

  function getMoodColor(score: number | null): string {
    if (score === 5) return "bg-green-500";
    if (score === 4) return "bg-lime-400";
    if (score === 3) return "bg-yellow-400";
    if (score === 2) return "bg-orange-400";
    if (score === 1) return "bg-red-400";
    return "bg-gray-300";
  }

  if (currentView === "journal")
    return (
      <DailyJournal
        onBack={() => {
          setCurrentView("dashboard");
          fetchTodayEntry();
          fetchRecentEntries();
        }}
      />
    );

  if (currentView === "progress")
    return <Progress onBack={() => setCurrentView("dashboard")} />;

  if (currentView === "challenges")
    return <Challenges onBack={() => setCurrentView("dashboard")} />;

  if (currentView === "letters")
    return <FutureLetters onBack={() => setCurrentView("dashboard")} />;

  if (currentView === "settings")
    return <SettingsPanel onBack={() => setCurrentView("dashboard")} />;

  if (currentView === "cardapio")
    return <CardapioSaudavel onBack={() => setCurrentView("dashboard")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {greeting}, {profile?.name || "amigo(a)"}{" "}
              <SunMedium className="inline w-8 h-8 text-yellow-500" />
            </h1>
            <p className="text-lg text-gray-700">Hoje é um novo começo.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView("settings")}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              title="Configurações"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={signOut}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Mensagem diária */}
        <div className="bg-gradient-to-r from-lavender-400 to-blue-300 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              {dailyMessage}
            </p>
          </div>
        </div>

        {/* Hidratação + Diário */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Droplet className="w-6 h-6 text-blue-500" />
                Hidratação
              </h2>
              <span className="text-sm text-gray-600">
                {waterIntake}/{waterGoal} copos
              </span>
            </div>

            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500 rounded-full"
                  style={{ width: `${waterProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={incrementWater}
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-300 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Registrar Copo de Água
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-lavender-500" />
              Meu Diário
            </h2>

            {todayEntry ? (
              <div className="space-y-3">
                <p className="text-gray-600">Você já registrou seu dia hoje!</p>
                <button
                  onClick={() => setCurrentView("journal")}
                  className="w-full bg-gradient-to-r from-lavender-500 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Ver/Editar Entrada
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">Como você está se sentindo?</p>
                <button
                  onClick={() => setCurrentView("journal")}
                  className="w-full bg-gradient-to-r from-lavender-500 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Registrar Meu Dia
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cartões */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Meu Progresso"
            subtitle="Veja sua evolução e estatísticas"
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            bg="bg-green-100"
            hover="group-hover:bg-green-200"
            onClick={() => setCurrentView("progress")}
          />
          <DashboardCard
            title="Desafios"
            subtitle="Participe de desafios de bem-estar"
            icon={<Target className="w-6 h-6 text-orange-600" />}
            bg="bg-orange-100"
            hover="group-hover:bg-orange-200"
            onClick={() => setCurrentView("challenges")}
          />
          <DashboardCard
            title="Meu Cardápio Saudável"
            subtitle="Monte e registre suas refeições diárias"
            icon={<Utensils className="w-6 h-6 text-purple-600" />}
            bg="bg-purple-100"
            hover="group-hover:bg-purple-200"
            onClick={() => setCurrentView("cardapio")}
          />
        </div>

        {/* Cartas para o Futuro */}
        <button
          onClick={() => setCurrentView("letters")}
          className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
              <Mail className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold">Cartas para o Futuro</h3>
          </div>
          <p className="text-gray-600">Escreva mensagens para seu eu futuro</p>
        </button>

        {/* Calendário de Humor */}
        {recentEntries.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Calendário de Humor</h2>
            <div className="flex gap-2 flex-wrap">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="group relative">
                  <div
                    className={`w-12 h-12 rounded-xl ${getMoodColor(
                      Number(entry.humor)
                    )} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                  >
                    <span className="text-white font-medium text-sm">
                      {new Date(entry.data).getDate()}
                    </span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    {new Date(entry.data).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 text-center py-6 bg-white rounded-2xl shadow-lg">
          <Heart className="w-8 h-8 text-lavender-500 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">
            Cuidar da mente é um ato de amor próprio
          </p>
        </div>
      </div>

      <SOSButton />
    </div>
  );
}

function DashboardCard({
  title,
  subtitle,
  icon,
  bg,
  hover,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bg: string;
  hover: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 ${bg} rounded-xl ${hover} transition-colors`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{subtitle}</p>
    </button>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="currentColor"
      />
      <path
        d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"
        fill="currentColor"
      />
      <path
        d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"
        fill="currentColor"
      />
    </svg>
  );
}
