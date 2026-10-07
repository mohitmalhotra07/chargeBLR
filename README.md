# ⚡ ChargeBLR - Smart EV Charging Companion for Bangalore

**ChargeBLR** is a mobile-first web app built specifically for Two-Wheeler (2W) and Four-Wheeler (4W) electric vehicle drivers across Bangalore, India. It enables EV drivers to discover nearby operational charging stations, check live gun availability and prices in rupees (₹), estimate battery charging time and cost, simulate scanning charger QR codes to unlock barriers, and manage a mock UPI wallet.

---

## 🌟 Key Features

### 1. 🗺️ Interactive Bangalore Map & Station Explorer
- **14 Realistic Bangalore EV Hubs**: Covering key tech corridors and neighborhoods (Koramangala, Indiranagar, HSR Layout, Whitefield, Electronic City, Hebbal Manyata, Jayanagar, MG Road, Bellandur ORR, Malleshwaram, JP Nagar, Banashankari, Yelahanka, and Marathahalli).
- **Status Pins**:
  - 🟢 **Green**: Available (with live free gun counter)
  - 🟠 **Orange**: Busy / High demand
  - 🔴 **Red**: Out of order / under maintenance
- **Dynamic Filters**:
  - Vehicle Type: 2-Wheeler (Ather, Ola, TVS) / 4-Wheeler (Tata, MG, Mahindra) / All EVs
  - Connector Type: CCS2 (DC Fast), Type 2 (AC), 2-Wheeler Standard (16A / Ather Dot), Bharat AC-001
  - "Available Now" toggle filter
  - Live search by locality or network operator (Tata Power EZ Charge, Ather Grid, Jio-bp pulse, BESCOM EV Mitr, Zeon, Kazam, Shell Recharge)
- **Map & List Toggle**: Switch between an interactive Leaflet map (using OpenStreetMap tiles, zero API key required) and a distance-sorted list view.

### 2. ⚡ Station Details & Community Reporting
- Complete station specifications: Tariff (₹/kWh), peak power speed (kW), opening hours, operator network, and verified amenities.
- **Live Charger Points (Guns)**: Displays status for each connector gun (Available, In Use with time remaining, or Out of Order) with "last updated X minutes ago".
- **Action Buttons**:
  - **Navigate**: Direct Google Maps driving directions with exact GPS coordinates.
  - **Report Status**: Community driver reporting modal allowing drivers to flag stations as "Working", "Occupied", or "Broken" with immediate state updates.
  - **Start Charging**: Directly connects to the QR scanning workflow.

### 3. 🛵 My Vehicle & Battery Estimation Calculator
- **Vehicle Garage**: Switch between or add multiple 2W and 4W EVs with Indian model presets (Tata Nexon EV, Tata Punch EV, MG ZS EV, Ather 450X, Ola S1 Pro, TVS iQube, etc.) or custom models.
- **Interactive Battery Slider**: Adjust current battery percentage (1% - 100%) with a color-coded visual battery tank gauge.
- **Dynamic Estimations**:
  - Target 80% (optimal fast-charging sweet spot) or 100% full charge.
  - Energy needed (kWh)
  - Approximate charging time based on station kW rating and vehicle capacity (including fast-charge taper).
  - Estimated cost in Rupees (₹) at the selected benchmark station.

### 4. 📲 Mock Charging Session & Barrier Unlock
- **QR Viewfinder Simulation**: Realistic camera scanner with green animated laser line, flashlight toggle, and manual Gun ID entry.
- **Barrier Unlock Animation**: Simulates the cloud handshake and barrier lifting up to admit the vehicle into the charging bay.
- **Live Charging Telemetry**:
  - Rising battery percentage dial with animated power flow.
  - kWh delivered in real-time.
  - Telemetry: 410V • 135A power output.
  - Running cost in Rupees (₹).
  - Fast-forward simulation speed control (1x, 2x, 5x) for rapid demonstration.
- **Session Summary**: Confetti celebration, itemized energy breakdown, and automatic payment generation.

### 5. 💳 Mock UPI Wallet & Tax Invoices
- **ChargeBLR Wallet**: Stored balance with instant auto-deduct.
- **UPI Top-Up Modal**: Recharging via Google Pay, PhonePe, Paytm, BHIM, or custom UPI ID.
- **Tax Invoices**: Complete itemized receipt history with downloadable/viewable breakdowns including GST calculation.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Map Engine**: Leaflet (OpenStreetMap / CartoDB tiles — no external API key required)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **State & Storage**: React Context API with LocalStorage persistence

---

## 🚀 Running the Project

```bash
# 1. Navigate to the project directory
cd C:\Users\DELL\.gemini\antigravity-ide\scratch\chargeblr

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:5173/
```
