# 🔍 Senior Developer & QA Code Review Report

**Date**: October 4, 2025  
**Project**: Meteor Madness Frontend  
**Reviewed By**: Senior Developer & QA  
**Status**: ⚠️ Issues Found - Action Required

---

## 📊 Executive Summary

**Total Issues Found**: 12  
**Critical**: 2 🔴  
**High**: 4 🟠  
**Medium**: 4 🟡  
**Low**: 2 🟢

**Overall Assessment**: The application compiles and runs, but contains TypeScript configuration issues, potential runtime errors, and code quality concerns that should be addressed before production deployment.

---

## 🔴 CRITICAL ISSUES

### 1. **TypeScript Path Resolution Not Working**

**Severity**: CRITICAL 🔴  
**File**: `tsconfig.json`  
**Impact**: TypeScript cannot resolve `@/*` imports, causing 83 type errors

**Problem**:

```typescript
// All these imports fail:
import { useSimStore } from '@/state/useSimStore';
import { useMeteors } from '@/lib/api';
import type { LiveFrame } from '@/types/api';
// Error: Cannot find module '@/types/api' or its corresponding type declarations
```

**Root Cause**: While `tsconfig.json` has path mapping configured, Next.js might need additional configuration or the TypeScript server needs restart.

**Fix**:

```bash
# Option 1: Restart TypeScript server
# In VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Option 2: Verify Next.js config
# Check next.config.js has correct module resolution

# Option 3: Clean build
rm -rf .next node_modules/.cache
npm install
```

**Risk if Not Fixed**:

- TypeScript type checking not working
- No IntelliSense/autocomplete
- Potential runtime errors not caught during development

---

### 2. **Missing Error Handling in API Calls**

**Severity**: CRITICAL 🔴  
**Files**: `src/components/SceneCanvas.tsx`, `src/components/Sidebar.tsx`  
**Impact**: App crashes when backend is unavailable

**Problem**:

```tsx
// SceneCanvas.tsx line 45
meteorsToLoad.map(async (meteor) => {
  try {
    const data = await fetchTrajectory(meteor.slug, { from, to, stepSec: 300 });
    trajectoryMap.set(meteor.slug, data);
  } catch (error) {
    console.error(`Failed to load trajectory for ${meteor.slug}:`, error);
    // ❌ Error logged but not shown to user
    // ❌ App continues with partial data
  }
});
```

**Issues**:

1. No user notification when trajectories fail to load
2. No fallback UI when `useMeteors()` returns error
3. Silent failures lead to confusing blank screens

**Fix Required**:

```tsx
// Add error state and retry mechanism
const [loadError, setLoadError] = useState<string | null>(null);
const [retryCount, setRetryCount] = useState(0);

try {
  const data = await fetchTrajectory(meteor.slug, params);
  trajectoryMap.set(meteor.slug, data);
} catch (error) {
  console.error(`Failed to load trajectory for ${meteor.slug}:`, error);
  setLoadError(`Failed to load trajectory data. ${error.message}`);

  // Retry logic
  if (retryCount < 3) {
    setTimeout(() => {
      setRetryCount(retryCount + 1);
      loadAllTrajectories(); // Retry
    }, 2000);
  }
}

// Show error banner
{
  loadError && <div className="error-banner">⚠️ {loadError}</div>;
}
```

---

## 🟠 HIGH PRIORITY ISSUES

### 3. **Implicit `any` Types in Zustand Selectors**

**Severity**: HIGH 🟠  
**Files**: Multiple components  
**Impact**: Type safety completely bypassed

**Problem**:

```typescript
// MeteorObject.tsx, Sidebar.tsx, Controls.tsx, etc.
const frames = useSimStore((state) => state.frames);
//                           ^^^^^ Parameter 'state' implicitly has an 'any' type
```

**Current Count**: 45+ instances across the codebase

**Fix**:

```typescript
// Option 1: Import SimState type
import { useSimStore, SimState } from '@/state/useSimStore';

const frames = useSimStore((state: SimState) => state.frames);

// Option 2: Configure Zustand with proper typing (recommended)
// In useSimStore.ts:
export const useSimStore = create<SimState>()((set, get) => ({
  // ... implementation
}));

// Then use without explicit typing:
const frames = useSimStore((state) => state.frames); // ✅ Type inferred
```

**Risk if Not Fixed**:

- No type checking in state access
- Typos like `state.fram` won't be caught
- Breaking changes in state structure won't be detected

---

