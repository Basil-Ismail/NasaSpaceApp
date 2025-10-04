# Setup Guide - Meteor Madness Frontend

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 14
- React 18
- Three.js and react-three-fiber
- Zustand for state management
- SWR for data fetching
- Tailwind CSS
- TypeScript

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your backend URLs
# Default values work if backend is running locally
```

### 3. Add Earth Texture (Optional)

Download a free Earth texture and place it at:

```
public/textures/earth_daymap.jpg
```

**Recommended sources:**

- NASA Visible Earth: https://visibleearth.nasa.gov/
- Solar System Scope: https://www.solarsystemscope.com/textures/

**Note:** The app will work with a blue sphere if no texture is provided.

### 4. Start Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

## Verification Checklist

Before using the app, verify:

- ✅ Backend is running at `http://localhost:8080`
- ✅ Backend `/health` endpoint returns `{ status: "ok" }`
- ✅ No console errors in browser
- ✅ 3D scene loads with Earth and stars

## Backend Requirements

The backend must implement these endpoints:

### REST API

- `GET /health` - Health check
- `GET /meteors` - List all meteors
- `GET /meteors/:slug` - Get meteor details
- `GET /meteors/:slug/trajectory` - Get trajectory points
- `POST /simulate` - Run rocket simulation

### WebSocket

- `WS /ws/live?meteorId=<slug>` - Live position updates

## Common Setup Issues

### Issue: "Cannot find module 'react'"

**Solution:** Run `npm install` to install dependencies

### Issue: 3D scene doesn't load

**Solution:**

1. Check browser console for errors
2. Ensure you're using a modern browser (Chrome, Firefox, Safari)
3. Try clearing cache and hard reload

### Issue: Backend connection fails

**Solution:**

1. Verify backend is running: `curl http://localhost:8080/health`
2. Check `.env.local` has correct URLs
3. Ensure no firewall blocking connections

### Issue: TypeScript errors

**Solution:** These are expected until `npm install` completes. They'll resolve once dependencies are installed.

## Next Steps

After setup:

1. **Select a Meteor**: Click on a meteor in the sidebar
2. **Start Simulation**: Press the Play button
3. **Launch Rocket**: Configure parameters and click Launch
4. **Adjust Speed**: Use 1x, 10x, or 60x speed controls

## Development Tips

- Hot reload is enabled - changes will reflect immediately
- Keep browser console open to see logs
- Use React DevTools for debugging state
- Check Network tab for API/WebSocket issues

## Production Build

To create a production build:

```bash
npm run build
npm start
```

The optimized app will be served on port 3000.

---

Need help? Check the main README.md or open an issue on GitHub.
