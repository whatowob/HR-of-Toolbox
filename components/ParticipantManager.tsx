
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface ParticipantManagerProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onComplete: () => void;
}

const MOCK_NAMES = [
  '張小明', '李美麗', '王大同', '陳志強', '林思妤', 
  '趙雲', '孫悟空', '周杰倫', '蔡依林', '劉德華',
  'Emma Watson', 'James Bond', 'Tony Stark', 'Steve Rogers', 'Natasha Romanoff'
];

const ParticipantManager: React.FC<ParticipantManagerProps> = ({ participants, onUpdate, onComplete }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect duplicates
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      const name = p.name.trim();
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return new Set([...counts.entries()].filter(([_, count]) => count > 1).map(([name]) => name));
  }, [participants]);

  const loadMockData = () => {
    const newList: Participant[] = MOCK_NAMES.map((name, index) => ({
      id: `mock-${Date.now()}-${index}`,
      name: name
    }));
    onUpdate(newList);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      const name = p.name.trim();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const processInput = () => {
    const lines = inputText.split(/\r?\n/).filter(line => line.trim() !== '');
    const newList: Participant[] = lines.map((name, index) => ({
      id: `manual-${Date.now()}-${index}`,
      name: name.trim()
    }));
    onUpdate([...participants, ...newList]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      const newList: Participant[] = lines.map((line, index) => {
        const name = line.split(',')[0].replace(/"/g, '').trim();
        return {
          id: `csv-${Date.now()}-${index}`,
          name: name
        };
      }).filter(p => p.name.toLowerCase() !== 'name' && p.name !== '');

      onUpdate([...participants, ...newList]);
      setIsProcessing(false);
      e.target.value = ''; // Reset input
    };
    reader.readAsText(file);
  };

  const clearList = () => {
    onUpdate([]);
    setInputText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <i className="fa-solid fa-user-plus text-indigo-500"></i>
            Import Names
          </h2>
          <button 
            onClick={loadMockData}
            className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <i className="fa-solid fa-magic mr-1"></i> 載入模擬名單
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors hover:border-indigo-300">
            <input
              type="file"
              accept=".csv,.txt"
              id="csv-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-upload" className="cursor-pointer group">
              <i className="fa-solid fa-file-csv text-4xl text-slate-300 group-hover:text-indigo-400 mb-3 block transition-colors"></i>
              <p className="text-slate-600 font-medium">Click to upload CSV or TXT</p>
              <p className="text-slate-400 text-xs mt-1">One name per line or CSV column</p>
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">OR PASTE NAMES</span>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Alice&#10;Bob&#10;Charlie..."
            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm outline-none"
          />

          <div className="flex gap-3">
            <button
              onClick={processInput}
              disabled={!inputText.trim()}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              Add to List
            </button>
            <button
              onClick={clearList}
              className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <i className="fa-solid fa-list-check text-indigo-500"></i>
            Active List ({participants.length})
          </h2>
          <div className="flex gap-2">
            {duplicateNames.size > 0 && (
              <button 
                onClick={removeDuplicates}
                className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded border border-rose-100 hover:bg-rose-100 transition-colors"
              >
                移除重複姓名
              </button>
            )}
            {participants.length > 0 && (
              <button 
                onClick={onComplete}
                className="text-sm text-indigo-600 font-bold hover:underline"
              >
                Proceed →
              </button>
            )}
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 italic py-12">
            <i className="fa-solid fa-ghost text-4xl mb-3"></i>
            <p>Your list is empty</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {participants.map((p, idx) => {
              const isDuplicate = duplicateNames.has(p.name.trim());
              return (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-3 rounded-lg group transition-colors ${
                    isDuplicate ? 'bg-rose-50 border border-rose-100' : 'bg-slate-50'
                  }`}
                >
                  <span className={`font-medium ${isDuplicate ? 'text-rose-700' : 'text-slate-700'}`}>
                    <span className="text-slate-300 mr-2 text-xs">{idx + 1}.</span>
                    {p.name}
                    {isDuplicate && <span className="ml-2 text-[10px] bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-full uppercase">Duplicate</span>}
                  </span>
                  <button 
                    onClick={() => onUpdate(participants.filter(item => item.id !== p.id))}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager;