### 4. **Unsafe `parseInt()` Without Radix**

**Severity**: HIGH 🟠  
**File**: `src/components/MeteorObject.tsx` (lines 69, 136)  
**Impact**: Potential parsing errors with octal numbers

**Problem**:

```typescript
const index = parseInt(slug.split('-')[1] || '0') - 1;
//            ^^^^^^^^ Missing radix parameter
```

**Issue**: If slug is `"meteor-08"`, `parseInt("08")` might return `0` in older environments (octal parsing).

**Fix**:

```typescript
const index = parseInt(slug.split('-')[1] || '0', 10) - 1; // ✅ Explicit base 10
```

**Apply to**:

- Line 69: `const index = parseInt(slug.split('-')[1] || '0', 10) - 1;`
- Line 136: `const index = slug ? parseInt(slug.split('-')[1] || '1', 10) : 1;`

---

### 5. **Unsafe Type Assertion with `any`**

**Severity**: HIGH 🟠  
**File**: `src/components/SceneCanvas.tsx`  
**Impact**: Type safety bypassed

**Problem**:

```typescript
// Line 23
const controlsRef = useRef<any>(null);
//                         ^^^ Unsafe any type

// Line 136
{allMeteors?.slice(0, 10).map((meteor: any) => {
//                                      ^^^ Unsafe any type
```

**Fix**:

```typescript
// Import proper type
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const controlsRef = useRef<OrbitControlsImpl>(null);

// For meteors, use proper type:
import type { MeteorListItem } from '@/types/api';

{
  allMeteors?.slice(0, 10).map((meteor: MeteorListItem) => {
    // Now fully typed!
  });
}
```

---

### 6. **No Cleanup for WebSocket Connections**

**Severity**: HIGH 🟠  
**File**: `src/lib/ws.ts`  
**Impact**: Memory leaks, zombie connections

**Problem**:

```typescript
// connectLive() returns disconnect function, but it's not always called
// Components may unmount without cleanup
```

**Fix Required**: Ensure all WebSocket connections are cleaned up in `useEffect`:

```typescript
// In component using WebSocket:
useEffect(() => {
  if (!selectedMeteorSlug) return;

  const disconnect = connectLive({
    meteorId: selectedMeteorSlug,
    onFrame: (frame) => applyFrame(frame),
    onError: (error) => console.error(error),
  });

  // ✅ Cleanup on unmount
  return () => {
    disconnect();
  };
}, [selectedMeteorSlug]);
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 7. **Race Condition in Trajectory Loading**

**Severity**: MEDIUM 🟡  
**File**: `src/components/SceneCanvas.tsx`  
**Impact**: Incorrect trajectory displayed if selection changes quickly

**Problem**:

```typescript
useEffect(() => {
  if (!selectedMeteorSlug) return;

  const loadTrajectory = async () => {
    const data = await fetchTrajectory(selectedMeteorSlug, params);
    setTrajectory(data); // ❌ What if selectedMeteorSlug changed during fetch?
  };

  loadTrajectory();
}, [selectedMeteorSlug]);
```

**Issue**: If user clicks multiple meteors quickly, older requests might overwrite newer ones.

**Fix**:

```typescript
useEffect(() => {
  if (!selectedMeteorSlug) return;

  let cancelled = false; // ✅ Track if effect was cancelled

  const loadTrajectory = async () => {
    try {
      const data = await fetchTrajectory(selectedMeteorSlug, params);
      if (!cancelled) {
        // ✅ Only update if still relevant
        setTrajectory(data);
      }
    } catch (error) {
      if (!cancelled) {
        console.error('Failed to load trajectory:', error);
      }
    }
  };

  loadTrajectory();

  return () => {
    cancelled = true; // ✅ Cancel on cleanup
  };
}, [selectedMeteorSlug]);
```

---

### 8. **Unused Import**

**Severity**: MEDIUM 🟡  
**Files**: `src/lib/api.ts`, `src/components/HUD.tsx`  
**Impact**: Bundle size, code cleanliness

**Problem**:

```typescript
// api.ts line 3
import axios, { AxiosError } from 'axios';
//              ^^^^^^^^^^ Defined but never used

// HUD.tsx line 6
import { formatIsoDate, diffSeconds } from '@/lib/time';
//                      ^^^^^^^^^^^^ Defined but never used
```

**Fix**:

```typescript
// api.ts
import axios from 'axios'; // Remove AxiosError

