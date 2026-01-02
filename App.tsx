
import React, { useState } from 'react';
import { Map, CloudRain, User } from 'lucide-react';
import MapTab from './components/MapTab';
import WeatherTab from './components/WeatherTab';
import ProfileTab from './components/ProfileTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'weather' | 'profile'>('map');

  const tabs = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'weather', label: 'Forecast', icon: CloudRain },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="flex flex-col h-screen bg-[#000000] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl border-x border-white/5">
      {/* Top Status Area */}
      <div className="h-10 flex justify-between items-center px-8 pt-4 shrink-0 z-50 pointer-events-none opacity-80">
        <span className="font-bold text-xs tracking-tight">9:41</span>
        <div className="flex gap-1.5 items-center">
            <div className="w-5 h-2.5 border border-white/30 rounded-[2px] flex items-center p-[0.5px]">
                <div className="h-full w-[90%] bg-white rounded-[0.5px]"></div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <MapTab />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'weather' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <WeatherTab />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${activeTab === 'profile' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <ProfileTab />
        </div>
      </div>

      {/* Slim Floating Navigation Bar */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-8 z-50 pointer-events-none">
        <div className="bg-[#121212]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-1.5 flex items-center gap-1.5 shadow-2xl pointer-events-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${isActive 
                    ? 'bg-orange-600 px-5 py-2.5 rounded-[24px] text-white shadow-lg' 
                    : 'w-[44px] h-[44px] rounded-full text-white/30 hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon size={isActive ? 18 : 20} strokeWidth={isActive ? 3 : 2} />
                  {isActive && (
                    <span className="text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-500">
                      {tab.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/10 rounded-full z-50"></div>
    </div>
  );
};

export default App;
