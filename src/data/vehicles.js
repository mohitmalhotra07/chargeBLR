// Realistic EV Vehicles in India (2-Wheeler and 4-Wheeler)
window.DEFAULT_VEHICLES = [
  {
    id: "veh-nexon",
    type: "4W",
    brand: "Tata",
    model: "Nexon EV Long Range",
    batteryKwh: 40.5,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 50,
    efficiencyKmPerKwh: 6.8,
    color: "#059669",
    regNo: "KA 01 EV 4429"
  },
  {
    id: "veh-ather",
    type: "2W",
    brand: "Ather",
    model: "450X Gen 3",
    batteryKwh: 3.7,
    compatibleConnectors: ["2-wheeler standard", "Bharat AC"],
    maxChargeRateKw: 22,
    efficiencyKmPerKwh: 28.0,
    color: "#10b981",
    regNo: "KA 05 EV 1290"
  },
  {
    id: "veh-ola",
    type: "2W",
    brand: "Ola",
    model: "S1 Pro Gen 2",
    batteryKwh: 4.0,
    compatibleConnectors: ["2-wheeler standard"],
    maxChargeRateKw: 11,
    efficiencyKmPerKwh: 26.5,
    color: "#f59e0b",
    regNo: "KA 03 EV 8812"
  },
  {
    id: "veh-mg",
    type: "4W",
    brand: "MG",
    model: "ZS EV Exclusive",
    batteryKwh: 50.3,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 60,
    efficiencyKmPerKwh: 6.2,
    color: "#3b82f6",
    regNo: "KA 04 EV 9901"
  },
  {
    id: "veh-tvs",
    type: "2W",
    brand: "TVS",
    model: "iQube ST",
    batteryKwh: 5.1,
    compatibleConnectors: ["2-wheeler standard", "Bharat AC"],
    maxChargeRateKw: 3.3,
    efficiencyKmPerKwh: 27.0,
    color: "#6366f1",
    regNo: "KA 51 EV 3211"
  },
  {
    id: "veh-ioniq",
    type: "4W",
    brand: "Hyundai",
    model: "Ioniq 5 RWD",
    batteryKwh: 72.6,
    compatibleConnectors: ["CCS2", "Type 2"],
    maxChargeRateKw: 150,
    efficiencyKmPerKwh: 6.5,
    color: "#8b5cf6",
    regNo: "KA 53 EV 7788"
  }
];

window.POPULAR_VEHICLE_CATALOG = [
  // 2-Wheelers
  { type: "2W", brand: "Ather", model: "450X Gen 3", batteryKwh: 3.7, connector: "2-wheeler standard" },
  { type: "2W", brand: "Ather", model: "450 Apex", batteryKwh: 3.7, connector: "2-wheeler standard" },
  { type: "2W", brand: "Ather", model: "Rizta Z", batteryKwh: 3.7, connector: "2-wheeler standard" },
  { type: "2W", brand: "Ola", model: "S1 Pro Gen 2", batteryKwh: 4.0, connector: "2-wheeler standard" },
  { type: "2W", brand: "Ola", model: "S1 Air", batteryKwh: 3.0, connector: "2-wheeler standard" },
  { type: "2W", brand: "TVS", model: "iQube ST", batteryKwh: 5.1, connector: "2-wheeler standard" },
  { type: "2W", brand: "Bajaj", model: "Chetak Premium", batteryKwh: 3.2, connector: "2-wheeler standard" },
  { type: "2W", brand: "Hero", model: "Vida V1 Pro", batteryKwh: 3.94, connector: "2-wheeler standard" },
  { type: "2W", brand: "Ultraviolette", model: "F77 Mach 2", batteryKwh: 10.3, connector: "2-wheeler standard" },

  // 4-Wheelers
  { type: "4W", brand: "Tata", model: "Nexon EV Long Range", batteryKwh: 40.5, connector: "CCS2" },
  { type: "4W", brand: "Tata", model: "Punch EV Long Range", batteryKwh: 35.0, connector: "CCS2" },
  { type: "4W", brand: "Tata", model: "Tiago EV Long Range", batteryKwh: 24.0, connector: "CCS2" },
  { type: "4W", brand: "Tata", model: "Curvv EV 55", batteryKwh: 55.0, connector: "CCS2" },
  { type: "4W", brand: "MG", model: "ZS EV", batteryKwh: 50.3, connector: "CCS2" },
  { type: "4W", brand: "MG", model: "Windsor EV", batteryKwh: 38.0, connector: "CCS2" },
  { type: "4W", brand: "Mahindra", model: "XUV400 EL Pro", batteryKwh: 39.4, connector: "CCS2" },
  { type: "4W", brand: "Hyundai", model: "Ioniq 5", batteryKwh: 72.6, connector: "CCS2" },
  { type: "4W", brand: "BYD", model: "Atto 3", batteryKwh: 60.48, connector: "CCS2" },
  { type: "4W", brand: "Kia", model: "EV6 GT-Line", batteryKwh: 77.4, connector: "CCS2" }
];