// HUD.tsx
import { formatIsoDate } from '@/lib/time'; // Remove diffSeconds
```

---

### 9. **No Input Validation in Controls**

**Severity**: MEDIUM 🟡  
**File**: `src/components/Controls.tsx`  
**Impact**: Invalid rocket parameters can crash simulation

**Problem**:

```typescript
// Lines 146, 158, 170
onChange={(e) => setRocketParams({
  ...rocketParams,
  v0_mps: Number(e.target.value) // ❌ No validation!
})}
```

**Issues**:

- `Number("")` returns `0` (valid but wrong)
- `Number("abc")` returns `NaN` (will crash backend)
- No min/max bounds checking
- Negative values allowed

**Fix**:

```typescript
const handleNumberInput = (field: keyof RocketParams, value: string) => {
  const num = parseFloat(value);

  // Validate
  if (isNaN(num) || num < 0) {
    setError(`${field} must be a positive number`);
    return;
  }

  // Field-specific validation
  if (field === 'v0_mps' && (num < 1000 || num > 50000)) {
    setError('Initial velocity must be between 1,000 and 50,000 m/s');
    return;
  }

  if (field === 'burnSec' && (num < 1 || num > 600)) {
    setError('Burn time must be between 1 and 600 seconds');
    return;
  }

  setRocketParams({ ...rocketParams, [field]: num });
  setError(null);
};

// Usage:
<input
  type="number"
  value={rocketParams.v0_mps}
  onChange={(e) => handleNumberInput('v0_mps', e.target.value)}
  min="1000"
  max="50000"
  step="100"
/>
```

---

### 10. **Potential Division by Zero**

**Severity**: MEDIUM 🟡  
**File**: `src/components/MeteorObject.tsx`  
**Impact**: NaN positions, invisible meteors

**Problem**:

```typescript
// Line 70
const orbitSpeed = 0.0005 / (1 + index * 0.05);

// If calculation error makes denominator 0, you get Infinity
// Then: angle = time * Infinity = Infinity
// Result: Math.cos(Infinity) = NaN
```

**Current Risk**: Low (denominator always > 0 with current formula)

**Defensive Fix**:

```typescript
const orbitSpeed = 0.0005 / Math.max(1 + index * 0.05, 0.1); // ✅ Never divide by zero
```

---

## 🟢 LOW PRIORITY ISSUES

### 11. **Hardcoded Magic Numbers**

**Severity**: LOW 🟢  
**Files**: Multiple  
**Impact**: Maintainability

**Problem**: Many magic numbers scattered throughout:

```typescript
const to = addSeconds(from, 6 * 3600); // What is 6? Why 3600?
const orbitRadius = 0.05 + index * 0.01; // Why these specific values?
const size = 0.0005 + (index % 10) * 0.00015; // Why this formula?
```

**Recommendation**: Extract to named constants:

```typescript
// constants.ts
export const SIMULATION = {
  TRAJECTORY_HOURS: 6,
  SECONDS_PER_HOUR: 3600,
  TRAJECTORY_STEP_SECONDS: 300,
  MAX_METEORS_TO_LOAD: 10,
} as const;

export const METEOR_SIZE = {
  BASE: 0.0005,
  INCREMENT: 0.00015,
  VARIATION_MOD: 10,
  SELECTED_MULTIPLIER: 2.5,
  GLOW_MULTIPLIER: 3.0,
} as const;

export const ORBIT = {
  BASE_RADIUS: 0.05,
  RADIUS_INCREMENT: 0.01,
  BASE_SPEED: 0.0005,
  SPEED_FACTOR: 0.05,
} as const;

// Usage:
const to = addSeconds(from, SIMULATION.TRAJECTORY_HOURS * SIMULATION.SECONDS_PER_HOUR);
const baseSize = METEOR_SIZE.BASE + (index % METEOR_SIZE.VARIATION_MOD) * METEOR_SIZE.INCREMENT;
```

---

### 12. **Console Logs in Production Code**

**Severity**: LOW 🟢  
**Files**: Multiple  
**Impact**: Performance, security (information disclosure)

**Problem**:

```typescript
// ws.ts
console.log('[WS] Connected to live stream:', meteorId);
console.error('[WS] Error:', error);

// SceneCanvas.tsx
console.error(`Failed to load trajectory for ${meteor.slug}:`, error);
```

**Fix**: Use proper logging utility:

```typescript
// logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => isDev && console.warn(...args),
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
    // In production, send to error tracking service
    // sentry.captureException(args[0]);
  },
};

