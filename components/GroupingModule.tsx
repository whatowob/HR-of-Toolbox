
import React, { useState, useEffect } from 'react';
import { Participant, Group } from '../types';
import { getCreativeTeamNames } from '../services/gemini';

interface GroupingModuleProps {
  participants: Participant[];
}

const GroupingModule: React.FC<GroupingModuleProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const performGrouping = async () => {
    if (participants.length === 0) return;
    
    setIsGenerating(true);
    
    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const numGroups = Math.ceil(shuffled.length / groupSize);
    
    let teamNames: string[] = [];
    if (useAI) {
      teamNames = await getCreativeTeamNames(numGroups);
    } else {
      teamNames = Array.from({ length: numGroups }, (_, i) => `Team ${i + 1}`);
    }

    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: i,
        name: teamNames[i] || `Team ${i + 1}`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadResultsCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "Group Name,Member Name\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `grouping_results_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Visual Team Grouping</h2>
            <p className="text-slate-500">Divide your {participants.length} participants into optimal teams.</p>
            
            <div className="flex flex-wrap gap-8 items-center pt-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-600">Group Size</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="2" 
                    max="20" 
                    value={groupSize} 
                    onChange={(e) => setGroupSize(parseInt(e.target.value))}
                    className="w-48 h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-bold text-lg min-w-[3rem] text-center">
                    {groupSize}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-600">AI Team Names ✨</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {groups.length > 0 && (
              <button
                onClick={downloadResultsCSV}
                className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-download"></i>
                下載 CSV
              </button>
            )}
            <button
              onClick={performGrouping}
              disabled={isGenerating || participants.length === 0}
              className="flex-1 md:flex-none bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <i className="fa-solid fa-sync animate-spin"></i>
              ) : (
                <i className="fa-solid fa-users-viewfinder"></i>
              )}
              {groups.length > 0 ? 'Regenerate Groups' : 'Create Groups'}
            </button>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg hover:shadow-indigo-100/50 transition-all group flex flex-col animate-in zoom-in-95 duration-300"
            >
              <div className="flex items-start justify-between mb-4 border-b border-slate-50 pb-4">
                <h3 className="font-black text-indigo-600 text-lg group-hover:text-indigo-700 transition-colors uppercase tracking-tight">
                  {group.name}
                </h3>
                <span className="text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded-md">
                  {group.members.length} members
                </span>
              </div>
              <ul className="space-y-2 flex-1">
                {group.members.map((member, idx) => (
                  <li key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 font-medium truncate">{member.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupingModule;
