export const PRESET_VEHICLES = [
  // Two Wheelers
  {
    id: "preset-ather-450x",
    type: "2-wheeler",
    brand: "Ather",
    model: "450X (3.7 kWh)",
    batteryCapacityKwh: 3.7,
    currentBatteryPct: 32,
    compatibleConnectors: ["2-wheeler standard"],
    maxChargeRateKw: 3.3,
    icon: "bike",
    color: "#10B981"
  },
  {
    id: "preset-ola-s1pro",
    type: "2-wheeler",
    brand: "Ola Electric",
    model: "S1 Pro Gen 2 (4.0 kWh)",
    batteryCapacityKwh: 4.0,
    currentBatteryPct: 45,
    compatibleConnectors: ["2-wheeler standard"],
    maxChargeRateKw: 3.3,
    icon: "bike",
    color: "#38BDF8"
  },
  {
    id: "preset-tvs-iqube",
    type: "2-wheeler",
    brand: "TVS",
    model: "iQube ST (3.4 kWh)",
    batteryCapacityKwh: 3.4,
    currentBatteryPct: 20,
    compatibleConnectors: ["2-wheeler standard"],
    maxChargeRateKw: 3.0,
    icon: "bike",
    color: "#F59E0B"
  },
  // Four Wheelers
  {
    id: "preset-nexon-ev",
    type: "4-wheeler",
    brand: "Tata",
    model: "Nexon EV Long Range (40.5 kWh)",
    batteryCapacityKwh: 40.5,
    currentBatteryPct: 28,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    icon: "car",
    color: "#3B82F6"
  },
  {
    id: "preset-punch-ev",
    type: "4-wheeler",
    brand: "Tata",
    model: "Punch EV LR (35.0 kWh)",
    batteryCapacityKwh: 35.0,
    currentBatteryPct: 35,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    icon: "car",
    color: "#EC4899"
  },
  {
    id: "preset-mg-zs",
    type: "4-wheeler",
    brand: "MG Motor",
    model: "ZS EV Exclusive (50.3 kWh)",
    batteryCapacityKwh: 50.3,
    currentBatteryPct: 22,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    icon: "car",
    color: "#8B5CF6"
  },
  {
    id: "preset-xuv400",
    type: "4-wheeler",
    brand: "Mahindra",
    model: "XUV400 EL Pro (39.4 kWh)",
    batteryCapacityKwh: 39.4,
    currentBatteryPct: 40,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    icon: "car",
    color: "#14B8A6"
  }
];

export const INITIAL_USER_VEHICLES = [
  {
    id: "user-v1",
    type: "4-wheeler",
    brand: "Tata",
    model: "Nexon EV Long Range",
    registrationNumber: "KA 01 MN 4829",
    batteryCapacityKwh: 40.5,
    currentBatteryPct: 28,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    isDefault: true
  },
  {
    id: "user-v2",
    type: "2-wheeler",
    brand: "Ather",
    model: "450X Gen 3",
    registrationNumber: "KA 05 EM 1983",
    batteryCapacityKwh: 3.7,
    currentBatteryPct: 35,
    compatibleConnectors: ["2-wheeler standard"],
    maxChargeRateKw: 3.3,
    isDefault: false
  }
];
