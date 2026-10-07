// Realistic Bangalore EV Charging Stations Data
window.MOCK_STATIONS = [
  {
    id: "blr-kor-01",
    name: "Tata Power EZ Charge - Forum Mall",
    operator: "Tata Power",
    area: "Koramangala",
    address: "Forum Mall Basement Parking, Hosur Road, Koramangala 7th Block, Bengaluru, 560095",
    lat: 12.9352,
    lng: 77.6138,
    distanceKm: 1.2,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "available", // 'available' (green), 'busy' (orange), 'broken' (red)
    pricePerKwh: 18.5,
    maxPowerKw: 60,
    rating: 4.6,
    reviewsCount: 184,
    openHours: "24/7 Open",
    amenities: ["Shopping Mall", "Food Court", "Restrooms", "Covered Parking", "CCTV 24/7"],
    lastUpdatedMinutes: 3,
    connectors: [
      { type: "CCS2", powerKw: 60, total: 2, available: 2 },
      { type: "Type 2", powerKw: 22, total: 2, available: 1 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 4, available: 3 }
    ],
    bays: [
      { id: "BAY-1A", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "BAY-1B", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "BAY-2A", connector: "Type 2", powerKw: 22, status: "in_use", currentOccupant: "Nexon EV (72%)" },
      { id: "BAY-2B", connector: "Type 2", powerKw: 22, status: "available", currentOccupant: null },
      { id: "BAY-3A", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null },
      { id: "BAY-3B", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null },
      { id: "BAY-3C", connector: "2-wheeler standard", powerKw: 3.3, status: "in_use", currentOccupant: "Ola S1 Pro" },
      { id: "BAY-3D", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-ind-02",
    name: "Ather Grid Fast Hub - 100ft Road",
    operator: "Ather Grid",
    area: "Indiranagar",
    address: "Opp. Toit Brewpub, 100 Feet Road, Indiranagar, Bengaluru, 560038",
    lat: 12.9784,
    lng: 77.6408,
    distanceKm: 3.4,
    vehicleTypes: ["2W"],
    overallStatus: "available",
    pricePerKwh: 15.0,
    maxPowerKw: 22,
    rating: 4.8,
    reviewsCount: 230,
    openHours: "24/7 Open",
    amenities: ["Cafe Nearby", "Street Parking", "Free WiFi", "Fast charging grid"],
    lastUpdatedMinutes: 1,
    connectors: [
      { type: "2-wheeler standard", powerKw: 22, total: 4, available: 3 },
      { type: "Bharat AC", powerKw: 3.3, total: 2, available: 2 }
    ],
    bays: [
      { id: "ATH-01", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ATH-02", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ATH-03", connector: "2-wheeler standard", powerKw: 22, status: "in_use", currentOccupant: "Ather 450X" },
      { id: "ATH-04", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ATH-05", connector: "Bharat AC", powerKw: 3.3, status: "available", currentOccupant: null },
      { id: "ATH-06", connector: "Bharat AC", powerKw: 3.3, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-whi-03",
    name: "Jio-bp pulse SuperHub - ITPL Main Road",
    operator: "Jio-bp pulse",
    area: "Whitefield",
    address: "Beside ITPL Gate 2, Pattandur Agrahara, Whitefield, Bengaluru, 560066",
    lat: 12.9866,
    lng: 77.7376,
    distanceKm: 14.2,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "busy", // orange
    pricePerKwh: 20.0,
    maxPowerKw: 120,
    rating: 4.4,
    reviewsCount: 310,
    openHours: "24/7 Open",
    amenities: ["Wildbean Cafe", "Clean Restrooms", "Air & Water", "EV Lounge", "Security"],
    lastUpdatedMinutes: 5,
    connectors: [
      { type: "CCS2", powerKw: 120, total: 4, available: 0 },
      { type: "Type 2", powerKw: 22, total: 2, available: 1 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 4, available: 2 }
    ],
    bays: [
      { id: "JIO-DC1", connector: "CCS2", powerKw: 120, status: "in_use", currentOccupant: "MG ZS EV (45%)" },
      { id: "JIO-DC2", connector: "CCS2", powerKw: 120, status: "in_use", currentOccupant: "Hyundai Ioniq 5" },
      { id: "JIO-DC3", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Tata Punch EV" },
      { id: "JIO-DC4", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Tata Nexon EV" },
      { id: "JIO-AC1", connector: "Type 2", powerKw: 22, status: "available", currentOccupant: null },
      { id: "JIO-AC2", connector: "Type 2", powerKw: 22, status: "in_use", currentOccupant: "Mahindra XUV400" },
      { id: "JIO-2W1", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null },
      { id: "JIO-2W2", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-hsr-04",
    name: "Zeon Fast Charging - Sector 1 HSR",
    operator: "Zeon Charging",
    area: "HSR Layout",
    address: "27th Main Road, Sector 1, Near Agara Lake Junction, HSR Layout, Bengaluru, 560102",
    lat: 12.9121,
    lng: 77.6446,
    distanceKm: 2.8,
    vehicleTypes: ["4W"],
    overallStatus: "available",
    pricePerKwh: 19.5,
    maxPowerKw: 60,
    rating: 4.7,
    reviewsCount: 165,
    openHours: "24/7 Open",
    amenities: ["Third Wave Coffee Adjacent", "Security Guard", "Canopy Covered", "Tire Pressure"],
    lastUpdatedMinutes: 4,
    connectors: [
      { type: "CCS2", powerKw: 60, total: 2, available: 1 },
      { type: "Type 2", powerKw: 22, total: 2, available: 2 }
    ],
    bays: [
      { id: "ZN-01", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "ZN-02", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Kia EV6 (68%)" },
      { id: "ZN-03", connector: "Type 2", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ZN-04", connector: "Type 2", powerKw: 22, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-ele-05",
    name: "Statiq HyperHub - Electronics City Phase 1",
    operator: "Statiq",
    area: "Electronic City",
    address: "Wipro Gate 5 Road, Electronics City Phase 1, Bengaluru, 560100",
    lat: 12.8452,
    lng: 77.6602,
    distanceKm: 11.5,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "available",
    pricePerKwh: 17.0,
    maxPowerKw: 120,
    rating: 4.5,
    reviewsCount: 220,
    openHours: "24/7 Open",
    amenities: ["EV Driver Lounge", "Tea Stall", "Restroom", "24hr Assistance"],
    lastUpdatedMinutes: 7,
    connectors: [
      { type: "CCS2", powerKw: 120, total: 2, available: 2 },
      { type: "CCS2", powerKw: 60, total: 2, available: 1 },
      { type: "Bharat AC", powerKw: 3.3, total: 4, available: 4 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 6, available: 5 }
    ],
    bays: [
      { id: "STQ-01", connector: "CCS2", powerKw: 120, status: "available", currentOccupant: null },
      { id: "STQ-02", connector: "CCS2", powerKw: 120, status: "available", currentOccupant: null },
      { id: "STQ-03", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "BYD Atto 3 (88%)" },
      { id: "STQ-04", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-heb-06",
    name: "BESCOM EV Mitr - Manyata Tech Park",
    operator: "BESCOM",
    area: "Hebbal",
    address: "Gate 1 Service Road, Manyata Embassy Business Park, Hebbal, Bengaluru, 560045",
    lat: 13.0475,
    lng: 77.6205,
    distanceKm: 12.8,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "broken", // red = not working
    pricePerKwh: 14.5,
    maxPowerKw: 50,
    rating: 3.5,
    reviewsCount: 95,
    openHours: "06:00 AM - 10:00 PM",
    amenities: ["Public Parking", "BESCOM Support Desk"],
    lastUpdatedMinutes: 18,
    connectors: [
      { type: "CCS2", powerKw: 50, total: 2, available: 0 },
      { type: "Bharat AC", powerKw: 3.3, total: 3, available: 0 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 2, available: 0 }
    ],
    bays: [
      { id: "BES-01", connector: "CCS2", powerKw: 50, status: "broken", currentOccupant: "Grid offline - under repair" },
      { id: "BES-02", connector: "CCS2", powerKw: 50, status: "broken", currentOccupant: "Connector damaged" },
      { id: "BES-03", connector: "Bharat AC", powerKw: 3.3, status: "broken", currentOccupant: "Power issue" }
    ]
  },
  {
    id: "blr-jay-07",
    name: "ChargeZone Hub - Jayanagar 4th Block",
    operator: "ChargeZone",
    area: "Jayanagar",
    address: "Near Jayanagar BDA Shopping Complex, 11th Main, 4th Block, Bengaluru, 560011",
    lat: 12.9287,
    lng: 77.5828,
    distanceKm: 4.1,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "available",
    pricePerKwh: 18.0,
    maxPowerKw: 60,
    rating: 4.6,
    reviewsCount: 140,
    openHours: "24/7 Open",
    amenities: ["South Indian Eateries", "Public Park", "ATM", "Lit Area"],
    lastUpdatedMinutes: 2,
    connectors: [
      { type: "CCS2", powerKw: 60, total: 2, available: 1 },
      { type: "Type 2", powerKw: 7.4, total: 2, available: 2 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 4, available: 3 }
    ],
    bays: [
      { id: "CZ-01", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "CZ-02", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Tata Nexon EV" },
      { id: "CZ-03", connector: "Type 2", powerKw: 7.4, status: "available", currentOccupant: null },
      { id: "CZ-04", connector: "Type 2", powerKw: 7.4, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-bel-08",
    name: "Tata Power Mega Charge - RMZ Ecoworld",
    operator: "Tata Power",
    area: "Bellandur",
    address: "Outer Ring Road, RMZ Ecoworld Campus, Devarabisanahalli, Bellandur, Bengaluru, 560103",
    lat: 12.9237,
    lng: 77.6833,
    distanceKm: 6.9,
    vehicleTypes: ["4W"],
    overallStatus: "busy", // orange
    pricePerKwh: 19.0,
    maxPowerKw: 60,
    rating: 4.5,
    reviewsCount: 178,
    openHours: "24/7 Open",
    amenities: ["Starbucks", "Food Hall", "Security Barrier", "Restrooms"],
    lastUpdatedMinutes: 6,
    connectors: [
      { type: "CCS2", powerKw: 60, total: 3, available: 0 },
      { type: "Type 2", powerKw: 22, total: 2, available: 1 }
    ],
    bays: [
      { id: "TP-ECO1", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "MG ZS EV" },
      { id: "TP-ECO2", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Tata Tiago EV" },
      { id: "TP-ECO3", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Mahindra XUV400" },
      { id: "TP-ECO4", connector: "Type 2", powerKw: 22, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-mal-09",
    name: "Ather Experience Space - Malleshwaram",
    operator: "Ather Grid",
    area: "Malleshwaram",
    address: "Sampige Road, Between 7th & 8th Cross, Malleshwaram, Bengaluru, 560003",
    lat: 13.0031,
    lng: 77.5709,
    distanceKm: 8.7,
    vehicleTypes: ["2W"],
    overallStatus: "available",
    pricePerKwh: 15.0,
    maxPowerKw: 22,
    rating: 4.9,
    reviewsCount: 260,
    openHours: "08:00 AM - 11:00 PM",
    amenities: ["Customer Lounge", "Water Dispenser", "Ather Technicians", "Air Filling"],
    lastUpdatedMinutes: 2,
    connectors: [
      { type: "2-wheeler standard", powerKw: 22, total: 4, available: 3 },
      { type: "Bharat AC", powerKw: 3.3, total: 2, available: 1 }
    ],
    bays: [
      { id: "ATH-MAL1", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ATH-MAL2", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null },
      { id: "ATH-MAL3", connector: "2-wheeler standard", powerKw: 22, status: "in_use", currentOccupant: "TVS iQube" },
      { id: "ATH-MAL4", connector: "2-wheeler standard", powerKw: 22, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-mgr-10",
    name: "Kazam EV Station - MG Road Metro",
    operator: "Kazam",
    area: "MG Road",
    address: "Under MG Road Metro Station, Church Street Exit, Bengaluru, 560001",
    lat: 12.9756,
    lng: 77.6066,
    distanceKm: 4.2,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "available",
    pricePerKwh: 17.5,
    maxPowerKw: 30,
    rating: 4.3,
    reviewsCount: 112,
    openHours: "05:30 AM - 11:30 PM",
    amenities: ["Metro Connectivity", "Church Street Walkway", "Covered Bay"],
    lastUpdatedMinutes: 9,
    connectors: [
      { type: "CCS2", powerKw: 30, total: 1, available: 1 },
      { type: "Type 2", powerKw: 7.4, total: 2, available: 2 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 4, available: 2 }
    ],
    bays: [
      { id: "KZM-01", connector: "CCS2", powerKw: 30, status: "available", currentOccupant: null },
      { id: "KZM-02", connector: "Type 2", powerKw: 7.4, status: "available", currentOccupant: null },
      { id: "KZM-03", connector: "2-wheeler standard", powerKw: 3.3, status: "in_use", currentOccupant: "Ather 450X" },
      { id: "KZM-04", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-sar-11",
    name: "Zeon Ultra Charger - Sarjapur Wipro Junction",
    operator: "Zeon Charging",
    area: "Sarjapur Road",
    address: "Near Decathlon Sarjapur, Sarjapur Main Road, Carmelaram, Bengaluru, 560035",
    lat: 12.9094,
    lng: 77.6974,
    distanceKm: 8.5,
    vehicleTypes: ["4W"],
    overallStatus: "available",
    pricePerKwh: 21.0,
    maxPowerKw: 120,
    rating: 4.7,
    reviewsCount: 145,
    openHours: "24/7 Open",
    amenities: ["Decathlon Store", "Subway / Cafe", "Restrooms", "Free Tire Air"],
    lastUpdatedMinutes: 4,
    connectors: [
      { type: "CCS2", powerKw: 120, total: 2, available: 1 },
      { type: "CCS2", powerKw: 60, total: 2, available: 2 }
    ],
    bays: [
      { id: "ZN-SAR1", connector: "CCS2", powerKw: 120, status: "available", currentOccupant: null },
      { id: "ZN-SAR2", connector: "CCS2", powerKw: 120, status: "in_use", currentOccupant: "Hyundai Ioniq 5" },
      { id: "ZN-SAR3", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "ZN-SAR4", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-jpn-12",
    name: "Statiq EV Station - JP Nagar 7th Phase",
    operator: "Statiq",
    area: "JP Nagar",
    address: "24th Main Road, Brigade Millennium Junction, JP Nagar 7th Phase, Bengaluru, 560078",
    lat: 12.8942,
    lng: 77.5849,
    distanceKm: 6.1,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "available",
    pricePerKwh: 18.0,
    maxPowerKw: 60,
    rating: 4.4,
    reviewsCount: 88,
    openHours: "24/7 Open",
    amenities: ["Brewery Nearby", "Coffee Shop", "Restrooms", "CCTV Monitoring"],
    lastUpdatedMinutes: 11,
    connectors: [
      { type: "CCS2", powerKw: 60, total: 2, available: 1 },
      { type: "Bharat AC", powerKw: 3.3, total: 2, available: 2 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 3, available: 2 }
    ],
    bays: [
      { id: "STQ-JP1", connector: "CCS2", powerKw: 60, status: "available", currentOccupant: null },
      { id: "STQ-JP2", connector: "CCS2", powerKw: 60, status: "in_use", currentOccupant: "Tata Punch EV" },
      { id: "STQ-JP3", connector: "Bharat AC", powerKw: 3.3, status: "available", currentOccupant: null },
      { id: "STQ-JP4", connector: "2-wheeler standard", powerKw: 3.3, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-yel-13",
    name: "Shell Recharge - Airport Highway Yelahanka",
    operator: "Shell Recharge",
    area: "Yelahanka",
    address: "NH 44 Airport Corridor, Near Kogilu Cross, Yelahanka, Bengaluru, 560064",
    lat: 13.1007,
    lng: 77.6015,
    distanceKm: 18.2,
    vehicleTypes: ["4W"],
    overallStatus: "available",
    pricePerKwh: 22.5,
    maxPowerKw: 150,
    rating: 4.8,
    reviewsCount: 390,
    openHours: "24/7 Open",
    amenities: ["Shell Select Deli", "Fresh Coffee", "Clean Premium Restrooms", "Highway Lounge"],
    lastUpdatedMinutes: 3,
    connectors: [
      { type: "CCS2", powerKw: 150, total: 4, available: 3 },
      { type: "Type 2", powerKw: 22, total: 2, available: 2 }
    ],
    bays: [
      { id: "SH-DC1", connector: "CCS2", powerKw: 150, status: "available", currentOccupant: null },
      { id: "SH-DC2", connector: "CCS2", powerKw: 150, status: "available", currentOccupant: null },
      { id: "SH-DC3", connector: "CCS2", powerKw: 150, status: "in_use", currentOccupant: "Mercedes EQB" },
      { id: "SH-DC4", connector: "CCS2", powerKw: 150, status: "available", currentOccupant: null }
    ]
  },
  {
    id: "blr-ban-14",
    name: "BESCOM EV Mitr - Banashankari BDA Complex",
    operator: "BESCOM",
    area: "Banashankari",
    address: "24th Cross Rd, Banashankari 2nd Stage, Bengaluru, 560070",
    lat: 12.9254,
    lng: 77.5647,
    distanceKm: 6.8,
    vehicleTypes: ["2W", "4W"],
    overallStatus: "broken", // red = out of order
    pricePerKwh: 14.5,
    maxPowerKw: 50,
    rating: 3.2,
    reviewsCount: 74,
    openHours: "07:00 AM - 09:00 PM",
    amenities: ["BDA Market", "Parking Lot"],
    lastUpdatedMinutes: 25,
    connectors: [
      { type: "CCS2", powerKw: 50, total: 2, available: 0 },
      { type: "2-wheeler standard", powerKw: 3.3, total: 4, available: 0 }
    ],
    bays: [
      { id: "BSK-01", connector: "CCS2", powerKw: 50, status: "broken", currentOccupant: "Transformer maintenance" },
      { id: "BSK-02", connector: "CCS2", powerKw: 50, status: "broken", currentOccupant: "Screen frozen" },
      { id: "BSK-03", connector: "2-wheeler standard", powerKw: 3.3, status: "broken", currentOccupant: "No power" }
    ]
  }
];
