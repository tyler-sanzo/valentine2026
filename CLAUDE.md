# CLAUDE.md - Valentine's Day 2026 Website

Technical documentation for Claude Code when working with this Valentine's Day interactive website project.

## Project Overview

**Type**: Minimal interactive single-page website
**Purpose**: Valentine's Day gift with animated starfield, parallax photos, and progressive storytelling
**Deployment**: GitHub Pages
**Access Method**: QR code for mobile viewing

## Architecture

### Design Philosophy

**Minimal & Immersive:**
- Single-page design with no traditional sections
- Full-screen canvas background
- Progressive reveal on user interaction
- Mobile-first responsive design

**Technology Stack:**
- Pure vanilla JavaScript (no frameworks)
- HTML5 Canvas for starfield animation
- CSS3 for parallax effects and transitions
- HTML5 Audio API for background music

**Total Code:** ~514 lines (HTML: 33 + CSS: 215 + JS: 266)

## File Structure

```
v-day-website-2026/
├── index.html                   # Structure (~33 lines)
│   ├── Canvas element for background
│   ├── 3-5 photo layer divs
│   └── Text overlay container
│
├── css/style.css                # Styling (~215 lines)
│   ├── Reset & base styles
│   ├── Canvas positioning (z-index: -1)
│   ├── Photo layer positioning (fixed, different depths)
│   ├── Text overlay (centered, glowing effect)
│   ├── Animations (pulse, drift)
│   └── Responsive breakpoints
│
├── js/script.js                 # Logic (~266 lines)
│   ├── Canvas starfield (lines 1-77)
│   ├── Photo parallax (lines 79-120)
│   ├── Click progression (lines 122-181)
│   ├── Audio management (lines 183-239)
│   └── Image preloading (lines 241-258)
│
├── images/photos/               # User photos (3-5)
│   ├── photo1.jpg              # Layer 1 (top-left, z-index: 3)
│   ├── photo2.jpg              # Layer 2 (top-right, z-index: 2)
│   └── photo3.jpg              # Layer 3 (bottom-left, z-index: 1)
│
└── audio/
    └── background.mp3           # Optional loop-able music
```

## Key Implementation Details

### 1. Canvas Starfield Animation

**Location:** `js/script.js` lines 1-77

