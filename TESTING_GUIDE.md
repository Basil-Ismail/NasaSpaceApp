# Testing Guide - New Features

## 🧪 Quick Test Checklist

### Before You Start

✅ Dev server running at http://localhost:3000
✅ `.env.local` has `NEXT_PUBLIC_USE_DUMMY_DATA=true`
✅ No backend required for this test

---

## Test 1: Multiple Meteors Display ☄️☄️☄️

### Steps:

1. Open http://localhost:3000
2. Look at the sidebar on the left

### Expected Results:

✅ See "Meteors" header with a blue badge showing "20"
✅ List of 20 meteors with names (Apophis, Bennu, Ryugu, etc.)
✅ Each meteor shows:

- Name
- MOID value in AU
- V_rel (velocity) in km/s
- Risk score (0-1)
  ✅ Color-coded risk dots: 🔴 Red (high) → 🟡 Yellow (medium) → 🟢 Green (low)

### What You Should See:

```
╔════════════════════════╗
║ Meteors            [20]║
║                        ║
║ ┌────────────────────┐ ║
║ │ Apophis         🔴 │ ║
║ │ MOID: 0.0001 AU    │ ║
║ │ V_rel: 22.5 km/s   │ ║
║ │ Risk: 0.89         │ ║
║ └────────────────────┘ ║
║ ┌────────────────────┐ ║
║ │ Bennu           🟡 │ ║
║ │ MOID: 0.0123 AU    │ ║
║ └────────────────────┘ ║
║ ... (18 more meteors)  ║
╚════════════════════════╝
```

---

## Test 2: Camera View Switching 📹

### Steps:

1. Click on "Apophis" (first meteor) in sidebar
2. Look at the bottom control panel
3. Find the "View:" section with two buttons
4. Click "☄️ Meteor" button
5. Wait 2-3 seconds
6. Click "🌍 Earth" button

### Expected Results:

✅ **Earth View (default)**:

- Wide angle showing Earth and meteor orbits
- Camera positioned at (50, 30, 50)

✅ **Meteor View**:

- Camera smoothly moves to follow Apophis
- Meteor stays centered in view
- Camera tracks meteor movement
- Offset of (5, 3, 5) from meteor

✅ **Smooth transitions**:

- No jarring jumps
- Smooth interpolation over ~2 seconds

✅ **Button states**:

- Active view button highlighted in blue
- Meteor button disabled when no meteor selected

---

## Test 3: Playback Controls ⏯️

### Steps:

1. Select any meteor from sidebar
2. Click "▶ Play" button
3. Observe meteor rotation
4. Click "⏸ Pause" button
5. Observe meteor stops
6. Click "▶ Play" again
7. Try different speeds: 1x → 10x → 60x

### Expected Results:

✅ **Play State**:

- Meteor rotates on X and Y axes
- Glow pulses smoothly
- Time advances in HUD

✅ **Pause State**:

- Meteor rotation STOPS completely
- Glow pulsing STOPS
- Time in HUD freezes

✅ **Speed Controls**:

- 1x: Normal rotation speed
- 10x: 10 times faster rotation
- 60x: 60 times faster rotation
- Active speed button highlighted in blue

### Visual Verification:

```
When Paused:
☄️ ← Frozen (no rotation)
🔵 ← Static glow (no pulse)

When Playing at 10x:
☄️ ← Fast rotation
🔵 ← Fast pulsing glow
```

---

## Test 4: Rocket Launch Animation 🚀

### Steps:

1. Select "Apophis" from sidebar
2. Click "▶ Play" to start simulation
3. Scroll down in the control panel
4. Find the rocket parameters section
5. Keep default values or adjust:
   - v0_mps: 12000
   - burnSec: 60
   - dv_mps: 3000
   - strategy: 'lead'
6. Click "Launch Rocket" button
7. Watch the 3D scene

### Expected Results:

✅ **Launch Animation** (3 seconds):

- Rocket starts from Earth center
- Smooth curved path to meteor
- Rocket orients towards travel direction
- Engine glow visible at back
- Outer glow effect around rocket body

✅ **Visual Effects**:

- Cyan/turquoise rocket color
- Orange engine exhaust
- Pulsing engine glow (fast pulse)
- Pulsing outer glow (slow pulse)

✅ **End State**:

- Rocket reaches meteor position
- Shows "✓ HIT" or "✗ MISS" marker
- Explosion particles on hit

### Timeline:

```
t=0.0s: 🌍 Rocket at Earth
t=0.5s: 🚀 25% to target
t=1.0s: 🚀 50% to target (smooth easing)
t=1.5s: 🚀 75% to target
t=2.0s: 🚀 90% to target
t=3.0s: ☄️ Reaches meteor position
```

---

## Test 5: Multiple Meteor Selection 🎯

### Steps:

1. Click "Apophis" in sidebar
2. Wait 1 second
3. Click "Bennu" in sidebar
4. Wait 1 second
5. Click "Ryugu" in sidebar
6. Repeat with 5-6 different meteors

### Expected Results:

✅ Each meteor selection:

- Highlights selected meteor in blue
- Shows its orbit path
- Updates HUD info
- Resets rocket state

✅ No lag or freezing
✅ Smooth orbit path transitions
✅ Previous meteor orbit disappears
✅ New meteor orbit appears

---

## 🐛 Common Issues & Solutions

### Issue: "Only seeing 1 meteor"

**Solution**: Check `.env.local` has `NEXT_PUBLIC_USE_DUMMY_DATA=true`

### Issue: "Meteor view button disabled"

**Solution**: Select a meteor from sidebar first

### Issue: "Pause doesn't stop meteor"

**Solution**: Refresh page, this was fixed in latest code

### Issue: "Rocket doesn't animate"

**Solution**:

1. Make sure "Play" is active
2. Select a meteor first
3. Check console for errors

### Issue: "Camera jumps around"

**Solution**: Avoid clicking both Earth and Meteor buttons rapidly, allow 2s transition

---

## ✅ Success Criteria

**All tests pass if**:

- ✅ 20 meteors visible in sidebar
- ✅ Can switch between Earth/Meteor camera views smoothly
- ✅ Pause stops all meteor rotation and glow
- ✅ Speed (1x/10x/60x) scales rotation accordingly
- ✅ Rocket animates from Earth to meteor in 3 seconds
- ✅ Can select different meteors without crashes

---

## 📊 Performance Check

### FPS Test:

1. Open browser DevTools (F12)
2. Go to "Performance" or "Rendering" tab
3. Enable "FPS meter"
4. Watch while viewing all 20 meteors

**Target**: 60 FPS (or close)
**Acceptable**: 45+ FPS
**If below 30 FPS**: Check GPU acceleration enabled

### Memory Test:

1. Open DevTools → Memory tab
2. Take heap snapshot
3. Look for "Detached DOM nodes"

**Normal**: <50MB for scene data
**Warning**: >200MB may indicate leak

---

## 🎬 Demo Recording Checklist

If recording for presentation:

1. ✅ Start with Earth view showing all 20 meteors
2. ✅ Pan camera to show orbit complexity
3. ✅ Select high-risk meteor (Apophis)
4. ✅ Switch to Meteor view
5. ✅ Pause and show frozen state
6. ✅ Resume with 10x speed
7. ✅ Launch rocket with animation
8. ✅ Switch back to Earth view
9. ✅ Select 3-4 different meteors rapidly
10. ✅ Show sidebar with 20 meteor count

---

**Happy Testing! 🚀☄️🌍**

Report any issues or unexpected behavior!
