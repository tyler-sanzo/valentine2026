# Quick Setup Guide

Follow these steps to customize and deploy your Valentine's Day photo gallery website.

## 📋 Checklist

### Step 1: Add Your Photos
- [ ] Collect your favorite photos together
- [ ] Optimize images using [TinyPNG](https://tinypng.com/) (resize to ~1920px width, compress)
- [ ] Place photos in `images/gallery/` folder
- [ ] Name them simply: `photo1.jpg`, `photo2.jpg`, etc.

### Step 2: Customize the Content

Edit `index.html`:

- [ ] **Hero section** (lines 34-39): Update title and subtitle
  ```html
  <h1 class="hero-title">Happy Valentine's Day</h1>
  <p class="hero-subtitle">Your custom message here</p>
  ```

- [ ] **Photo gallery** (lines 63-124): Update image paths and captions
  ```html
  <a href="images/gallery/photo1.jpg" data-lg-size="1920-1280">
      <img src="images/gallery/photo1.jpg"
           alt="Your caption here"
           loading="lazy"
           class="gallery-image">
  </a>
  ```
  - Add more photos by copying the entire `<a>...</a>` block
  - Update `alt` text - this becomes the caption in the lightbox

- [ ] **Background music** (line 48): Add your audio file
  ```html
  <source src="audio/background.mp3" type="audio/mpeg">
  ```
  - Place MP3 in `audio/` folder
  - Update filename if different

- [ ] **Spotify playlist** (line 136): Replace with your playlist embed
  1. Open your playlist on Spotify web
  2. Click "..." → Share → Embed Playlist
  3. Copy the entire `<iframe>` code
  4. Replace the existing iframe in index.html

- [ ] **Footer message** (lines 157-168): Personalize closing message
  ```html
  <p class="footer-message">Your romantic message here</p>
  <span class="signature-name">Your Name</span>
  ```

### Step 3: Test Locally

- [ ] Open `index.html` in your browser
  ```bash
  # Windows
  start index.html

  # Or right-click → Open with → Chrome/Firefox
  ```

- [ ] **OR** use VSCode Live Server (recommended)
  - Install "Live Server" extension in VSCode
  - Right-click `index.html` → "Open with Live Server"
  - Site auto-reloads when you make changes

- [ ] Test on mobile emulator:
  - Open browser DevTools (F12)
  - Click device toolbar icon (Ctrl+Shift+M)
  - Test at different screen sizes

### Step 4: Deploy to GitHub Pages

- [ ] Create GitHub account (if you don't have one)

- [ ] Create new repository
  - Name: `v-day-website-2026` (or your choice)
  - **Must be Public** for free GitHub Pages
  - Don't initialize with README

- [ ] Push your code
  ```bash
  cd v-day-website-2026
  git init
  git add .
  git commit -m "Initial Valentine's Day gallery"
  git branch -M main
  git remote add origin https://github.com/YOUR-USERNAME/v-day-website-2026.git
  git push -u origin main
  ```

- [ ] Enable GitHub Pages
  1. Repository → Settings → Pages
  2. Source: "Deploy from a branch"
  3. Branch: `main`, folder: `/ (root)`
  4. Click Save
  5. Wait 1-2 minutes

- [ ] Get your live URL
  - Will be: `https://YOUR-USERNAME.github.io/v-day-website-2026/`
  - Check the Pages settings page for exact URL

### Step 5: Create QR Code

- [ ] Go to [QR Code Generator](https://www.qr-code-generator.com/)
- [ ] Enter your GitHub Pages URL
- [ ] Customize design (optional):
  - Add heart icon
  - Change colors to match card
- [ ] Download high-resolution PNG
- [ ] **Test QR code** - scan with your phone camera
- [ ] Verify it opens your website correctly
- [ ] Print on Valentine's card

### Step 6: Final Testing

Before giving the gift:

- [ ] Open live site on your phone
- [ ] Test all photos open in lightbox
- [ ] Verify background music plays
- [ ] Check Spotify playlist loads
- [ ] Test on partner's phone if possible (different device)
- [ ] Proofread all text for typos
- [ ] Scan QR code from printed card (if possible)

## 🎨 Optional Customizations

### Change Color Scheme

Edit `css/style.css`:

```css
/* Primary colors (search and replace) */
#ff6b9d → Your new primary color
#c9184a → Your new secondary color
```

### Add More Photos

1. Add image to `images/gallery/`
2. Copy this block in `index.html` gallery section:
```html
<a href="images/gallery/photoX.jpg" data-lg-size="1920-1280">
    <img src="images/gallery/photoX.jpg"
         alt="Your caption"
         loading="lazy"
         class="gallery-image">
    <div class="image-overlay">
        <span class="overlay-text">View Photo</span>
    </div>
</a>
```

### Add Second Spotify Playlist

Uncomment lines 145-157 in `index.html` and add your embed code.

### Enable Easter Egg

Uncomment the Konami Code section in `js/script.js` (lines 168-187) for a fun surprise when typing: ↑ ↑ ↓ ↓ ← → ← → B A

## 🆘 Troubleshooting

**Images not showing on GitHub Pages?**
- Check file paths are correct (case-sensitive!)
- Verify images are committed: `git status`
- Clear browser cache and refresh

**Audio won't play?**
- Browsers block autoplay - this is normal
- User must click the play button
- Make sure MP3 file is in `audio/` folder

**Spotify embed is blank?**
- Playlist must be set to "Public" in Spotify
- Check embed URL is correct
- Test in incognito/private browsing

**QR code doesn't work?**
- Verify GitHub Pages is deployed (check repository Actions tab)
- Test URL in browser first
- Ensure QR code has correct URL
- Try regenerating the QR code

**Site looks broken on mobile?**
- Test in browser mobile emulator first
- Check for JavaScript errors in console (F12)
- Verify all CDN links are loading

## 📞 Need Help?

Check:
- `README.md` - Full documentation
- `CLAUDE.md` - Technical details
- `images/gallery/INSTRUCTIONS.txt` - Photo guidelines

## 🎁 You're Done!

Once everything is tested and working:
1. Print your QR code on a beautiful Valentine's card
2. Write a heartfelt message
3. Give the gift and watch their face light up! 💝

---

**Estimated total time:** 4-6 hours
**Best enjoyed with:** A cup of coffee and your favorite love songs playing ☕❤️