**How it works:**
- Creates 500 star objects with random positions
- Each star has: x, y, radius, hue (0/330/340 for reds/pinks), saturation, opacity
- Animation loop uses `requestAnimationFrame` for 60fps
- 1% chance per frame per star to twinkle (random opacity change)
- Dark gradient background (#0a0a0a → #1a0a14)
- Stars drawn with `shadowBlur` for glow effect

**Color palette (line 29):**
```javascript
hue: [0, 330, 340][Math.floor(Math.random() * 3)]
```
- 0 = red
- 330-340 = pink

**Performance:**
- Uses GPU-accelerated canvas rendering
- No object creation in animation loop (mutates existing star array)
- Window resize handler recreates stars for new dimensions

### 2. Photo Parallax System

**Location:** `js/script.js` lines 79-120, `css/style.css` lines 31-87

**Desktop (mouse parallax):**
- Listens to `mousemove` events
- Calculates distance from viewport center
- Each layer moves at different speed based on depth
- Layer 1 (z-index 3) moves fastest (depth = 1.0)
- Layer 3 (z-index 1) moves slowest (depth = 0.33)
- Uses CSS `transform: translate()` for GPU acceleration

**Mobile (auto-drift):**
- CSS `@keyframes drift` animation
- Different duration per layer (8s, 10s, 12s)
- Gentle movement in figure-8 pattern
- Applied via media query (<769px)

**Photo styling:**
- Fixed positioning at different viewport locations
- `opacity: 0` initially (revealed on click progression)
- `background-image` set via CSS
- Box shadow for depth + pink glow
- `will-change: transform` for optimization

### 3. Click Progression System

**Location:** `js/script.js` lines 122-181

**State management:**
- `currentStep`: tracks position in text sequence
- `photoIndex`: tracks which photos have been revealed
- `textSequence`: array of 7 messages (customizable)

**Click handler flow:**
1. User clicks anywhere on `<body>`
2. Current text fades out (`opacity: 0`)
3. After 500ms delay:
   - Text content updates to next in sequence
   - Text fades in (`opacity: 1`)
   - Next photo layer revealed (if available)
4. Progress counter increments
5. Hint text updates for final steps

**Keyboard support:**
- Spacebar also triggers progression (desktop)

### 4. Audio System

**Location:** `js/script.js` lines 183-239

**Auto-play handling:**
- Browser auto-play policies require user interaction
- Audio initialized but not played on page load
- First click triggers `bgMusic.play()`
- 2-second volume fade-in (0 → 0.3)
- Loops continuously via `loop: true`

**Graceful degradation:**
- Try/catch blocks prevent errors if audio file missing
- Silent console.log if autoplay blocked
- Site works fully without audio

### 5. Responsive Design

**Breakpoints:**
- Desktop: >768px (mouse parallax)
- Tablet/Mobile: ≤768px (drift animation)
- Small mobile: ≤480px (smaller photos)
- Landscape mobile: height ≤600px (adjusted proportions)

**Mobile optimizations:**
- Larger photos (85% vs 70% width)
- Smaller text (clamp formula adjusts)
- CSS animations instead of JS parallax
- Touch-optimized (full-screen tap target)

## Common Modifications

### Add 4th or 5th Photo

**index.html (line 20):**
```html
<div class="photo-layer layer-4" data-photo="4"></div>
<div class="photo-layer layer-5" data-photo="5"></div>
```

**css/style.css (after line 70):**
```css
.layer-4 {
    top: 20%;
    right: 8%;
    z-index: 2;
    background-image: url('../images/photos/photo4.jpg');
}
```

**No JS changes needed** - script auto-detects layer count.

### Customize Text Sequence

**js/script.js (line 126):**
```javascript
const textSequence = [
    "Your message 1",
    "Your message 2",
    // ... add as many as you want
    "Final message ❤️"
];
```

### Change Star Colors

**js/script.js (line 29):**
```javascript
// Blue/purple palette
hue: [200, 240, 270][Math.floor(Math.random() * 3)]

// Warm palette (orange/red)
hue: [0, 15, 30][Math.floor(Math.random() * 3)]
```

### Adjust Parallax Sensitivity

**js/script.js (line 106):**
```javascript
const xMove = (e.clientX - centerX) / 25; // Increase divisor = less movement
```

## Asset Requirements

### Photos
- **Format:** JPEG or PNG
- **Count:** 3-5 photos
- **Size:** <500KB each (use TinyPNG)
- **Dimensions:** Max 1200px width
- **Naming:** photo1.jpg, photo2.jpg, photo3.jpg, etc.
- **Location:** `images/photos/`

### Audio (Optional)
- **Format:** MP3
- **Duration:** 30-90 seconds (loop-able)
- **Bitrate:** 128kbps
- **Size:** <5MB
- **Naming:** background.mp3
- **Location:** `audio/`

## Deployment Workflow

### GitHub Pages Setup

```bash
# Initialize repository
cd v-day-website-2026
git init

# Stage and commit
git add .
git commit -m "Initial commit - Valentine's Day website"

# Create GitHub repo, then:
git remote add origin https://github.com/USERNAME/valentine-2026.git
git branch -M main
git push -u origin main

# Enable Pages: Settings → Pages → Source: main/(root)
```

### QR Code Generation

1. Get live URL: `https://USERNAME.github.io/valentine-2026/`
2. Generate QR code at qr-code-generator.com
3. Test scan with mobile device
4. Print or share QR code

## Testing Checklist

**Desktop:**
- [ ] Starfield animates smoothly (60fps)
- [ ] Mouse movement creates parallax effect
- [ ] Clicking progresses text and reveals photos
- [ ] Audio starts on first click (if file present)
- [ ] No console errors

**Mobile:**
- [ ] Starfield visible and smooth
- [ ] Photos drift gently (CSS animation)
- [ ] Tapping progresses text and reveals photos
- [ ] Layout fits screen (no scrolling)
- [ ] Touch targets large enough
- [ ] QR code redirects correctly

**Cross-browser:**
- [ ] Chrome (desktop & Android)
- [ ] Safari (desktop & iOS)
- [ ] Firefox
- [ ] Edge

## Performance Targets

- **Canvas FPS:** 60fps constant
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <2.5s
- **Total Page Size:** <10MB with photos
- **Lighthouse Score:** 90+ performance

## Browser Compatibility

**Minimum requirements:**
- Canvas API (IE9+)
- requestAnimationFrame (IE10+)
- CSS transforms (IE9+)
- HTML5 Audio (IE9+)

**Tested & supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Photos not showing
- Check file paths in CSS (lines 55, 62, 69)
- Ensure files named exactly: photo1.jpg, photo2.jpg, etc.
- Check browser console for 404 errors

### Audio not playing
- Audio requires user interaction (first click)
- Check file exists at `audio/background.mp3`
- Try different browser (Safari can be restrictive)
- Check browser console for autoplay errors

### Parallax not working
- Desktop: Check mouse events in console
- Mobile: Check if CSS drift animation applied
- Verify media query breakpoint (768px)

### Poor performance
- Reduce star count (line 12): `const starCount = 300;`
- Optimize photos (reduce file size)
- Check for console errors blocking rendering

## Design Decisions

**Why Canvas over CSS for background?**
- More control over particle system
- Better performance for 500+ animated elements
- Allows complex effects (twinkling, glow)

**Why CSS for photos instead of Canvas?**
- Easier to position and style
- GPU-accelerated transforms
- Simpler parallax implementation
- Better responsive behavior

**Why vanilla JS over framework?**
- No dependencies (faster load)
- Simpler codebase (easier to customize)
- Better for learning
- Overkill for single-page interactive

**Why GitHub Pages?**
- Free hosting
- HTTPS included
- No backend needed
- Easy deployment

## Future Enhancements (Optional)

- [ ] Add subtle particle trail to mouse cursor
- [ ] Implement swipe gestures for mobile progression
- [ ] Add photo captions that appear with each reveal
- [ ] Create "Restart" button after completion
- [ ] Add confetti burst on final click
- [ ] Implement photo zoom on hover/tap
- [ ] Add animated hearts floating up periodically
- [ ] Create date counter ("Together for X days")

## Notes for Claude Code

**When editing this project:**
- Prioritize mobile experience (primary use case)
- Test canvas performance after changes
- Maintain minimal aesthetic (resist adding UI chrome)
- Keep total code under 600 lines
- Preserve smooth 60fps animation
- Ensure all changes work without JavaScript (graceful degradation)
- Test on actual mobile device before deploying

**File reading order for understanding:**
1. index.html (structure)
2. css/style.css (visual design)
3. js/script.js (interactivity)
4. This file (architecture)

**Common user requests:**
- "Add more photos" → Edit HTML + CSS (uncomment layers 4-5)
- "Change text" → Edit textSequence array (js line 126)
- "Different colors" → Edit star hue values (js line 29)
- "Faster/slower" → Adjust animation speeds (css drift, js twinkling)
