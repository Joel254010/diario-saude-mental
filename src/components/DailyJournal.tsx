import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Smile, Meh, Frown, SmilePlus, Heart } from "lucide-react";

const moodEmojis = [
  { score: 1, emoji: "😢", label: "Muito triste" },
  { score: 2, emoji: "😟", label: "Triste" },
  { score: 3, emoji: "😐", label: "Neutro" },
  { score: 4, emoji: "😊", label: "Feliz" },
  { score: 5, emoji: "😄", label: "Muito feliz" },
];

type Props = {
  onBack: () => void;
};

type LocalEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  mood_score: number;
  gratitude_1: string | null;
  gratitude_2: string | null;
  gratitude_3: string | null;
  reflection: string | null;
  water_intake: number;
  meal_plan: {
    breakfast?: string;
    lunch?: string;
    snack?: string;
    dinner?: string;
  } | null;
};

export default function DailyJournal({ onBack }: Props) {
  const { user } = useAuth();
  const [moodScore, setMoodScore] = useState(3);
  const [gratitude1, setGratitude1] = useState("");
  const [gratitude2, setGratitude2] = useState("");
  const [gratitude3, setGratitude3] = useState("");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadTodayEntry();
  }, []);

  /** 🔹 Carrega entrada do dia do localStorage */
  function loadTodayEntry() {
    if (!user) return;
    const key = `daily_entries_${user.id}`;
    const entries: LocalEntry[] = JSON.parse(localStorage.getItem(key) || "[]");
    const existing = entries.find((e) => e.entry_date === today);

    if (existing) {
      setMoodScore(existing.mood_score);
      setGratitude1(existing.gratitude_1 || "");
      setGratitude2(existing.gratitude_2 || "");
      setGratitude3(existing.gratitude_3 || "");
      setReflection(existing.reflection || "");
    }
  }

  /** 🔹 Salva a entrada do dia no localStorage */
  function handleSave() {
    if (!user) return;
    setLoading(true);
    setSaved(false);

    const key = `daily_entries_${user.id}`;
    const entries: LocalEntry[] = JSON.parse(localStorage.getItem(key) || "[]");
    const existingIndex = entries.findIndex((e) => e.entry_date === today);

    const newEntry: LocalEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : crypto.randomUUID(),
      user_id: user.id,
      entry_date: today,
      mood_score: moodScore,
      gratitude_1: gratitude1 || null,
      gratitude_2: gratitude2 || null,
      gratitude_3: gratitude3 || null,
      reflection: reflection || null,
      water_intake:
        existingIndex >= 0 ? entries[existingIndex].water_intake : 0,
      meal_plan:
        existingIndex >= 0 ? entries[existingIndex].meal_plan || null : null,
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    localStorage.setItem(key, JSON.stringify(entries));
    setSaved(true);

    setTimeout(() => {
      setLoading(false);
      onBack();
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-lavender-600 to-blue-500 bg-clip-text text-transparent">
            Como você se sente hoje?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="space-y-8">
            {/* Humor */}
            <div>
              <label className="block text-lg font-semibold mb-4 text-gray-800">
                Escolha seu humor
              </label>
              <div className="grid grid-cols-5 gap-3">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.score}
                    type="button"
                    onClick={() => setMoodScore(mood.score)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      moodScore === mood.score
                        ? "bg-gradient-to-br from-lavender-400 to-blue-300 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs font-medium text-center">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gratidão */}
            <div>
              <label className="block text-lg font-semibold mb-4 text-gray-800">
                Três coisas pelas quais você é grato hoje
              </label>
              <div className="space-y-3">
                {[gratitude1, gratitude2, gratitude3].map((val, i) => (
                  <input
                    key={i}
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const newVals = [gratitude1, gratitude2, gratitude3];
                      newVals[i] = e.target.value;
                      setGratitude1(newVals[0]);
                      setGratitude2(newVals[1]);
                      setGratitude3(newVals[2]);
                    }}
                    placeholder={`${i + 1}. Gratidão...`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Reflexão */}
            <div>
              <label className="block text-lg font-semibold mb-4 text-gray-800">
                Reflexão livre
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Como foi seu dia? O que você aprendeu? Como está se sentindo?"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all resize-none"
              />
            </div>

            {/* Feedback */}
            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                <Heart className="w-6 h-6 text-green-600" />
                <p className="text-green-800 font-medium">
                  Sua gratidão foi registrada. Continue cultivando o bem-estar.
                </p>
              </div>
            )}

            {/* Botão */}
            <button
              onClick={handleSave}
              disabled={loading || saved}
              className="w-full bg-gradient-to-r from-lavender-500 to-blue-400 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : saved ? "Salvo!" : "Salvar Entrada"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
