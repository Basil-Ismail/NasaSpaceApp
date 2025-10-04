# Meteor Madness - Frontend

A polished, production-ready 3D visualization system for tracking near-Earth meteors and simulating rocket interception missions. Built for the NASA Space App hackathon.

## 🚀 Features

- **Real-time 3D Visualization**: Space-themed scene with textured Earth, animated meteor orbits, and rocket trajectories
- **Live Updates**: WebSocket streaming for real-time position updates (10 Hz)
- **Interactive Controls**: Play/Pause, speed control (1x, 10x, 60x), and rocket launch simulation
- **Risk Assessment**: Color-coded meteor risk levels based on MOID (Minimum Orbit Intersection Distance)
- **Simulation Results**: Visual feedback for rocket interception (hit/miss with particle effects)
- **Detailed Metrics**: Orbital parameters, ETA, miss distance, and intercept timing

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **3D Graphics**: react-three-fiber + three.js + @react-three/drei
- **State Management**: Zustand
- **Data Fetching**: SWR + Axios
- **Styling**: Tailwind CSS
- **Real-time**: Native WebSocket API

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running at `http://localhost:8080` (configurable)

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.local.example .env.local

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

## ⚙️ Configuration

Edit `.env.local` to configure backend endpoints:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## 🎮 How to Use

### 1. Select a Meteor

- Browse meteors in the left sidebar
- Risk indicators: 🟢 Low (≥0.05 AU) | 🟡 Medium (0.02-0.05 AU) | 🔴 High (<0.02 AU)
- Click a meteor to load its orbit and details

### 2. Start Simulation

- Click **▶ Play** to begin real-time animation
- Adjust speed: **1x** (real-time), **10x**, or **60x**
- The meteor animates along its orbital path with live position updates

### 3. Launch Rocket

Configure rocket parameters:

- **v0 (m/s)**: Initial velocity (default: 12,000)
- **Burn (s)**: Burn duration (default: 60)
- **Δv (m/s)**: Delta-v budget (default: 3,000)
- **Strategy**: `lead` (predictive) or `direct` (current position)

Click **🚀 Launch Rocket** to simulate interception.

### 4. View Results

- **Hit**: Green explosion effect at intercept point with success banner
- **Miss**: Red marker at closest approach with miss distance

## 📐 Units & Scaling

### Backend Units

- **Positions**: Astronomical Units (AU)
- **Time**: ISO 8601 strings
- **Velocity**: meters per second (m/s)

### Scene Scaling

To maintain visual clarity:

- **Earth radius** = 1 scene unit
- **1 AU** = 100 Earth radii in scene coordinates
- Conversion factor: `AU_TO_SCENE = 100`

### Distance Conversions

- 1 AU = 149,597,870.7 km
- Earth radius = 6,371 km

## 🏗 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app with WebSocket & animation loop
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── SceneCanvas.tsx     # 3D scene setup (Canvas, lights, camera)
│   ├── Earth.tsx           # Textured Earth sphere
│   ├── OrbitPath.tsx       # Meteor orbit polyline
│   ├── MeteorObject.tsx    # Animated meteor with interpolation
│   ├── RocketObject.tsx    # Rocket with explosion effects
│   ├── HUD.tsx             # Info overlays & result banners
│   ├── Sidebar.tsx         # Meteor list with risk indicators
│   ├── Controls.tsx        # Playback & simulation controls
│   └── Legend.tsx          # Risk color legend
├── lib/
│   ├── api.ts              # REST API client (SWR hooks)
│   ├── ws.ts               # WebSocket client & manager
│   ├── units.ts            # Unit conversions (AU ↔ km ↔ scene)
│   ├── time.ts             # ISO date helpers & interpolation
│   └── colors.ts           # Risk color scale functions
├── state/
│   └── useSimStore.ts      # Zustand store (meteor, playback, rocket)
└── types/
    └── api.ts              # TypeScript interfaces for API
```

## 🎨 Styling

- **Dark space theme** with gradient background
- **Glassmorphism panels** for UI elements (backdrop-blur)
- **Color-coded risk indicators**: green/yellow/red
- **Glow effects** on interactive buttons
- **Custom scrollbars** for sidebar

## 🔧 Backend API Contracts

### REST Endpoints

```
GET  /health                           → { status: "ok" }
GET  /meteors                          → [{ slug, name, moidAu, periodYears }]
GET  /meteors/:slug                    → full meteor details
GET  /meteors/:slug/trajectory?...     → { points: [{ tIso, rAu }] }
POST /simulate                         → { result: "hit"|"miss", ... }
```

### WebSocket

```
WS   ws://localhost:8080/ws/live?meteorId=<slug>

Frame format:
{
  "t_iso": "2025-10-03T12:00:00Z",
  "meteor": { "r_au": [x, y, z] },
  "rocket": { "r_au": [x, y, z], "active": true }
}
```

## 🚦 Development

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 🧪 Time & Animation

### Playback Model

- **Source of truth**: Backend `t_iso` timestamps
- **Client clock**: Advances based on selected speed (1x/10x/60x)
- **Interpolation**: Linear interpolation (lerp) between WebSocket frames for 60 FPS rendering

### Frame Handling

- WebSocket delivers ~10 frames/sec
- Frontend maintains ring buffer of last 10 frames
- Position calculated by interpolating between bracketing frames based on `currentTimeIso`

## 🎯 Acceptance Criteria

✅ App boots at `localhost:3000` with Earth + starfield  
✅ Sidebar lists meteors with risk colors from `/meteors`  
✅ Selecting meteor loads orbit path via `/meteors/:slug/trajectory`  
✅ Meteor animates along orbit using WebSocket frames  
✅ Play/Pause & speed controls work correctly  
✅ Rocket simulation via `/simulate` POST  
✅ Visual feedback: explosion on hit, marker on miss  
✅ TypeScript strict mode, no console errors  
✅ ESLint passes

## 📦 Production Deployment

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Set environment variables for production backend URLs

3. Start the server:
   ```bash
   npm start
   ```

## 🐛 Troubleshooting

### Backend Connection Issues

- Verify backend is running at configured URL
- Check CORS settings on backend
- Ensure WebSocket endpoint is accessible

### 3D Scene Not Rendering

- Check browser console for Three.js errors
- Verify Earth texture exists at `/public/textures/earth_daymap.jpg`
- Try clearing browser cache

### WebSocket Connection Drops

- Check network stability
- Verify `meteorId` is valid
- Backend logs may show connection errors

## 📝 Notes

- Earth texture should be placed in `/public/textures/earth_daymap.jpg`
- You can download a free Earth texture from NASA's website or use a placeholder
- Scene uses perspective camera with OrbitControls for intuitive navigation
- Orbit paths are downsampled to ~300 points for performance
- WebSocket auto-reconnects on disconnect (2-second delay)

## 🤝 Contributing

This is a hackathon project. For issues or improvements, please open a GitHub issue.

## 📄 License

MIT License - built for NASA Space Apps Challenge 2025

---

**Made with 🚀 for the Meteor Madness project**
