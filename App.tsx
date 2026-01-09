
import React, { useState, useCallback } from 'react';
import { Participant, Tab } from './types';
import Header from './components/Header';
import ParticipantManager from './components/ParticipantManager';
import RaffleModule from './components/RaffleModule';
import GroupingModule from './components/GroupingModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {activeTab === 'list' && (
          <ParticipantManager 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
            onComplete={() => setActiveTab('raffle')}
          />
        )}
        
        {activeTab === 'raffle' && (
          <RaffleModule 
            participants={participants}
            setParticipants={setParticipants}
          />
        )}
        
        {activeTab === 'grouping' && (
          <GroupingModule 
            participants={participants}
          />
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
        &copy; {new Date().getFullYear()} HR Pro Toolbox • Powering Corporate Culture
      </footer>
    </div>
  );
};

export default App;
