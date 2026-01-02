
import React from 'react';
import { Trophy, Fish, MapPin, Calendar, Plus, Share2 } from 'lucide-react';

const ProfileTab: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Profile Header */}
      <div className="p-8 flex flex-col items-center">
        <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-orange-500/20 p-1 mb-4">
                <img src="https://picsum.photos/seed/fisherman/200" className="w-full h-full rounded-full object-cover" alt="Profile" />
            </div>
            <div className="absolute bottom-6 right-0 bg-orange-600 p-2 rounded-full border-4 border-[#050505]">
                <Fish size={16} />
            </div>
        </div>
        <h2 className="text-3xl font-bold">Capt. Michelle</h2>
        <p className="text-white/40 text-sm mt-1">Master Fisherman • Level 42</p>
      </div>

      {/* Stats Summary */}
      <div className="px-6 flex gap-4">
        <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center">
            <span className="text-2xl font-bold">128</span>
            <span className="text-[10px] text-white/40 uppercase font-bold">Catches</span>
        </div>
        <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center">
            <span className="text-2xl font-bold">2.4<span className="text-sm ml-0.5">k</span></span>
            <span className="text-[10px] text-white/40 uppercase font-bold">Nautical Miles</span>
        </div>
        <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center">
            <span className="text-2xl font-bold">12</span>
            <span className="text-[10px] text-white/40 uppercase font-bold">Trophies</span>
        </div>
      </div>

      {/* Gallery Sections */}
      <div className="mt-8 px-6 space-y-6">
        <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold">My Catch Gallery</h3>
            <button className="text-orange-500 text-sm font-bold flex items-center gap-1">View All <Share2 size={14}/></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square glass rounded-3xl overflow-hidden relative group">
                <img src="https://picsum.photos/seed/catch1/400" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute bottom-2 left-2 glass px-2 py-0.5 rounded-lg text-[10px] font-bold">Red Snapper • 4kg</div>
            </div>
            <div className="aspect-square glass rounded-3xl overflow-hidden relative group">
                <img src="https://picsum.photos/seed/catch2/400" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute bottom-2 left-2 glass px-2 py-0.5 rounded-lg text-[10px] font-bold">Mackerel • 2kg</div>
            </div>
            <div className="aspect-square glass rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/5">
                <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                    <Plus className="text-orange-500" />
                </div>
                <span className="text-xs font-bold text-white/40">Add New Catch</span>
            </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="mt-8 px-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Recent Voyages</h3>
        <div className="space-y-4">
            {[1, 2].map(i => (
                <div key={i} className="glass p-4 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <MapPin size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm">East Reef Expedition</h4>
                        <p className="text-[10px] text-white/40 uppercase">Oct 12, 2024 • 6h 30m</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-green-500">+8 Catch</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
