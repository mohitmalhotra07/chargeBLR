import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STATIONS, BANGALORE_USER_LOCATION } from '../data/stationsData';
import { INITIAL_USER_VEHICLES } from '../data/vehiclesData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load persisted state or defaults
  const [stations, setStations] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeblr_stations');
      return saved ? JSON.parse(saved) : INITIAL_STATIONS;
    } catch {
      return INITIAL_STATIONS;
    }
  });

  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeblr_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_USER_VEHICLES;
    } catch {
      return INITIAL_USER_VEHICLES;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeblr_active_vehicle_id');
      return saved || (INITIAL_USER_VEHICLES[0]?.id || 'user-v1');
    } catch {
      return 'user-v1';
    }
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeblr_wallet');
      return saved !== null ? parseFloat(saved) : 850.0;
    } catch {
      return 850.0;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('chargeblr_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial mock history
    return [
      {
        id: "ses-1082",
        receiptId: "BLR-REC-92841",
        date: "Yesterday, 07:30 PM",
        stationName: "Tata Power & Ather Hub - Koramangala",
        area: "Koramangala 4th Block",
        vehicleName: "Tata Nexon EV Long Range",
        gunName: "Gun 1 (DC Fast 60 kW)",
        energyKwh: 22.4,
        durationMinutes: 32,
        cost: 392.00,
        paymentMethod: "ChargeBLR Wallet",
        status: "Completed"
      },
      {
        id: "ses-1081",
        receiptId: "BLR-REC-87321",
        date: "04 Oct, 01:15 PM",
        stationName: "Jio-bp pulse EV Hub - Indiranagar",
        area: "Indiranagar 100ft Rd",
        vehicleName: "Ather 450X Gen 3",
        gunName: "Gun 3 (2W Fast 3.3 kW)",
        energyKwh: 2.8,
        durationMinutes: 48,
        cost: 53.20,
        paymentMethod: "UPI (Google Pay)",
        status: "Completed"
      }
    ];
  });

  // Selected station for details view or estimation
  const [selectedStationId, setSelectedStationId] = useState(INITIAL_STATIONS[0].id);

  // Active navigation tab: 'map' | 'station' | 'vehicle' | 'charging' | 'wallet' | 'history'
  const [activeTab, setActiveTab] = useState('map');

  // Filters for Map & List
  const [filterVehicleType, setFilterVehicleType] = useState('all'); // 'all', '2-wheeler', '4-wheeler'
  const [filterConnector, setFilterConnector] = useState('all'); // 'all', 'CCS2', 'Type 2', 'Bharat AC', '2-wheeler standard'
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  // Active charging session
  const [activeSession, setActiveSession] = useState(null);

  // Toast message system
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('chargeblr_stations', JSON.stringify(stations));
    } catch {}
  }, [stations]);

  useEffect(() => {
    try {
      localStorage.setItem('chargeblr_vehicles', JSON.stringify(vehicles));
    } catch {}
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem('chargeblr_active_vehicle_id', activeVehicleId);
    } catch {}
  }, [activeVehicleId]);

  useEffect(() => {
    try {
      localStorage.setItem('chargeblr_wallet', walletBalance.toString());
    } catch {}
  }, [walletBalance]);

  useEffect(() => {
    try {
      localStorage.setItem('chargeblr_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Active vehicle helper
  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];

  // Selected station helper
  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Update battery percentage for a vehicle
  const updateVehicleBattery = (vehicleId, newPct) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, currentBatteryPct: Math.min(100, Math.max(1, newPct)) };
      }
      return v;
    }));
  };

  // Add a new vehicle
  const addVehicle = (newVeh) => {
    const vehWithId = {
      ...newVeh,
      id: `user-v-${Date.now()}`,
      isDefault: false
    };
    setVehicles(prev => [...prev, vehWithId]);
    setActiveVehicleId(vehWithId.id);
    showToast(`Added ${vehWithId.brand} ${vehWithId.model} to My Garage!`, 'success');
  };

  // Delete vehicle
  const deleteVehicle = (vehId) => {
    if (vehicles.length <= 1) {
      showToast('You must keep at least one vehicle in your garage', 'error');
      return;
    }
    const remaining = vehicles.filter(v => v.id !== vehId);
    setVehicles(remaining);
    if (activeVehicleId === vehId) {
      setActiveVehicleId(remaining[0].id);
    }
    showToast('Vehicle removed', 'info');
  };

  // Wallet operations
  const addWalletMoney = (amount, paymentSource = 'UPI') => {
    setWalletBalance(prev => {
      const updated = prev + parseFloat(amount);
      return Math.round(updated * 100) / 100;
    });
    showToast(`₹${amount} added successfully via ${paymentSource}!`, 'success');
  };

  const deductWalletMoney = (amount) => {
    if (walletBalance >= amount) {
      setWalletBalance(prev => Math.round((prev - amount) * 100) / 100);
      return true;
    }
    return false;
  };

  // User reporting station status
  const reportStationStatus = (stationId, reportedStatus, feedbackNote) => {
    setStations(prev => prev.map(station => {
      if (station.id === stationId) {
        // Map reportedStatus ('working' -> 'available', 'broken' -> 'not working' / 'broken', 'occupied' -> 'busy')
        let normalizedStatus = 'available';
        if (reportedStatus === 'broken') normalizedStatus = 'broken';
        if (reportedStatus === 'occupied') normalizedStatus = 'busy';

        return {
          ...station,
          overallStatus: normalizedStatus,
          lastUpdatedMinutesAgo: 0,
          userReportedNote: feedbackNote || `Reported as ${reportedStatus} by driver`
        };
      }
      return station;
    }));
    showToast(`Thank you! Station status updated to "${reportedStatus}".`, 'success');
  };

  // Filter stations based on user's active filters
  const filteredStations = stations.filter(station => {
    // 1. Vehicle Type filter
    if (filterVehicleType !== 'all') {
      if (!station.vehicleTypes.includes(filterVehicleType)) {
        return false;
      }
    }

    // 2. Connector Type filter
    if (filterConnector !== 'all') {
      if (!station.connectorTypes.includes(filterConnector)) {
        return false;
      }
    }

    // 3. Available Now filter
    if (filterAvailableOnly && station.overallStatus !== 'available') {
      return false;
    }

    // 4. Search Query (matches name, area, operator, address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        station.name.toLowerCase().includes(q) ||
        station.area.toLowerCase().includes(q) ||
        station.operator.toLowerCase().includes(q) ||
        station.address.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => a.distanceKm - b.distanceKm); // sorted by distance

  // Start Charging session mock
  const startChargingSession = (station, gun) => {
    const session = {
      sessionId: `SES-${Date.now().toString().slice(-6)}`,
      stationId: station.id,
      stationName: station.name,
      stationArea: station.area,
      pricePerKwh: station.pricePerKwh,
      gunId: gun.id,
      gunName: gun.name,
      gunSpeed: gun.speed,
      connectorType: gun.connector,
      vehicleId: activeVehicle.id,
      vehicleName: `${activeVehicle.brand} ${activeVehicle.model}`,
      startBatteryPct: activeVehicle.currentBatteryPct,
      currentBatteryPct: activeVehicle.currentBatteryPct,
      targetBatteryPct: 80,
      batteryCapacityKwh: activeVehicle.batteryCapacityKwh,
      chargingRateKw: Math.min(parseInt(gun.speed) || 50, activeVehicle.maxChargeRateKw || 50),
      energyDeliveredKwh: 0.0,
      elapsedSeconds: 0,
      runningCost: 0.0,
      status: 'charging', // 'charging' | 'completed'
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setActiveSession(session);
    setActiveTab('charging');
  };

  // End charging session and record history
  const endChargingSession = (paymentMode = 'wallet') => {
    if (!activeSession) return null;

    const finalKwh = Math.max(0.2, Math.round(activeSession.energyDeliveredKwh * 10) / 10);
    const finalCost = Math.round(finalKwh * activeSession.pricePerKwh * 100) / 100;
    const finalMinutes = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));

    // Update vehicle battery to current
    updateVehicleBattery(activeSession.vehicleId, activeSession.currentBatteryPct);

    // Deduct from wallet if chosen
    if (paymentMode === 'wallet') {
      deductWalletMoney(finalCost);
    }

    const completedReceipt = {
      id: `ses-${Date.now()}`,
      receiptId: `BLR-REC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: "Just now",
      stationName: activeSession.stationName,
      area: activeSession.stationArea,
      vehicleName: activeSession.vehicleName,
      gunName: activeSession.gunName,
      energyKwh: finalKwh,
      durationMinutes: finalMinutes,
      cost: finalCost,
      pricePerKwh: activeSession.pricePerKwh,
      startBatteryPct: activeSession.startBatteryPct,
      endBatteryPct: activeSession.currentBatteryPct,
      paymentMethod: paymentMode === 'wallet' ? 'ChargeBLR Wallet' : 'UPI (Instant)',
      status: "Completed"
    };

    setHistory(prev => [completedReceipt, ...prev]);
    setActiveSession(null);

    return completedReceipt;
  };

  return (
    <AppContext.Provider
      value={{
        stations,
        userLocation: BANGALORE_USER_LOCATION,
        selectedStationId,
        setSelectedStationId,
        selectedStation,
        filteredStations,
        vehicles,
        activeVehicleId,
        setActiveVehicleId,
        activeVehicle,
        updateVehicleBattery,
        addVehicle,
        deleteVehicle,
        walletBalance,
        addWalletMoney,
        deductWalletMoney,
        history,
        activeSession,
        setActiveSession,
        startChargingSession,
        endChargingSession,
        reportStationStatus,
        activeTab,
        setActiveTab,
        filterVehicleType,
        setFilterVehicleType,
        filterConnector,
        setFilterConnector,
        filterAvailableOnly,
        setFilterAvailableOnly,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
