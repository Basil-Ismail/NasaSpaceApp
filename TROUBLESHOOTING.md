# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## 🚫 Installation Issues

### Issue: `npm install` fails

**Symptoms:** Errors during package installation

**Solutions:**

```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and lock file
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install

# 4. If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

### Issue: TypeScript errors everywhere

**Symptoms:** Red squiggles in VS Code, compilation errors

**Solutions:**

- ✅ Wait for `npm install` to complete
- ✅ Restart VS Code (`Ctrl+Shift+P` → "Reload Window")
- ✅ Check `node_modules` folder exists
- ✅ Run `npm install` again if needed

---

## 🌐 Backend Connection Issues

### Issue: "Failed to fetch meteors"

**Symptoms:** Empty sidebar, error message

**Solutions:**

```bash
# 1. Check backend is running
curl http://localhost:8080/health

# 2. Verify .env.local configuration
cat .env.local
# Should show: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 3. Check CORS on backend
# Backend must allow requests from http://localhost:3000

# 4. Test endpoint directly
curl http://localhost:8080/meteors
```

### Issue: WebSocket won't connect

**Symptoms:** Meteor doesn't animate, no live updates

**Solutions:**

1. **Check backend WebSocket endpoint:**

   ```bash
   # Test with wscat (install: npm install -g wscat)
   wscat -c "ws://localhost:8080/ws/live?meteorId=test"
   ```

2. **Verify WS URL in .env.local:**

   ```env
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   # NOT wss:// (unless using HTTPS)
   ```

3. **Check browser console for WebSocket errors**

4. **Ensure meteor is selected and Play is clicked**

---

## 🎨 3D Scene Issues

### Issue: Black screen / No 3D scene

**Symptoms:** Earth and stars don't appear

**Solutions:**

1. **Check browser compatibility:**
   - Use Chrome, Firefox, or Safari
   - WebGL must be supported
   - Test: Visit https://get.webgl.org/

2. **Check console for Three.js errors:**
   - Open DevTools (F12)
   - Look for red errors

3. **Try hard refresh:**

   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

4. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data

### Issue: Earth texture missing (blue sphere)

**Symptoms:** Solid blue Earth instead of textured

**Solutions:**

- This is **normal** if texture file not added
- To add texture:
  1. Download from https://visibleearth.nasa.gov/
  2. Save as `public/textures/earth_daymap.jpg`
  3. Refresh page

### Issue: Performance is slow / choppy

**Symptoms:** Low FPS, stuttering animation

**Solutions:**

1. **Close other browser tabs**
2. **Reduce scene complexity:**
   - Select meteors with shorter trajectories
   - Use lower speed (1x instead of 60x)
3. **Check GPU usage:**
   - Open Task Manager / Activity Monitor
   - Ensure GPU is being used
4. **Update graphics drivers**

---

## 🎮 Control Issues

### Issue: Play button doesn't work

**Symptoms:** Clicking Play does nothing

**Solutions:**

1. **Ensure meteor is selected:**
   - Click a meteor in sidebar first
2. **Check browser console for errors**
3. **Verify backend is running**
4. **Try refreshing page**

### Issue: Meteor doesn't animate

**Symptoms:** Meteor stays still after clicking Play

**Solutions:**

1. **Check Play button is active** (should say "Pause")
2. **Verify WebSocket is connected:**
   - Open DevTools → Network → WS tab
   - Should see active connection
3. **Check backend is sending frames:**
   - Look for WebSocket messages
4. **Try different meteor**

### Issue: Rocket launch fails

**Symptoms:** Error message or no rocket appears

**Solutions:**

1. **Verify meteor is selected**
2. **Check backend simulate endpoint:**
   ```bash
   curl -X POST http://localhost:8080/simulate \
     -H "Content-Type: application/json" \
     -d '{"meteorId":"test","launchTimeIso":"2025-10-03T12:00:00Z","rocket":{"v0_mps":12000,"burnSec":60,"dv_mps":3000,"strategy":"lead"}}'
   ```
3. **Try default parameters** (don't modify)
4. **Check error banner message** (top left)

---

## 🖥️ Development Issues

### Issue: Hot reload not working

**Symptoms:** Changes don't appear without manual refresh

**Solutions:**

```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clear .next folder
rm -rf .next

# 3. Restart
npm run dev
```

### Issue: Port 3000 already in use

**Symptoms:** "Port 3000 is already in use"

**Solutions:**

```bash
# Option 1: Kill process on port 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
PORT=3001 npm run dev
```

### Issue: Build fails

**Symptoms:** `npm run build` errors

**Solutions:**

1. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```
2. **Fix linting issues:**
   ```bash
   npm run lint -- --fix
   ```
3. **Clear cache and rebuild:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

## 🐛 Runtime Errors

### Issue: "Cannot find module" errors

**Symptoms:** Import errors in console

**Solutions:**

1. **Ensure all files are created**
2. **Check file paths** (case-sensitive)
3. **Verify imports use correct aliases:**

   ```typescript
   // Correct:
   import { useSimStore } from '@/state/useSimStore';

   // Wrong:
   import { useSimStore } from './state/useSimStore';
   ```

### Issue: Zustand store errors

**Symptoms:** "Cannot read property of undefined"

**Solutions:**

- Check store selectors are correct:

  ```typescript
  // Correct:
  const playing = useSimStore((state) => state.playing);

  // Wrong:
  const playing = useSimStore((state) => state.play);
  ```

### Issue: WebSocket disconnects repeatedly

**Symptoms:** Connection drops every few seconds

**Solutions:**

1. **Check backend WebSocket implementation**
2. **Verify backend isn't timing out idle connections**
3. **Check network stability**
4. **Look for backend errors/restarts**

---

## 📱 Browser-Specific Issues

### Chrome

- **Issue:** WebGL context lost
- **Fix:** Restart browser, update to latest version

### Firefox

- **Issue:** Slower performance
- **Fix:** Enable hardware acceleration in settings

### Safari

- **Issue:** WebSocket connection issues
- **Fix:** Check Safari → Develop → WebSockets enabled

---

## 🔍 Debugging Tips

### Enable Verbose Logging

Add to `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

### Check WebSocket Frames

```javascript
// In browser console:
const ws = new WebSocket('ws://localhost:8080/ws/live?meteorId=test');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

### Monitor API Calls

- Open DevTools → Network tab
- Filter by XHR/Fetch
- Check request/response details

### Check Zustand State

Install React DevTools:

- Chrome: React Developer Tools extension
- View component state in real-time

---

## 📞 Getting Help

If issues persist:

1. **Check the main README.md**
2. **Review SETUP.md for installation steps**
3. **Look at PROJECT_SUMMARY.md for architecture details**
4. **Open browser console and copy error messages**
5. **Check backend logs for API/WebSocket errors**

---

## ✅ Health Check Checklist

Run through this checklist to verify everything works:

- [ ] `npm run dev` starts without errors
- [ ] Page loads at http://localhost:3000
- [ ] Earth and stars visible in 3D scene
- [ ] Sidebar shows list of meteors
- [ ] Can select a meteor
- [ ] Orbit path appears
- [ ] Play button works
- [ ] Meteor animates along orbit
- [ ] Speed controls work (1x, 10x, 60x)
- [ ] Rocket launch form appears
- [ ] Can launch rocket
- [ ] Hit/miss result displays
- [ ] No console errors

---

**Still stuck? Create an issue on GitHub with:**

- Error message (full text)
- Browser and OS version
- Steps to reproduce
- Screenshots if applicable

Good luck! 🚀
