
import React from 'react';
import { Cloud, Sun, Wind, Droplets, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_WAVE_DATA = [
  { time: '00:00', height: 1.2 },
  { time: '04:00', height: 1.5 },
  { time: '08:00', height: 1.8 },
  { time: '12:00', height: 2.1 },
  { time: '16:00', height: 1.6 },
  { time: '20:00', height: 1.3 },
  { time: '23:59', height: 1.1 },
];

const WeatherTab: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 pb-24 space-y-6">
      {/* Hero Weather */}
      <div className="text-center py-8">
        <h1 className="text-6xl font-light mb-2">29°</h1>
        <p className="text-white/60 font-medium flex items-center justify-center gap-2">
          Partly Cloudy <Cloud size={16} className="text-orange-400" />
        </p>
        <p className="text-xs text-white/30 mt-2">North Jakarta Sea • High: 31° Low: 24°</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-3xl space-y-3">
          <div className="flex justify-between items-start">
            <Wind className="text-orange-500" size={20} />
            <ArrowUpRight className="text-white/20" size={16} />
          </div>
          <div>
            <p className="text-2xl font-bold">14<span className="text-sm font-medium ml-1">kts</span></p>
            <p className="text-[10px] text-white/40 font-bold uppercase">Wind Speed</p>
          </div>
        </div>
        <div className="glass p-4 rounded-3xl space-y-3">
          <div className="flex justify-between items-start">
            <Droplets className="text-blue-500" size={20} />
            <ArrowUpRight className="text-white/20" size={16} />
          </div>
          <div>
            <p className="text-2xl font-bold">82<span className="text-sm font-medium ml-1">%</span></p>
            <p className="text-[10px] text-white/40 font-bold uppercase">Humidity</p>
          </div>
        </div>
      </div>

      {/* Wave Height Chart */}
      <div className="glass p-6 rounded-[32px]">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white/50">Wave Prediction (m)</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_WAVE_DATA}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="height" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorWave)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider px-2 text-white/50">Hourly Forecast</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass min-w-[80px] py-6 flex flex-col items-center rounded-3xl">
              <span className="text-xs text-white/40">{12 + i}:00</span>
              <Sun className="my-3 text-orange-400" size={24} />
              <span className="font-bold">2{8+i}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherTab;
