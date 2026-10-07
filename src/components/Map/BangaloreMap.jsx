import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Zap, Navigation, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export default function BangaloreMap({ onSelectStation }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const {
    filteredStations,
    selectedStationId,
    setSelectedStationId,
    userLocation
  } = useApp();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map centered on Bangalore / Koramangala
    const map = L.map(mapContainerRef.current, {
      center: [12.9550, 77.6200],
      zoom: 12.5,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control at bottom right for easy thumb reach on mobile
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap tile layer (no API key needed!)
    // Using CartoDB dark matter or OpenStreetMap with our dark theme CSS
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);

    // Add user location pulsing marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="relative w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindTooltip("You (Koramangala 4th Block)", { permanent: false, direction: "top" })
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when filteredStations or selectedStationId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredStations.forEach(station => {
      const isSelected = station.id === selectedStationId;
      
      // Determine color based on overallStatus
      // green = available, orange = busy, red = not working
      let colorClass = 'bg-emerald-500 border-emerald-300 shadow-emerald-500/40';
      let pinColor = '#10B981';
      let statusDot = 'bg-emerald-400';
      
      if (station.overallStatus === 'busy') {
        colorClass = 'bg-amber-500 border-amber-300 shadow-amber-500/40';
        pinColor = '#F59E0B';
        statusDot = 'bg-amber-400';
      } else if (station.overallStatus === 'broken') {
        colorClass = 'bg-rose-600 border-rose-300 shadow-rose-600/40';
        pinColor = '#EF4444';
        statusDot = 'bg-rose-400';
      }

      const pulseEffect = station.overallStatus === 'available' ? 'pulse-available' : '';
      const selectedRing = isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-navy-950 scale-110 z-50' : 'hover:scale-105';

      const customIcon = L.divIcon({
        className: 'station-pin-marker',
        html: `
          <div class="group cursor-pointer transition-transform duration-200 ${selectedRing}">
            <div class="relative flex flex-col items-center">
              <!-- Pin Head -->
              <div class="w-10 h-10 rounded-2xl ${colorClass} ${pulseEffect} border-2 flex items-center justify-center shadow-xl text-white font-bold relative transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <!-- Speed Pill on top -->
                <div class="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-extrabold text-slate-200">
                  ${station.chargingSpeed}k
                </div>
              </div>
              <!-- Pin Pointer Triangle -->
              <div class="w-2.5 h-2.5 rotate-45 -mt-1.5 ${colorClass} border-r border-b"></div>
            </div>
          </div>
        `,
        iconSize: [42, 48],
        iconAnchor: [21, 46],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon });

      // Click to select station
      marker.on('click', () => {
        setSelectedStationId(station.id);
        if (onSelectStation) {
          onSelectStation(station);
        }
        mapInstanceRef.current.panTo([station.lat, station.lng], {
          animate: true,
          duration: 0.6
        });
      });

      markersGroupRef.current.addLayer(marker);
    });
  }, [filteredStations, selectedStationId]);

  // Recenter map on user location
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13.5, {
      duration: 1.2
    });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-navy-950 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Quick Bangalore Area Jump Chips (mobile touch-friendly horizontally scrollable) */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { name: "Koramangala", lat: 12.9345, lng: 77.6268 },
          { name: "Indiranagar", lat: 12.9719, lng: 77.6412 },
          { name: "HSR Layout", lat: 12.9116, lng: 77.6389 },
          { name: "Whitefield", lat: 12.9863, lng: 77.7381 },
          { name: "Electronic City", lat: 12.8452, lng: 77.6602 },
          { name: "MG Road", lat: 12.9733, lng: 77.6186 }
        ].map(area => (
          <button
            key={area.name}
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([area.lat, area.lng], 14, { duration: 1 });
              }
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-brand-500 active:scale-95 transition-all shadow-md"
          >
            📍 {area.name}
          </button>
        ))}
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        aria-label="Recenter to my location"
        className="absolute bottom-20 right-4 z-[400] w-11 h-11 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-brand-400 hover:text-white hover:bg-slate-800 shadow-xl flex items-center justify-center active:scale-90 transition-all"
        title="Find Me"
      >
        <Navigation className="w-5 h-5 fill-brand-400/20" />
      </button>

      {/* Status Legend Overlay */}
      <div className="absolute top-16 left-3 z-[400] bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center gap-3 text-[11px] font-medium text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]"></span>
          Busy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#EF4444]"></span>
          Broken
        </span>
      </div>
    </div>
  );
}
