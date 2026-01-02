
import React, { useEffect, useRef, useState } from 'react';
import { Plus, Ruler, MapPin, Camera, Settings2, X, Navigation2, LocateFixed, Waves, Fish } from 'lucide-react';
import * as L from 'leaflet';
import { MapStyle, Boat, UAV, FishSpot } from '../types';
import UAVDetails from './UAVDetails';

const FISH_SPOTS: FishSpot[] = [
  { id: 'f1', location: [-6.045, 106.845], estimateCount: 50, type: 'Tuna' },
  { id: 'f2', location: [-6.060, 106.875], estimateCount: 120, type: 'Mackerel' },
  { id: 'f3', location: [-6.035, 106.890], estimateCount: 35, type: 'Snapper' },
];

const BOATS: Boat[] = [
  { id: '1', name: 'Marlin Chaser', location: [-6.05, 106.85], lastCatchImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Blue Sea 01', location: [-6.07, 106.88], lastCatchImage: 'https://images.unsplash.com/photo-1529230117010-b6c65513c2ca?q=80&w=400&auto=format&fit=crop' },
];

const UAVS: UAV[] = [
  { 
    id: 'UAV-01', 
    name: 'SAR Patrol Gamma', 
    location: [-6.04, 106.86], 
    status: 'Searching', 
    battery: 84, 
    altitude: 150, 
    speed: 45,
    lastAerialPhoto: 'https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?q=80&w=1200&auto=format&fit=crop',
    detections: FISH_SPOTS
  }
];

const ACTION_MENU = [
  { id: 'spot', label: 'Simpan Lokasi', icon: MapPin },
  { id: 'tonda', label: 'Rekam Tonda', icon: Navigation2 },
  { id: 'catch', label: 'Simpan Hasil', icon: Camera },
  { id: 'ruler', label: 'Ukur Jarak', icon: Ruler },
];

const MapTab: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const bathyLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const navigationLineRef = useRef<L.Polyline | null>(null);
  
  const [mapStyle, setMapStyle] = useState<MapStyle>(MapStyle.HYBRID);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedUAV, setSelectedUAV] = useState<UAV | null>(null);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [heading, setHeading] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [liveDepth, setLiveDepth] = useState(24.5);
  const [nearestDistance, setNearestDistance] = useState<string | null>(null);

  // Leaflet Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [-6.05, 106.85],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    setTimeout(() => { mapRef.current?.invalidateSize(); }, 400);

    const depthInterval = setInterval(() => {
        setLiveDepth(prev => {
            const change = (Math.random() - 0.5) * 0.4;
            return parseFloat(Math.max(2, prev + change).toFixed(1));
        });
    }, 2000);

    return () => { 
        clearInterval(depthInterval);
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } 
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) mapRef.current.removeLayer(tileLayerRef.current);
    if (bathyLayerRef.current) mapRef.current.removeLayer(bathyLayerRef.current);

    let url = '';
    if (mapStyle === MapStyle.NIGHT) url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    else if (mapStyle === MapStyle.HYBRID) url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    else if (mapStyle === MapStyle.BATHYMETRY) {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
      bathyLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}').addTo(mapRef.current);
    } else url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    tileLayerRef.current = L.tileLayer(url).addTo(mapRef.current);

    FISH_SPOTS.forEach(spot => {
        const fishIcon = L.divIcon({
            className: 'fish-spot-icon',
            html: `<div class="p-2 bg-blue-600 rounded-full border-2 border-white shadow-xl animate-bounce"><svg viewBox="0 0 24 24" width="14" height="14" stroke="white" stroke-width="2.5" fill="none"><path d="M18 7c.35 1 .8 2 1.5 3 2 2.5 2 4.5 0 7-1.5 2-4.5 3-9 3-4 0-7-2-8-5 1.5-1 4-1 6-1 2 0 4 .5 5.5 1.5.5-1 1-2.5 1-4.5s-.5-3.5-1-4.5c1.5 1 3.5 1.5 5.5 1.5 2 0 4.5 0 6-1"></path></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker(spot.location, { icon: fishIcon }).addTo(mapRef.current!).on('click', () => handleStartNavigation(spot.location));
    });

    BOATS.forEach(boat => {
        const icon = L.divIcon({
            className: 'boat-icon',
            html: `<div class="p-2 bg-orange-600 rounded-full border-2 border-white/80 shadow-2xl"><svg viewBox="0 0 24 24" width="14" height="14" stroke="white" stroke-width="2.5" fill="none"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V8z"></path></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker(boat.location, { icon }).addTo(mapRef.current!).on('click', () => setSelectedBoat(boat));
    });

    UAVS.forEach(uav => {
        const icon = L.divIcon({
            className: 'uav-icon',
            html: `<div class="p-2 bg-blue-500 rounded-full border-2 border-white shadow-xl"><svg viewBox="0 0 24 24" width="14" height="14" stroke="white" stroke-width="2.5" fill="none"><path d="M22 12L2 12"></path><path d="M12 2L12 22"></path><circle cx="12" cy="12" r="3"></circle></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker(uav.location, { icon }).addTo(mapRef.current!).on('click', () => setSelectedUAV(uav));
    });

    const handleOrientation = (e: DeviceOrientationEvent) => { 
        if (e.alpha !== null) {
            setHeading(Math.floor(e.alpha)); 
        }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [mapStyle]);

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserCoords(coords);
        if (mapRef.current) {
          if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
          userMarkerRef.current = L.circleMarker(coords, { radius: 8, fillColor: '#3b82f6', fillOpacity: 0.8, color: 'white', weight: 2 }).addTo(mapRef.current);
          mapRef.current.flyTo(coords, 16);
          let minDistance = Infinity;
          FISH_SPOTS.forEach(spot => {
              const d = L.latLng(coords).distanceTo(L.latLng(spot.location));
              if (d < minDistance) minDistance = d;
          });
          setNearestDistance((minDistance / 1000).toFixed(2));
        }
        setIsLocating(false);
      }, () => setIsLocating(false), { enableHighAccuracy: true });
  };

  const handleStartNavigation = (target: [number, number]) => {
    if (!userCoords) { handleLocateMe(); return; }
    if (!mapRef.current) return;
    if (navigationLineRef.current) mapRef.current.removeLayer(navigationLineRef.current);
    navigationLineRef.current = L.polyline([userCoords, target], { color: '#f97316', weight: 4, dashArray: '8, 8' }).addTo(mapRef.current);
    mapRef.current.flyToBounds([userCoords, target], { padding: [100, 100] });
  };

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const renderCompassTicker = () => {
      const pxPerDegree = 4;
      const totalWidth = 360 * pxPerDegree;
      const offset = -(heading * pxPerDegree);
      
      return (
        <div className="relative w-full h-full flex flex-col justify-end">
            {/* Center Pointer */}
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 z-20 w-[2px] h-3 bg-red-600 shadow-sm"></div>
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-red-600"></div>
            
            <div 
                className="flex items-end h-14 transition-transform duration-200 ease-out"
                style={{ transform: `translateX(${offset}px)` }}
            >
                {[...Array(3)].map((_, loopIdx) => (
                    <div key={loopIdx} className="flex items-end shrink-0" style={{ width: `${totalWidth}px` }}>
                        {[...Array(360)].map((_, deg) => {
                            const isMajor = deg % 45 === 0;
                            const isTen = deg % 10 === 0;
                            const isFive = deg % 5 === 0;
                            if (!isFive) return null;

                            return (
                                <div 
                                    key={deg} 
                                    className="flex flex-col items-center justify-end shrink-0 relative" 
                                    style={{ width: `${pxPerDegree * 5}px` }}
                                >
                                    {isMajor && (
                                        <span className={`absolute bottom-6 text-[12px] font-black tracking-tighter ${deg === 0 ? 'text-red-600' : 'text-white'}`}>
                                            {directions[deg/45]}
                                        </span>
                                    )}
                                    {!isMajor && isTen && (
                                        <span className="absolute bottom-5 text-[8px] font-bold text-white/50 tracking-tighter">
                                            {deg}
                                        </span>
                                    )}
                                    <div className={`w-[1px] ${isMajor ? 'h-4 bg-white/80' : isTen ? 'h-2.5 bg-white/40' : 'h-1.5 bg-white/20'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
      );
  };

  return (
    <div className="h-full w-full relative bg-[#000000] overflow-hidden">
      {/* Base Map Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Floating UI Layer */}
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none px-4 h-full">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-[320px] h-16 overflow-hidden">
              {renderCompassTicker()}
          </div>

          <div className="absolute top-16 left-4 flex items-center gap-1.5 text-white animate-fade-in py-1">
              <Waves size={14} className="text-blue-400 stroke-[3]" />
              <span className="text-[14px] font-black tabular-nums tracking-tighter drop-shadow-lg">{liveDepth}m</span>
          </div>
      </div>

      {/* Status Bar */}
      {nearestDistance && (
          <div className="absolute top-32 left-4 right-4 z-10 animate-fade-in pointer-events-none">
              <div className="glass px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-2xl border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                      <Fish className="text-blue-400" size={18} />
                      <div>
                          <p className="text-[10px] font-black uppercase text-white/40 tracking-wider">Spot Terdekat</p>
                          <p className="text-sm font-bold">{nearestDistance} km dari Anda</p>
                      </div>
                  </div>
                  <button className="pointer-events-auto bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest" onClick={() => handleStartNavigation(FISH_SPOTS[0].location)}>Navigasi</button>
              </div>
          </div>
      )}

      {/* Control Buttons */}
      <div className="absolute top-32 right-4 z-10 flex flex-col gap-2.5">
        <button onClick={() => setMapStyle(s => s === MapStyle.HYBRID ? MapStyle.BATHYMETRY : MapStyle.HYBRID)} className="glass w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-xl border border-white/5 pointer-events-auto">
          <Settings2 size={18} />
        </button>
        <button onClick={handleLocateMe} disabled={isLocating} className={`glass w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl border border-white/5 pointer-events-auto ${isLocating ? 'animate-pulse text-orange-500' : 'text-white'}`}>
          <LocateFixed size={20} />
        </button>
      </div>

      {/* Action FAB */}
      <div className="absolute bottom-24 right-6 z-30 flex flex-col items-end gap-3">
        {showAddMenu && (
          <div className="flex flex-col items-end gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
            {ACTION_MENU.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => setShowAddMenu(false)}
              >
                <span className="glass px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                </span>
                <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/80 hover:text-white hover:bg-orange-600 transition-all shadow-xl active:scale-90 border border-white/10">
                  <item.icon size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => setShowAddMenu(!showAddMenu)}
          className={`w-14 h-14 rounded-[22px] flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${showAddMenu ? 'bg-white text-black rotate-[135deg]' : 'bg-orange-600 text-white orange-glow'}`}
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      </div>

      {/* Modals */}
      {selectedBoat && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-md flex items-end p-4">
          <div className="w-full glass rounded-[36px] p-6 mb-20 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{selectedBoat.name}</h2>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Depth: 18.2m • Sandy Seafloor</p>
              </div>
              <button onClick={() => setSelectedBoat(null)} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
            </div>
            <div className="aspect-video rounded-[24px] overflow-hidden mb-6 shadow-xl border border-white/5">
              <img src={selectedBoat.lastCatchImage} className="w-full h-full object-cover" />
            </div>
            <button className="w-full bg-orange-600 text-white py-4 rounded-[22px] font-black flex items-center justify-center gap-2 shadow-xl uppercase text-xs tracking-widest">
              <Navigation2 size={18} fill="white" /> Navigasi Ke Kapal
            </button>
          </div>
        </div>
      )}

      {selectedUAV && <UAVDetails uav={selectedUAV} onClose={() => setSelectedUAV(null)} />}
    </div>
  );
};

export default MapTab;
