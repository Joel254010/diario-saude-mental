import { useState } from 'react';
import { Heart, X } from 'lucide-react';

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isBreathing, setIsBreathing] = useState(false);

  function startBreathing() {
    setIsBreathing(true);
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';

    const cycle = () => {
      if (phase === 'inhale') {
        setBreathPhase('inhale');
        setTimeout(() => {
          phase = 'hold';
          cycle();
        }, 4000);
      } else if (phase === 'hold') {
        setBreathPhase('hold');
        setTimeout(() => {
          phase = 'exhale';
          cycle();
        }, 4000);
      } else {
        setBreathPhase('exhale');
        setTimeout(() => {
          phase = 'inhale';
          cycle();
        }, 4000);
      }
    };

    cycle();
  }

  function stopBreathing() {
    setIsBreathing(false);
    setIsOpen(false);
  }

  const messages = {
    inhale: 'Inspire fundo...',
    hold: 'Segure...',
    exhale: 'Expire devagar...',
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          if (!isBreathing) startBreathing();
        }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all z-50 animate-pulse"
        title="Preciso de calma agora"
      >
        <Heart className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={stopBreathing}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Está tudo bem</h2>
              <p className="text-gray-600">Vamos respirar juntos</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-48 mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-lavender-400 to-blue-300 transition-all duration-[4000ms] ${
                    breathPhase === 'inhale' ? 'scale-100' : breathPhase === 'hold' ? 'scale-100' : 'scale-50'
                  }`}
                  style={{
                    boxShadow: breathPhase === 'inhale' || breathPhase === 'hold'
                      ? '0 0 60px rgba(180, 158, 220, 0.6)'
                      : '0 0 20px rgba(180, 158, 220, 0.3)'
                  }}
                />
              </div>

              <p className="text-2xl font-semibold text-gray-800 mb-4">
                {messages[breathPhase]}
              </p>

              <p className="text-sm text-gray-600 text-center max-w-xs">
                4 segundos para cada fase
              </p>
            </div>

            <div className="bg-gradient-to-r from-lavender-50 to-blue-50 rounded-2xl p-6 text-center">
              <p className="text-gray-700 leading-relaxed">
                Respire. O momento presente é o seu abrigo.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
