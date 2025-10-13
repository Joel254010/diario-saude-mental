import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Mail, MailOpen, Send, Calendar } from "lucide-react";

type Props = {
  onBack: () => void;
};

type LocalLetter = {
  id: string;
  user_id: string;
  content: string;
  delivery_date: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
};

export default function FutureLetters({ onBack }: Props) {
  const { user } = useAuth();
  const [letters, setLetters] = useState<LocalLetter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LocalLetter | null>(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  useEffect(() => {
    loadLetters();
  }, []);

  function getKey() {
    return `letters_${user?.id}`;
  }

  function loadLetters() {
    if (!user) return;
    const stored: LocalLetter[] = JSON.parse(localStorage.getItem(getKey()) || "[]");

    // Atualiza automaticamente as cartas "entregues"
    const unreadReadyLetters = stored.filter(
      (l) => !l.is_read && new Date(l.delivery_date) <= new Date()
    );

    setLetters(stored);

    if (unreadReadyLetters.length > 0 && !selectedLetter) {
      setSelectedLetter(unreadReadyLetters[0]);
    }
  }

  function saveLetters(data: LocalLetter[]) {
    localStorage.setItem(getKey(), JSON.stringify(data));
    setLetters(data);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    setTimeout(() => {
      const stored: LocalLetter[] = JSON.parse(localStorage.getItem(getKey()) || "[]");

      const newLetter: LocalLetter = {
        id: crypto.randomUUID(),
        user_id: user.id,
        content,
        delivery_date: deliveryDate,
        is_read: false,
        created_at: new Date().toISOString(),
        read_at: null,
      };

      stored.push(newLetter);
      saveLetters(stored);

      setContent("");
      setDeliveryDate("");
      setShowForm(false);
      setLoading(false);
    }, 500);
  }

  function markAsRead(letterId: string) {
    const stored: LocalLetter[] = JSON.parse(localStorage.getItem(getKey()) || "[]");
    const index = stored.findIndex((l) => l.id === letterId);
    if (index >= 0) {
      stored[index].is_read = true;
      stored[index].read_at = new Date().toISOString();
      saveLetters(stored);
      setSelectedLetter(null);
    }
  }

  const pendingLetters = letters.filter((l) => new Date(l.delivery_date) > new Date());
  const readyLetters = letters.filter(
    (l) => new Date(l.delivery_date) <= new Date() && !l.is_read
  );
  const readLetters = letters.filter((l) => l.is_read);

  if (selectedLetter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-rose-300" />

            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full">
                <MailOpen className="w-12 h-12 text-pink-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Sua carta do passado chegou
            </h2>

            <p className="text-center text-gray-600 mb-8">Leia com carinho 💌</p>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 mb-8 border-2 border-pink-200">
              <p className="text-sm text-gray-600 mb-4">
                Escrita em{" "}
                {new Date(selectedLetter.created_at).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {selectedLetter.content}
              </p>
            </div>

            <button
              onClick={() => markAsRead(selectedLetter.id)}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
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
          Cartas para o Futuro
        </h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-8 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Escrever Nova Carta
          </button>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">Escreva para seu eu futuro</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sua mensagem
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva uma mensagem para você mesmo ler no futuro..."
                  rows={8}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Quando deseja receber?
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={minDateStr}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setContent("");
                    setDeliveryDate("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar para o Futuro"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cartas prontas */}
        {readyLetters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Cartas Prontas para Ler</h2>
            <div className="space-y-4">
              {readyLetters.map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className="w-full bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-2xl p-6 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-pink-400 to-rose-300 rounded-xl">
                      <MailOpen className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div>
                      <p className="font-bold text-pink-900">Nova carta disponível!</p>
                      <p className="text-sm text-pink-700">
                        Escrita em{" "}
                        {new Date(letter.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cartas agendadas */}
        {pendingLetters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Cartas Agendadas</h2>
            <div className="space-y-4">
              {pendingLetters.map((letter) => (
                <div key={letter.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <Mail className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Carta agendada</p>
                      <p className="text-sm text-gray-600">
                        Chegará em{" "}
                        {new Date(letter.delivery_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cartas lidas */}
        {readLetters.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cartas Lidas</h2>
            <div className="space-y-4">
              {readLetters.map((letter) => (
                <div key={letter.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <MailOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        Lida em{" "}
                        {letter.read_at
                          ? new Date(letter.read_at).toLocaleDateString("pt-BR")
                          : "—"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Escrita em{" "}
                        {new Date(letter.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-3">
                      {letter.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sem cartas */}
        {letters.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Você ainda não escreveu nenhuma carta para o futuro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
