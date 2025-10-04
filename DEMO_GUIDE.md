# 🎮 Meteor Madness - Quick Demo Guide

## 🚀 5-Minute Demo Script

### Setup (30 seconds)

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open **http://localhost:3000**

---

## 🎯 Demo Flow

### 1️⃣ **Show The Scene** (30 sec)

- Point out rotating Earth
- Highlight star field
- Mention "Inspired by NASA Eyes on the Solar System"
- Use mouse to rotate/zoom camera

### 2️⃣ **Browse Meteors** (1 min)

- Open sidebar (left)
- Point out risk colors:
  - 🟢 Green = Low risk (far from Earth)
  - 🟡 Yellow = Medium risk (closer)
  - 🔴 Red = High risk (very close!)
- Click on a **high-risk meteor** (red dot)

### 3️⃣ **Load Orbit** (30 sec)

- Watch orbit path appear (colored line)
- Show meteor details in HUD (top left)
  - MOID (distance)
  - Period
  - Eccentricity
  - Inclination

### 4️⃣ **Start Simulation** (1 min)

- Click **▶ Play** button
- Meteor starts moving along orbit
- Point out: "Real-time WebSocket updates"
- Try speed controls: **1x → 10x → 60x**
- Show smooth interpolation

### 5️⃣ **Launch Rocket** (2 min)

- Show rocket controls (bottom bar)
- Explain parameters:
  - **v0**: Initial velocity (12,000 m/s)
  - **Burn**: Engine duration (60s)
  - **Δv**: Delta-v budget (3,000 m/s)
  - **Strategy**: Lead (predictive) or Direct
- Click **🚀 Launch Rocket**
- Watch rocket appear and travel
- **If HIT**: 💥 Explosion + green banner
- **If MISS**: ❌ Red marker + distance

---

## 🎤 Key Talking Points

### Technical Highlights

- "Built with Next.js and Three.js"
- "Real-time WebSocket streaming at 10 Hz"
- "Smooth 60 FPS animation with interpolation"
- "All units in AU (Astronomical Units)"

### Features to Emphasize

- "Risk assessment based on MOID"
- "Configurable rocket parameters"
- "Hit/miss visualization with particle effects"
- "Play/pause and speed control"

### Visual Impact

- "Space-themed UI with glassmorphism"
- "Color-coded risk indicators"
- "3D orbital mechanics simulation"
- "NASA-inspired design"

---

## 🎯 Pro Tips

### Best Meteors to Demo

1. **High-risk meteor** (red) - shows urgency
2. **Medium-risk** (yellow) - good for comparison
3. Pick one with **interesting orbit** (high eccentricity)

### Rocket Settings for Success

- Use **Lead strategy** for higher hit rate
- Default values work well
- Adjust **v0** to show different trajectories

### Visual Effects

- Let rocket animation complete
- Show explosion particle effect
- Display hit/miss banner clearly

### Common Demo Mistakes

- ❌ Don't forget to click Play!
- ❌ Don't launch while paused
- ❌ Don't skip the risk color explanation
- ❌ Don't forget to show speed controls

---

## 🎬 Opening Line

> "Welcome to Meteor Madness! This is a real-time 3D visualization system for tracking near-Earth meteors and simulating rocket interception missions. Let me show you how we can protect Earth from asteroid impacts."

---

## 🎉 Closing Line

> "As you can see, we've built a production-ready system that combines NASA's orbital data with interactive 3D visualization. It's ready for mission control!"

---

## 📋 Demo Checklist

Before presenting:

- [ ] Backend is running (`http://localhost:8080/health`)
- [ ] Frontend is loaded (`http://localhost:3000`)
- [ ] No console errors
- [ ] Earth and stars are visible
- [ ] Sidebar shows meteors
- [ ] Selected a good demo meteor
- [ ] Tested rocket launch once

---

## 🐛 Quick Fixes

### If meteor doesn't animate

→ Click **▶ Play** button

### If rocket launch fails

→ Check backend is running
→ Verify meteor is selected
→ Try again with default parameters

### If 3D scene is black

→ Refresh page
→ Check browser console

---

## 🎨 Screenshot Opportunities

1. **Full scene** - Earth + orbit + meteor
2. **Sidebar** - Risk colors visible
3. **HUD** - Meteor details displayed
4. **Hit result** - Explosion + green banner
5. **Miss result** - Red marker + distance

---

## ⏱️ Backup 2-Minute Version

If time is short:

1. Show scene (10s)
2. Select red meteor (10s)
3. Click Play at 60x speed (20s)
4. Launch rocket (30s)
5. Show result (30s)
6. Explain tech stack (20s)

---

**Good luck with your demo! 🚀🌟**
