import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { ArrowLeft, TrendingUp, Flame, Cloud } from "lucide-react";

type Props = {
  onBack: () => void;
};

type Registro = {
  id: string;
  id_usuario: string;
  data: string;
  humor: string | number;
  gratitude_1?: string | null;
  gratitude_2?: string | null;
  gratitude_3?: string | null;
  descricao?: string | null;
};

export default function Progress({ onBack }: Props) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Registro[]>([]);
  const [weeklyMoods, setWeeklyMoods] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [topWords, setTopWords] = useState<{ word: string; count: number }[]>(
    []
  );

  useEffect(() => {
    if (user?.id) loadData();
  }, [user]);

  /** 🔍 Busca registros do Supabase */
  async function loadData() {
    const { data, error } = await supabase
      .from("registros")
      .select("*")
      .eq("id_usuario", user!.id)
      .order("data", { ascending: false });

    if (data) {
      setEntries(data);
      calculateWeeklyMoods(data);
      calculateStreak(data);
      calculateTopWords(data);
    }
  }

  function calculateWeeklyMoods(entries: Registro[]) {
    const last7 = [...entries]
      .slice(0, 7)
      .reverse()
      .map((e) => Number(e.humor || 3));
    setWeeklyMoods(last7);
  }

  function calculateStreak(entries: Registro[]) {
    let currentStreak = 0;

    const sorted = [...entries].sort(
      (a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const entryDate = new Date(sorted[i].data);
      entryDate.setHours(0, 0, 0, 0);

      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      expected.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === expected.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  }

  function calculateTopWords(entries: Registro[]) {
    const wordCount: Record<string, number> = {};
    const stopWords = new Set([
      "o",
      "a",
      "de",
      "da",
      "do",
      "e",
      "para",
      "com",
      "em",
      "um",
      "uma",
      "que",
      "é",
      "os",
      "as",
      "dos",
      "das",
    ]);

    entries.forEach((entry) => {
      const texts = [
        entry.gratitude_1,
        entry.gratitude_2,
        entry.gratitude_3,
        entry.descricao,
      ].filter(Boolean);

      texts.forEach((text) => {
        if (text) {
          const words = text.toLowerCase().match(/\b\w+\b/g) || [];
          words.forEach((word) => {
            if (word.length > 3 && !stopWords.has(word)) {
              wordCount[word] = (wordCount[word] || 0) + 1;
            }
          });
        }
      });
    });

    const sorted = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    setTopWords(sorted);
  }

  const avgMood =
    weeklyMoods.length > 0
      ? (weeklyMoods.reduce((a, b) => a + b, 0) / weeklyMoods.length).toFixed(1)
      : "0";

  const maxMood = 5;
  const chartHeight = 200;

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
          Meu Progresso
        </h1>

        {/* Sequência + Humor médio */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sequência Atual</p>
                <p className="text-3xl font-bold text-orange-600">
                  {streak} dias
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Continue registrando seus dias para manter sua sequência!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Humor Médio (7 dias)</p>
                <p className="text-3xl font-bold text-green-600">{avgMood}/5</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {parseFloat(avgMood) >= 4
                ? "Você está muito bem!"
                : parseFloat(avgMood) >= 3
                ? "Continue cuidando de você."
                : "Lembre-se de ser gentil consigo mesmo."}
            </p>
          </div>
        </div>

        {/* Gráfico semanal */}
        {weeklyMoods.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-6">Humor Semanal</h2>
            <div
              className="flex items-end justify-between gap-2"
              style={{ height: chartHeight }}
            >
              {weeklyMoods.map((mood, index) => {
                const height = (mood / maxMood) * 100;
                const colors = [
                  "bg-blue-400",
                  "bg-blue-400",
                  "bg-yellow-400",
                  "bg-green-400",
                  "bg-green-500",
                ];

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full relative"
                      style={{ height: chartHeight - 40 }}
                    >
                      <div
                        className={`w-full ${
                          colors[mood - 1]
                        } rounded-t-lg absolute bottom-0 transition-all duration-500`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                        (new Date().getDay() -
                          weeklyMoods.length +
                          index +
                          1 +
                          7) %
                          7
                      ]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Palavras frequentes */}
        {topWords.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Cloud className="w-6 h-6 text-lavender-500" />
              <h2 className="text-xl font-semibold">Palavras Mais Frequentes</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {topWords.map((item) => {
                const size = Math.max(14, Math.min(32, 14 + item.count * 2));
                return (
                  <span
                    key={item.word}
                    className="px-4 py-2 bg-gradient-to-r from-lavender-100 to-blue-100 rounded-full font-medium text-gray-700 hover:scale-110 transition-transform"
                    style={{ fontSize: `${size}px` }}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>

            {topWords[0] && topWords[0].count >= 3 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-lavender-50 to-blue-50 rounded-xl">
                <p className="text-gray-700">
                  Você mencionou{" "}
                  <span className="font-bold text-lavender-600">
                    {topWords[0].word}
                  </span>{" "}
                  {topWords[0].count} vezes — isso mostra o quanto é importante
                  para você.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sem dados */}
        {entries.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <p className="text-gray-600 text-lg">
              Comece a registrar seus dias para ver seu progresso aqui!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
