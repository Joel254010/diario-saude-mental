import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Target, CheckCircle, Leaf } from "lucide-react";

type Props = {
  onBack: () => void;
};

type LocalChallenge = {
  id: string;
  user_id: string;
  challenge_type: keyof typeof challengeInfo;
  start_date: string;
  current_day: number;
  completed: boolean;
  completed_at: string | null;
};

const challengeInfo = {
  "21_days_gratitude": {
    name: "21 Dias de Gratidão",
    description: "Pratique gratidão todos os dias por 21 dias",
    days: 21,
    color: "from-green-400 to-emerald-300",
    tasks: [
      "Liste 3 coisas boas do dia",
      "Envie uma mensagem positiva para alguém",
      "Observe algo bonito na natureza",
      "Agradeça por uma refeição",
      "Reconheça um ato de gentileza",
    ],
  },
  "7_days_light_mind": {
    name: "7 Dias para Mente Leve",
    description: "Uma semana focada em leveza mental e emocional",
    days: 7,
    color: "from-blue-400 to-cyan-300",
    tasks: [
      "Pratique 5 minutos de respiração",
      "Escreva seus pensamentos sem filtro",
      "Faça uma atividade que ama",
      "Desconecte-se das redes sociais por 2 horas",
      "Pratique o perdão (a si mesmo ou outros)",
    ],
  },
  "30_days_selfcare": {
    name: "30 Dias de Autocuidado",
    description: "Um mês dedicado a cuidar de você",
    days: 30,
    color: "from-pink-400 to-rose-300",
    tasks: [
      "Beba 8 copos de água",
      "Durma pelo menos 7 horas",
      "Faça uma refeição saudável",
      "Movimente seu corpo (caminhada, dança, yoga)",
      "Reserve 15 minutos só para você",
    ],
  },
};

export default function Challenges({ onBack }: Props) {
  const { user } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<LocalChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  function getKey() {
    return `challenges_${user?.id}`;
  }

  function loadChallenges() {
    if (!user) return;
    const data: LocalChallenge[] = JSON.parse(localStorage.getItem(getKey()) || "[]");
    setActiveChallenges(data);
  }

  function saveChallenges(data: LocalChallenge[]) {
    localStorage.setItem(getKey(), JSON.stringify(data));
    setActiveChallenges(data);
  }

  function startChallenge(type: LocalChallenge["challenge_type"]) {
    if (!user) return;
    setLoading(true);

    setTimeout(() => {
      const challenges: LocalChallenge[] = JSON.parse(localStorage.getItem(getKey()) || "[]");
      const newChallenge: LocalChallenge = {
        id: crypto.randomUUID(),
        user_id: user.id,
        challenge_type: type,
        start_date: new Date().toISOString(),
        current_day: 1,
        completed: false,
        completed_at: null,
      };
      challenges.push(newChallenge);
      saveChallenges(challenges);
      setLoading(false);
    }, 300);
  }

  function incrementDay(
    challengeId: string,
    currentDay: number,
    totalDays: number
  ) {
    const challenges: LocalChallenge[] = JSON.parse(localStorage.getItem(getKey()) || "[]");
    const index = challenges.findIndex((c) => c.id === challengeId);
    if (index < 0) return;

    const newDay = currentDay + 1;
    const completed = newDay > totalDays;

    challenges[index].current_day = Math.min(newDay, totalDays);
    challenges[index].completed = completed;
    challenges[index].completed_at = completed
      ? new Date().toISOString()
      : null;

    saveChallenges(challenges);
  }

  function getChallengeTask(
    type: LocalChallenge["challenge_type"],
    day: number
  ): string {
    const tasks = challengeInfo[type].tasks;
    return tasks[(day - 1) % tasks.length];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-lavender-600 to-blue-500 bg-clip-text text-transparent">
          Desafios de Gratidão
        </h1>

        {/* Desafios Ativos */}
        {activeChallenges.filter((c) => !c.completed).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Desafios Ativos</h2>
            <div className="space-y-4">
              {activeChallenges
                .filter((c) => !c.completed)
                .map((challenge) => {
                  const info = challengeInfo[challenge.challenge_type];
                  const progress =
                    (challenge.current_day / info.days) * 100;

                  return (
                    <div
                      key={challenge.id}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {info.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {info.description}
                          </p>
                        </div>
                        <div
                          className={`p-3 bg-gradient-to-br ${info.color} rounded-xl`}
                        >
                          <Target className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>
                            Dia {challenge.current_day} de {info.days}
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${info.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Tarefa de hoje:
                        </p>
                        <p className="text-gray-800 font-medium">
                          {getChallengeTask(
                            challenge.challenge_type,
                            challenge.current_day
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          incrementDay(
                            challenge.id,
                            challenge.current_day,
                            info.days
                          )
                        }
                        disabled={challenge.completed}
                        className={`w-full bg-gradient-to-r ${info.color} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all`}
                      >
                        {challenge.completed
                          ? "Desafio Concluído"
                          : "Marcar Dia Como Completo"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Iniciar Novo Desafio */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Começar Novo Desafio
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(challengeInfo) as [
              LocalChallenge["challenge_type"],
              (typeof challengeInfo)["21_days_gratitude"]
            ][]).map(([type, info]) => {
              const hasActive = activeChallenges.some(
                (c) => c.challenge_type === type && !c.completed
              );

              return (
                <button
                  key={type}
                  onClick={() => startChallenge(type)}
                  disabled={hasActive || loading}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left ${
                    hasActive ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div
                    className={`p-3 bg-gradient-to-br ${info.color} rounded-xl w-fit mb-4`}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{info.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {info.description}
                  </p>
                  <p className="text-xs text-gray-500">{info.days} dias</p>
                  {hasActive && (
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                      Já ativo
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desafios Concluídos */}
        {activeChallenges.filter((c) => c.completed).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Desafios Concluídos
            </h2>
            <div className="space-y-4">
              {activeChallenges
                .filter((c) => c.completed)
                .map((challenge) => {
                  const info = challengeInfo[challenge.challenge_type];
                  return (
                    <div
                      key={challenge.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="text-lg font-bold text-green-900">
                            {info.name}
                          </h3>
                          <p className="text-sm text-green-700">
                            Concluído em{" "}
                            {challenge.completed_at
                              ? new Date(
                                  challenge.completed_at
                                ).toLocaleDateString("pt-BR")
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <p className="font-semibold text-green-900">
                            Parabéns!
                          </p>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Você completou seu ciclo de{" "}
                          {info.name.toLowerCase()}. Continue cultivando o
                          bem-estar.
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
