
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface RaffleModuleProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const RaffleModule: React.FC<RaffleModuleProps> = ({ participants, setParticipants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [history, setHistory] = useState<Participant[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#818cf8', '#facc15', '#f43f5e']
    });
  };

  const startDraw = () => {
    if (participants.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    let counter = 0;
    const duration = 2500;
    const intervalTime = 80;

    timerRef.current = window.setInterval(() => {
      setDisplayIndex(Math.floor(Math.random() * participants.length));
      counter += intervalTime;

      if (counter >= duration) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        const finalIndex = Math.floor(Math.random() * participants.length);
        const selected = participants[finalIndex];
        
        setWinner(selected);
        setIsSpinning(false);
        setHistory(prev => [selected, ...prev]);
        triggerConfetti();

        if (!allowRepeat) {
          setParticipants(prev => prev.filter(p => p.id !== selected.id));
        }
      }
    }, intervalTime);
  };

  const currentDisplay = participants[displayIndex]?.name || '---';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
        
        <div className="relative z-10 text-center space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              The Grand Prize Draw
            </h1>
            <p className="text-slate-500 mt-2">
              Ready to find our lucky winner?
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className={`text-6xl md:text-8xl font-black transition-all duration-75 ${
              isSpinning ? 'text-indigo-400 scale-110 blur-[1px]' : 'text-slate-800'
            }`}>
              {winner ? winner.name : currentDisplay}
            </div>
            {winner && !isSpinning && (
              <div className="mt-6 px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full font-bold uppercase tracking-widest animate-bounce">
                Congratulations!
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={allowRepeat}
                  onChange={(e) => setAllowRepeat(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-600">Allow Repeat Selection</span>
              </label>
            </div>

            <button
              disabled={isSpinning || participants.length === 0}
              onClick={startDraw}
              className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                isSpinning || participants.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200'
              }`}
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Shuffling...
                </span>
              ) : (
                'Start Drawing'
              )}
            </button>
          </div>

          <p className="text-sm text-slate-400">
            {participants.length} names remaining in the pool
          </p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-history text-slate-400"></i>
            Winners History
          </h3>
          <div className="flex flex-wrap gap-3">
            {history.map((h, i) => (
              <div key={`${h.id}-${i}`} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-[10px]">
                  {history.length - i}
                </span>
                {h.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleModule;
