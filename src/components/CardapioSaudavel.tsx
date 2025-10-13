import { useState, useEffect } from "react";
import { ArrowLeft, Utensils, Coffee, Soup, Sandwich, Save, Flame } from "lucide-react";

type Props = {
  onBack: () => void;
};

type Cardapio = {
  cafeManha: string;
  almoco: string;
  cafeTarde: string;
  jantar: string;
  data: string;
  totalCalorias?: number;
};

type Sugestao = {
  nome: string;
  calorias: number;
};

export default function CardapioSaudavel({ onBack }: Props) {
  const [cardapio, setCardapio] = useState<Cardapio>({
    cafeManha: "",
    almoco: "",
    cafeTarde: "",
    jantar: "",
    data: new Date().toISOString().split("T")[0],
    totalCalorias: 0,
  });

  const [saved, setSaved] = useState(false);
  const storageKey = `cardapio_${cardapio.data}`;

  // 🔹 Carrega cardápio salvo
  useEffect(() => {
    const savedCardapio = localStorage.getItem(storageKey);
    if (savedCardapio) {
      setCardapio(JSON.parse(savedCardapio));
    }
  }, []);

  // 🔹 Atualiza campo
  function handleChange(field: keyof Cardapio, value: string) {
    setCardapio((prev) => ({ ...prev, [field]: value }));
  }

  // 🔹 Salva cardápio com total de calorias
  function handleSave() {
    const total = calcularTotal();
    const data = { ...cardapio, totalCalorias: total };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // 🔹 Calcula total de calorias baseado nas escolhas
  function calcularTotal(): number {
    let total = 0;
    refeicoes.forEach((ref) => {
      const escolha = (cardapio as any)[ref.id];
      const item = ref.sugestoes.find((s) => s.nome === escolha);
      if (item) total += item.calorias;
    });
    return total;
  }

  // 🔹 Define as refeições com calorias
  const refeicoes: {
    id: keyof Cardapio;
    label: string;
    icon: any;
    placeholder: string;
    sugestoes: Sugestao[];
  }[] = [
    {
      id: "cafeManha",
      label: "Café da Manhã ☀️",
      icon: Coffee,
      placeholder: "Ex: Iogurte com frutas e aveia",
      sugestoes: [
        { nome: "Pão integral com queijo branco", calorias: 250 },
        { nome: "Vitamina de banana com aveia", calorias: 220 },
        { nome: "Iogurte com frutas vermelhas", calorias: 180 },
        { nome: "Panqueca de aveia com mel", calorias: 210 },
        { nome: "Tapioca com ovo mexido e café preto", calorias: 260 },
        { nome: "Smoothie verde (espinafre, maçã e gengibre)", calorias: 150 },
        { nome: "Cuscuz com ovo cozido e suco natural", calorias: 280 },
      ],
    },
    {
      id: "almoco",
      label: "Almoço 🍛",
      icon: Utensils,
      placeholder: "Ex: Arroz integral, feijão, frango grelhado e salada",
      sugestoes: [
        { nome: "Peito de frango grelhado com legumes cozidos", calorias: 400 },
        { nome: "Filé de peixe assado e arroz integral", calorias: 380 },
        { nome: "Macarrão integral com molho natural e frango desfiado", calorias: 420 },
        { nome: "Carne magra com purê de batata e brócolis", calorias: 450 },
        { nome: "Omelete com legumes e arroz integral", calorias: 390 },
        { nome: "Salada colorida com grão-de-bico e atum", calorias: 320 },
        { nome: "Tirinhas de carne com quinoa e abóbora refogada", calorias: 410 },
      ],
    },
    {
      id: "cafeTarde",
      label: "Café da Tarde ☕",
      icon: Sandwich,
      placeholder: "Ex: Tapioca com queijo e suco natural",
      sugestoes: [
        { nome: "Torradas com pasta de amendoim", calorias: 230 },
        { nome: "Iogurte natural com granola e mel", calorias: 200 },
        { nome: "Smoothie de frutas vermelhas", calorias: 170 },
        { nome: "Pão integral com peito de peru e chá verde", calorias: 250 },
        { nome: "Banana amassada com aveia e canela", calorias: 190 },
        { nome: "Bolinho de aveia e cacau caseiro", calorias: 210 },
        { nome: "Tapioca de coco com queijo coalho", calorias: 240 },
      ],
    },
    {
      id: "jantar",
      label: "Jantar 🌙",
      icon: Soup,
      placeholder: "Ex: Sopa de legumes e torradas integrais",
      sugestoes: [
        { nome: "Sopa de frango com legumes", calorias: 280 },
        { nome: "Omelete com salada verde", calorias: 250 },
        { nome: "Crepioca com frango desfiado", calorias: 270 },
        { nome: "Caldo de abóbora com gengibre", calorias: 230 },
        { nome: "Wrap integral de frango e salada", calorias: 300 },
        { nome: "Legumes assados com filé de peixe", calorias: 320 },
        { nome: "Purê de mandioquinha com carne moída magra", calorias: 350 },
      ],
    },
  ];

  const totalCalorias = calcularTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* 🔙 Voltar */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-lavender-600 to-blue-500 bg-clip-text text-transparent">
            Meu Cardápio Saudável
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Monte seu cardápio e veja o total de calorias consumidas hoje.
          </p>

          {/* 🔹 Campos de refeições */}
          <div className="space-y-8">
            {refeicoes.map((ref) => (
              <div key={ref.id} className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <ref.icon className="w-5 h-5 text-lavender-500" />
                  {ref.label}
                </label>

                <input
                  type="text"
                  value={(cardapio as any)[ref.id]}
                  onChange={(e) =>
                    handleChange(ref.id as keyof Cardapio, e.target.value)
                  }
                  placeholder={ref.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
                />

                <div className="flex flex-wrap gap-2 mt-1">
                  {ref.sugestoes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleChange(ref.id as keyof Cardapio, s.nome)}
                      className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm hover:bg-lavender-200 transition-all"
                    >
                      {s.nome} ({s.calorias} kcal)
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 🔹 Total de Calorias */}
            <div className="mt-8 bg-gradient-to-r from-lavender-100 to-blue-100 border border-lavender-200 rounded-xl p-4 text-center shadow-sm flex flex-col items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <p className="text-lg font-semibold text-gray-800">
                Total estimado do dia:{" "}
                <span className="text-lavender-700">{totalCalorias} kcal</span>
              </p>
            </div>

            {/* 🔹 Mensagem de sucesso */}
            {saved && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-medium animate-pulse">
                Cardápio de hoje salvo com sucesso!
              </div>
            )}

            {/* 🔹 Botão Salvar */}
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-lavender-500 to-blue-400 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <Save className="inline-block w-5 h-5 mr-2" />
              Salvar Cardápio de Hoje
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
