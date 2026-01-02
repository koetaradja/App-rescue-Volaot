
import React from 'react';
import { X, Battery, Wind, Navigation, Fish, Eye, MapPin, Zap } from 'lucide-react';
import { UAV } from '../types';

interface UAVDetailsProps {
  uav: UAV;
  onClose: () => void;
}

const UAVDetails: React.FC<UAVDetailsProps> = ({ uav, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-[#050505] animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase">
            RECON REPORT <span className="text-blue-500 font-mono text-sm px-2 py-0.5 bg-blue-500/10 rounded">LIVE</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">{uav.name} • SAR & FISHING UNIT</p>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Main Recon View (Aerial Photo) */}
      <div className="relative flex-1 bg-[#111]">
        <img 
          src={uav.lastAerialPhoto} 
          alt="Aerial Recon" 
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Detection Markers HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Mock detection targets on image */}
            <div className="absolute top-1/3 left-1/4 w-32 h-32 border-2 border-orange-500/50 rounded-lg flex flex-col justify-end p-2 animate-pulse">
                <span className="text-[10px] bg-orange-500 text-white font-black px-1 rounded w-fit">FISH SCHOOL #1</span>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-blue-500/50 rounded-lg flex flex-col justify-end p-2 animate-pulse">
                <span className="text-[10px] bg-blue-500 text-white font-black px-1 rounded w-fit">FISH SCHOOL #2</span>
            </div>
        </div>

        {/* Floating AI HUD Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-40">
            <div className="w-72 h-72 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                </div>
            </div>
            <div className="absolute top-1/2 w-full h-[1px] bg-white/5"></div>
            <div className="absolute left-1/2 h-full w-[1px] bg-white/5"></div>
        </div>
      </div>

      {/* Report Statistics (Glassmorphism) */}
      <div className="relative -mt-32 px-6 pb-12 z-20">
        <div className="glass rounded-[32px] p-6 shadow-2xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Fish size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-wider">Detection Stats</h4>
                        <p className="text-[10px] text-white/40 uppercase font-bold">Scanning Surface & Undercurrents</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-blue-400">0{uav.detections.length}</div>
                    <div className="text-[9px] font-black text-white/40 uppercase">Spots Found</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye size={12} className="text-orange-400" />
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Total Estimates</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">{uav.detections.reduce((a, b) => a + b.estimateCount, 0)}</span>
                        <span className="text-xs text-white/40 font-bold uppercase">Fish</span>
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={12} className="text-blue-400" />
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Nearest Zone</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">1.2</span>
                        <span className="text-xs text-white/40 font-bold uppercase">km</span>
                    </div>
                </div>
            </div>

            {/* Device Health */}
            <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                    <Battery size={16} className="text-green-500" />
                    <span className="text-xs font-bold">{uav.battery}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wind size={16} className="text-blue-400" />
                    <span className="text-xs font-bold">12 kts NW</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Stable</span>
                </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-[22px] font-black shadow-xl transition-all active:scale-95 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3">
                <Navigation size={18} /> Navigasi Ke Spot Terdekat
            </button>
        </div>
      </div>
    </div>
  );
};

export default UAVDetails;
