# Valentine's Day 2026 - Minimal Interactive Website

A minimal, immersive Valentine's Day website with animated starfield background, parallax photo effects, and progressive click-through storytelling.

## ✨ Features

- **Animated Starfield Background**: Twinkling stars with romantic pink/red color palette
- **Parallax Photo Layers**: 3-5 photos that move with mouse (desktop) or drift gently (mobile)
- **Progressive Storytelling**: Click/tap to reveal text and photos one at a time
- **Background Music**: Optional loop-able romantic music (starts on first click)
- **Fully Responsive**: Optimized for mobile (QR code access) and desktop
- **Zero Dependencies**: Pure vanilla JavaScript, no libraries required

## 🚀 Quick Start

### 1. Add Your Photos

Place 3-5 photos in `images/photos/` with these names:
- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg` (optional)
- `photo5.jpg` (optional)

**Photo requirements:**
- Format: JPEG or PNG
- Orientation: Landscape recommended
- File size: <500KB each (optimize with TinyPNG)
- Dimensions: Max 1200px width

### 2. Add Background Music (Optional)

Place your music file as `audio/background.mp3`

**Audio requirements:**
- Format: MP3
- Duration: 30-90 seconds (loop-able)
- Bitrate: 128kbps
- File size: <5MB

### 3. Customize Text

Edit the text sequence in `js/script.js` (line ~126):

```javascript
const textSequence = [
    "Happy Valentine's Day",
    "Your custom message here...",
    "Another message...",
    // ... add more messages
    "I love you ❤️"
];
```

### 4. Test Locally

Open `index.html` in your browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have npx)
npx serve
```

Then visit: `http://localhost:8000`

## 📱 Mobile Testing

The website is designed for mobile-first viewing:

1. Test on actual mobile device
2. Or use browser DevTools (F12) → Device Toolbar
3. Recommended: iPhone 12/13/14 size (390×844)

## 🌐 Deployment to GitHub Pages

### Initial Setup

```bash
cd v-day-website-2026

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - Valentine's Day website"

# Create GitHub repository (via web interface)
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/valentine-2026.git
git branch -M main
git push -u origin main
```

### Enable GitHub Pages

1. Go to repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `(root)`
4. Save

Your site will be live at: `https://YOUR-USERNAME.github.io/valentine-2026/`

### Generate QR Code

Use any QR code generator with your live URL:
- [qr-code-generator.com](https://www.qr-code-generator.com/)
- [qr.io](https://qr.io/)

Save the QR code and print/share it!

## 🎨 Customization

### Using 4 or 5 Photos

Uncomment the extra layers in `index.html` (lines 20-23):

```html
<div class="photo-layer layer-4" data-photo="4"></div>
<div class="photo-layer layer-5" data-photo="5"></div>
```

And in `css/style.css` (lines 73-87).

### Changing Colors

Edit the starfield color palette in `js/script.js` (line ~29):

```javascript
hue: [0, 330, 340][Math.floor(Math.random() * 3)], // Reds/pinks
```

Change the hue values:
- Red: 0
- Pink: 330-340
- Purple: 270-300
- Blue: 200-240

### Adjusting Animation Speed

**Starfield twinkling** (line ~59):
```javascript
if (Math.random() > 0.99) { // Lower = faster twinkling (try 0.98)
```

**Mobile photo drift** (CSS line ~139):
```css
animation: drift ${8 + index * 2}s ease-in-out infinite;
```

## 📂 Project Structure

```
v-day-website-2026/
├── index.html              # Main HTML structure (~33 lines)
├── css/
│   └── style.css          # Styling and animations (~215 lines)
├── js/
│   └── script.js          # Canvas animation + interactivity (~266 lines)
├── images/
│   └── photos/            # Your 3-5 photos
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── photo3.jpg
├── audio/
│   └── background.mp3     # Optional background music
├── README.md
├── CLAUDE.md
└── .gitignore
```

## 🎯 Performance

- Canvas animation: 60fps
- Total page size: <10MB with photos
- Load time: <3 seconds on 4G
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## 📝 Browser Compatibility

- ✅ Chrome 90+ (desktop & Android)
- ✅ Firefox 88+
- ✅ Safari 14+ (desktop & iOS)
- ✅ Edge 90+

## ❤️ Credits

Design inspiration: [valentine-website by sojijr](https://github.com/sojijr/valentine-website)

Built with love using vanilla JavaScript, HTML5 Canvas, and CSS3.

## 📄 License

Personal use only. Photos and audio belong to their respective owners.
