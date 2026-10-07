import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navigation/Navbar';
import BottomNav from './components/Navigation/BottomNav';
import BangaloreMap from './components/Map/BangaloreMap';
import FilterBar from './components/Map/FilterBar';
import StationCard from './components/Map/StationCard';
import StationDetailModal from './components/Station/StationDetailModal';
import VehicleManager from './components/Vehicle/VehicleManager';
import ChargingSession from './components/Charging/ChargingSession';
import WalletView from './components/Payment/WalletView';
import { AlertCircle, CheckCircle2, Info, ChevronUp, Zap, Sparkles } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    filteredStations,
    selectedStation,
    setSelectedStationId,
    startChargingSession,
    toast
  } = useApp();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [stationForModal, setStationForModal] = useState(null);
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Open full details modal for a station
  const handleOpenDetails = (station) => {
    setStationForModal(station);
    setSelectedStationId(station.id);
    setDetailModalOpen(true);
  };

  // Launch charging from details modal
  const handleStartChargingFromModal = (station, gun) => {
    setDetailModalOpen(false);
    startChargingSession(station, gun);
  };

  return (
    <div className={`min-h-screen bg-navy-950 flex flex-col justify-between items-center ${isMobileFrame ? 'md:py-6 md:px-4' : ''}`}>
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700 text-white text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-bounce-soft">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container / Mobile Frame Wrapper */}
      <div className={`w-full bg-navy-900 border border-navy-cardBorder flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
        isMobileFrame
          ? 'max-w-md min-h-screen md:min-h-[844px] md:max-h-[920px] md:rounded-[42px] md:border-4 md:border-slate-800'
          : 'max-w-4xl min-h-screen'
      }`}>
        
        {/* App Header */}
        <Navbar isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame} />

        {/* Dynamic Screen View */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-navy-950">

          {/* ================= SCREEN 1: EXPLORE / MAP & LIST ================= */}
          {activeTab === 'map' && (
            <div className="flex-1 flex flex-col h-full relative">
              <FilterBar />

              {viewMode === 'map' ? (
                <div className="flex-1 relative w-full h-[calc(100vh-180px)] md:h-[640px]">
                  <BangaloreMap
                    onSelectStation={(st) => {
                      setSelectedStationId(st.id);
                    }}
                  />

                  {/* Selected Station Bottom Peek Drawer */}
                  {selectedStation && (
                    <div className="absolute bottom-16 left-3 right-3 z-[400] animate-fadeIn">
                      <StationCard
                        station={selectedStation}
                        onOpenDetails={handleOpenDetails}
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* List View sorted by distance */
                <div className="flex-1 overflow-y-auto p-3.5 pb-24 space-y-3">
                  {filteredStations.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <Zap className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="font-semibold text-sm">No charging stations match your filters.</p>
                      <p className="text-xs text-slate-500">Try changing vehicle type or connector filter.</p>
                    </div>
                  ) : (
                    filteredStations.map(station => (
                      <StationCard
                        key={station.id}
                        station={station}
                        onOpenDetails={handleOpenDetails}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= SCREEN 3: MY VEHICLE & BATTERY ================= */}
          {activeTab === 'vehicle' && (
            <div className="flex-1 overflow-y-auto">
              <VehicleManager />
            </div>
          )}

          {/* ================= SCREEN 4: CHARGING SESSION & QR SCAN ================= */}
          {activeTab === 'charging' && (
            <div className="flex-1 overflow-y-auto">
              <ChargingSession />
            </div>
          )}

          {/* ================= SCREEN 5: WALLET, UPI & HISTORY ================= */}
          {activeTab === 'wallet' && (
            <div className="flex-1 overflow-y-auto">
              <WalletView />
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Station Detail Modal (Screen 2) */}
      <StationDetailModal
        station={stationForModal || selectedStation}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onStartCharging={handleStartChargingFromModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
