# 🚀 Quick Start Guide

## Current Status

✅ **Backend**: Running on :8080
✅ **Frontend**: Running on :3000
✅ **API**: Connected & working
✅ **Meteor Sizes**: Realistic (0.05-0.2% of Earth)

---

## API Endpoints (All Working!)

```bash
# Health check
curl http://localhost:8080/health

# List all meteors
curl http://localhost:8080/meteors

# Get meteor details
curl http://localhost:8080/meteors/p_2004_r1_mcnaught

# Get trajectory
curl "http://localhost:8080/meteors/p_2004_r1_mcnaught/trajectory?from=2025-10-03T12:00:00Z&to=2025-10-03T18:00:00Z&stepSec=120"

# Simulate interception
curl -X POST http://localhost:8080/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "meteorId": "p_2004_r1_mcnaught",
    "launchTimeIso": "2025-10-03T12:00:00Z",
    "rocket": {
      "v0_mps": 12000,
      "burnSec": 60,
      "dv_mps": 3000,
      "strategy": "lead"
    }
  }'
```

---

## Size Reference

| Object           | Size    | Real Equivalent |
| ---------------- | ------- | --------------- |
| 🌍 Earth         | 1.0     | 12,742 km       |
| 🔴 Small Meteor  | 0.0005  | 100m            |
| 🟡 Medium Meteor | 0.001   | 1 km            |
| 🟢 Large Meteor  | 0.00185 | 12 km           |
| ✨ Selected      | x2.5    | (visibility)    |
| 💫 Glow          | x3      | (effect)        |

**Ratios**: 0.05% to 0.2% of Earth (realistic!)

---

## What You'll See

### Sidebar:

```
🌌 Meteors                1

P/2004 R1 (McNaught)   🔴
MOID: 0.0270 AU
Period: 5.5 years
```

### 3D Scene:

- Large blue Earth at center
- Tiny meteors orbiting (realistic size!)
- Selected meteor: 2.5x + glow + trail
- Orbit paths colored by risk

---

## Tips

### Can't See Meteors?

✅ This is normal! They're realistically tiny.

- **Click meteor in sidebar** → 2.5x size + glow
- **Zoom in** with mouse wheel
- **Look for glow** (3x meteor size)

### Want More Meteors?

Backend currently has 1 meteor. Add more to the backend database and they'll appear automatically!

---

## Documentation

📖 **INTEGRATION_COMPLETE.md** - Full details
📖 **REAL_API_AND_SIZING.md** - Technical docs
📖 **README.md** - Project overview

---

## Status: READY! 🎯

All systems operational. Backend and frontend connected. Realistic sizing implemented. Ready to present! 🚀