// Usage:
logger.info('[WS] Connected:', meteorId);
logger.error('Failed to load trajectory:', error);
```

---

## ⚡ Performance Concerns

### 13. **Excessive Re-renders in MeteorObject**

**File**: `src/components/MeteorObject.tsx`  
**Impact**: Performance degradation with many meteors

**Issue**: Position recalculated on every `currentTimeIso` change for ALL meteors, even non-visible ones.

**Optimization**:

```typescript
// Memoize position with stable dependencies
const position = useMemo(() => {
  // ... calculation
}, [
  frames.length, // Instead of full frames array
  currentTimeIso,
  slug,
  frames[frames.length - 1]?.t_iso, // Only track last frame time
]);
```

---

### 14. **Parallel API Calls Not Optimized**

**File**: `src/components/SceneCanvas.tsx`  
**Impact**: Slow initial load

**Current**:

```typescript
await Promise.all(
  meteorsToLoad.map(async (meteor) => {
    const data = await fetchTrajectory(meteor.slug, params);
    // All 10 requests fire simultaneously
  })
);
```

**Issue**: 10 concurrent requests might overwhelm backend or hit rate limits.

**Optimization**:

```typescript
// Batch requests in groups of 3
const batchSize = 3;
for (let i = 0; i < meteorsToLoad.length; i += batchSize) {
  const batch = meteorsToLoad.slice(i, i + batchSize);
  await Promise.all(
    batch.map(async (meteor) => {
      const data = await fetchTrajectory(meteor.slug, params);
      trajectoryMap.set(meteor.slug, data);
    })
  );
}
```

---

## 🛡️ Security Concerns

### 15. **No Input Sanitization**

**Severity**: MEDIUM  
**File**: `src/lib/ws.ts`  
**Impact**: Potential XSS or injection attacks

**Problem**:

```typescript
const url = `${WS_BASE_URL}/ws/live?meteorId=${encodeURIComponent(meteorId)}`;
```

**Current**: Uses `encodeURIComponent` ✅  
**Additional Recommendation**: Validate `meteorId` format before encoding:

```typescript
// Validate slug format (alphanumeric, hyphens, underscores only)
const VALID_SLUG_REGEX = /^[a-z0-9_-]+$/i;

export function connectLive(options: ConnectLiveOptions): () => void {
  const { meteorId } = options;

  // ✅ Validate before using
  if (!VALID_SLUG_REGEX.test(meteorId)) {
    throw new Error('Invalid meteor ID format');
  }

  const url = `${WS_BASE_URL}/ws/live?meteorId=${encodeURIComponent(meteorId)}`;
  // ...
}
```

---

## 📋 Action Items Summary

### Must Fix Before Production (Critical/High):

1. ✅ Fix TypeScript path resolution - Restart TS server
2. ✅ Add error handling UI for failed API calls
3. ✅ Fix implicit `any` types in Zustand selectors
4. ✅ Add radix parameter to `parseInt()` calls
5. ✅ Replace `any` types with proper interfaces
6. ✅ Add WebSocket cleanup in useEffect

### Should Fix Soon (Medium):

7. ✅ Fix race condition in trajectory loading
8. ✅ Remove unused imports
9. ✅ Add input validation in Controls
10. ✅ Add defensive checks for division by zero

### Nice to Have (Low):

11. ✅ Extract magic numbers to constants
12. ✅ Replace console.log with proper logger
13. ✅ Optimize re-renders in MeteorObject
14. ✅ Batch API calls to avoid overwhelming backend
15. ✅ Add meteor ID format validation

---

## 🎯 Quick Wins (Do First)

These can be fixed in <30 minutes:

```bash
# 1. Remove unused imports
# api.ts line 3: Remove AxiosError
# HUD.tsx line 6: Remove diffSeconds

# 2. Add radix to parseInt
# MeteorObject.tsx lines 69, 136:
parseInt(slug.split('-')[1] || '0', 10)

# 3. Restart TypeScript server
# VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 🏁 Conclusion

**Current State**: Application works but has type safety and error handling gaps.

**Recommendation**: Address Critical and High priority issues before demo/production. The app will run but may crash unexpectedly when backend is unavailable or user provides invalid input.

**Estimated Fix Time**:

- Critical Issues: 2-3 hours
- High Priority: 2-3 hours
- Medium Priority: 3-4 hours
- Low Priority: 2-3 hours
- **Total**: 9-13 hours

**Priority**: Fix items 1-6 immediately (4-6 hours) for stable demo.
