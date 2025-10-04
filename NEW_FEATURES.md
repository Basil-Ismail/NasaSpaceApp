# New Features Guide

## Recent Enhancements

### 1. 🚀 Rocket Launch Animation

The rocket now animates from Earth to the meteor target with a smooth 3-second launch sequence:

- Launches from Earth's center (0,0,0)
- Smooth easing animation to target meteor
- Engine glow effects during flight
- Realistic orientation towards travel direction

### 2. 📹 Multiple Camera Views

Switch between two camera perspectives:

- **🌍 Earth View**: Wide angle showing Earth and all orbiting meteors (default)
- **☄️ Meteor View**: Follow mode that tracks the selected meteor

Toggle views using the "View" buttons in the control panel.

### 3. ☄️ Multiple Meteors Support (Up to 20)

The application now handles multiple meteors simultaneously:

- Display up to 20 meteors in the sidebar
- Each meteor has independent orbit and movement
- Color-coded risk indicators for each meteor
- Dummy data generator for testing without backend

### 4. ⏯️ Fixed Playback Controls

Speed and pause controls now properly affect meteor animation:

- **Pause (⏸)**: Stops all meteor rotation and movement
- **Speed (1x/10x/60x)**: Scales meteor rotation speed accordingly
- Smooth time advancement based on selected speed

## Configuration

### Environment Variables (.env.local)

```bash
# Use dummy data for testing (20 meteors without backend)
NEXT_PUBLIC_USE_DUMMY_DATA=true

# API endpoint (for when backend is ready)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# WebSocket URL for live streaming
NEXT_PUBLIC_WS_URL=ws://localhost:8080/stream
```

### Dummy Data Mode

When `NEXT_PUBLIC_USE_DUMMY_DATA=true`:

- Generates 20 realistic meteor trajectories
- Each meteor has unique orbital parameters
- Sorted by risk score (highest risk first)
- Falls back automatically if API is unavailable

### Switching to Real Backend

When your backend is ready:

1. Set `NEXT_PUBLIC_USE_DUMMY_DATA=false` in `.env.local`
2. Ensure backend is running at `http://localhost:8080`
3. The app will automatically switch to real data

## Usage

### Selecting and Viewing Meteors

1. **Select a meteor** from the sidebar (up to 20 available)
2. **Switch camera view** using View buttons:
   - Click "🌍 Earth" for wide angle
   - Click "☄️ Meteor" to follow selected meteor
3. **Control playback**:
   - Click "▶ Play" to start animation
   - Click "⏸ Pause" to freeze
   - Select speed (1x, 10x, 60x) to control time

### Launching Rockets

1. Select a target meteor
2. Configure rocket parameters in the control panel
3. Click "Launch Rocket" to see animated launch
4. Watch the rocket travel from Earth to intercept

## Technical Details

### Rocket Animation

- Launch duration: 3 seconds
- Easing: Smooth ease-in-out cubic
- Start position: Earth center (0, 0, 0)
- End position: Current meteor position in scene coordinates
- Visual effects: Engine glow, outer glow, thrust particles

### Camera Controller

- Smooth interpolation between positions (5% lerp rate)
- Earth view: Position (50, 30, 50) looking at origin
- Meteor view: Follows selected meteor with offset (5, 3, 5)
- Works alongside OrbitControls for manual adjustment

### Performance

- Each meteor: ~2000 polygons (dodecahedron + glow)
- Trail particles: 20 per selected meteor
- Total with 20 meteors: ~40K polygons (well optimized)
- Frame rate: 60 FPS on modern hardware
