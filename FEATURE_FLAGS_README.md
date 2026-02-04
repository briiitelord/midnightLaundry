# Feature Flags - Media Playback

This document explains the feature flags controlling media playback behavior on the site.

## Location
`src/config/featureFlags.ts`

## Available Flags

### `USE_VIDEO_PLAYER_COMPONENT`
**Default:** `true`  
**Purpose:** Controls whether to use the custom VideoPlayer component for direct video files

**When `true`:**
- Direct video files (`.mp4`, `.webm` from Supabase) use the custom VideoPlayer component
- Enhanced UI with custom controls, fullscreen support, and better styling
- Guaranteed no autoplay, no loop behavior
- Click-to-play overlay
- Hover-to-show controls

**When `false`:**
- Falls back to basic HTML5 `<video>` element with native browser controls
- Simpler but less polished UI
- Still maintains no autoplay/loop restrictions

**Rollback Instructions:**
```typescript
// In src/config/featureFlags.ts
USE_VIDEO_PLAYER_COMPONENT: false,  // Change to false to rollback
```

---

### `USE_ENHANCED_EMBED_HANDLING`
**Default:** `true`  
**Purpose:** Controls whether to use enhanced logic for detecting and handling embed URLs vs direct files

**When `true`:**
- Intelligently detects if an `embed_url` is a real embed player (SoundCloud, Spotify, etc.) or a direct file
- Only renders iframes for legitimate embed players
- Direct files in `embed_url` are ignored (uses `file_url` instead with MediaPlayer)
- Adds comprehensive autoplay prevention parameters to embed URLs

**When `false`:**
- Simpler logic without embed detection
- All audio sources use MediaPlayer component
- No iframe rendering (may break legitimate embeds)

**Rollback Instructions:**
```typescript
// In src/config/featureFlags.ts
USE_ENHANCED_EMBED_HANDLING: false,  // Change to false to rollback
```

---

## How to Rollback

If issues occur with the new media player logic:

1. Open `src/config/featureFlags.ts`
2. Set the problematic flag to `false`
3. Save the file
4. Rebuild: `npm run build`
5. Deploy the updated build

## Testing

To test each mode:

1. **Test with flags enabled (current state):**
   ```typescript
   USE_VIDEO_PLAYER_COMPONENT: true,
   USE_ENHANCED_EMBED_HANDLING: true,
   ```

2. **Test VideoPlayer fallback:**
   ```typescript
   USE_VIDEO_PLAYER_COMPONENT: false,  // Disable custom player
   USE_ENHANCED_EMBED_HANDLING: true,
   ```

3. **Test embed handling fallback:**
   ```typescript
   USE_VIDEO_PLAYER_COMPONENT: true,
   USE_ENHANCED_EMBED_HANDLING: false,  // Disable embed detection
   ```

4. **Test full rollback:**
   ```typescript
   USE_VIDEO_PLAYER_COMPONENT: false,
   USE_ENHANCED_EMBED_HANDLING: false,
   ```

## What Was Changed

### New Components
- **VideoPlayer** (`src/components/widgets/VideoPlayer.tsx`)
  - Custom video player with controls overlay
  - No autoplay, no loop enforcement
  - Fullscreen support
  - Volume controls
  - Progress bar

### Modified Components
- **VideoSection** (`src/components/sections/VideoSection.tsx`)
  - Uses VideoPlayer when flag is enabled
  - Falls back to basic HTML5 video when disabled

- **MusicSection** (`src/components/sections/MusicSection.tsx`)
  - Enhanced embed detection when flag is enabled
  - Simple MediaPlayer rendering when disabled

### Configuration Files
- **featureFlags.ts** (`src/config/featureFlags.ts`)
  - Central configuration for feature toggles

## Monitoring

After deployment, monitor for:
- Videos autoplaying (should not happen)
- Videos looping (should not happen)
- Embed players not loading (check if embed URL is correct)
- Direct video files not playing (check if file URL is accessible)
- Browser console errors related to media playback

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify the video/audio file URL is accessible
3. Try toggling the feature flags
4. Check network tab for failed media requests
