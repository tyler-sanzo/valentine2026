# Valentine's Day 3-Stage Game Structure

## Overview

The website is now a 3-stage interactive game that progresses from timeline ordering → jigsaw puzzle → romantic photo experience.

## Game Flow

### Stage 1: Timeline Ordering 📅
**Objective**: Arrange 3 photos in chronological order (earliest to latest)

**Current correct order**:
- Position 1 (First): Photo 3
- Position 2 (Second): Photo 2
- Position 3 (Third): Photo 1

**How it works**:
1. Three photos appear randomly positioned on screen
2. Three drop zones labeled "First", "Second", "Third"
3. Drag photos into zones in chronological order
4. Click "Check My Answer" to validate
5. On success → advance to Stage 2
6. On failure → try again

**To customize**:
```javascript
// In js/script.js line 10
const CORRECT_ORDER = [3, 2, 1]; // Change to your actual chronological order
```

### Stage 2: Jigsaw Puzzle 🧩
**Status**: Placeholder (not yet implemented)

**Planned functionality**:
1. A photo gets split into puzzle pieces
2. Drag pieces to reassemble the image
3. Validate completion
4. On success → advance to Stage 3

**Current behavior**:
- Shows placeholder puzzle container
- Clicking "Check Puzzle" button automatically advances to Stage 3
- Ready for puzzle implementation

**Puzzle image**:
- Expected at: `images/photos/puzzle.jpg`
- Currently shows semi-transparent preview
- Add your puzzle image here

### Stage 3: Romantic Progression ❤️
**The original experience**: Starfield background, parallax photos, progressive storytelling

**Features**:
- All 3 photos fade in with text progression
- Photos are draggable with momentum physics
- Mouse parallax effect (desktop) or drift animation (mobile)
- Text sequence reveals on each click/tap
- Background music starts on first interaction

## File Structure

```
v-day-website-2026/
├── index.html                    # All 3 stages in single HTML
│   ├── #stage-1                 # Timeline ordering UI
│   ├── #stage-2                 # Puzzle UI (placeholder)
│   └── #stage-3                 # Romantic progression
│
├── css/style.css                 # Styles for all stages
│   ├── Game stage containers
│   ├── Timeline drop zones
│   ├── Puzzle placeholder
│   └── Stage 3 parallax photos
│
├── js/script.js                  # Game logic (~650 lines)
│   ├── Canvas starfield (lines 13-75)
│   ├── Stage 1: Timeline (lines 77-294)
│   ├── Stage 2: Puzzle placeholder (lines 296-307)
│   ├── Stage 3: Romantic (lines 309-572)
│   ├── Stage transitions (lines 574-590)
│   └── Audio management (lines 592-642)
│
└── images/photos/
    ├── photo1.jpg               # Used in Stage 1 & 3
    ├── photo2.jpg               # Used in Stage 1 & 3
    ├── photo3.jpg               # Used in Stage 1 & 3
    └── puzzle.jpg               # For Stage 2 (add this!)
```

## Adding Your Photos

### For Stages 1 & 3 (photo1.jpg, photo2.jpg, photo3.jpg):
- Place your 3 photos in `images/photos/`
- Name them: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`
- Update the correct order in `js/script.js` line 10

### For Stage 2 (puzzle.jpg):
- Add a 4th photo as `images/photos/puzzle.jpg`
- This will be shown as the puzzle preview
- Square aspect ratio works best (e.g., 800x800px)

## Customizing Timeline Order

**Example**: If your actual chronological order is photo2 → photo1 → photo3:

```javascript
// js/script.js line 10
const CORRECT_ORDER = [2, 1, 3];
```

This means:
- Drop zone 1 (First) expects photo 2
- Drop zone 2 (Second) expects photo 1
- Drop zone 3 (Third) expects photo 3

## Customizing Text Sequence (Stage 3)

```javascript
// js/script.js lines 323-331
const textSequence = [
    "You did it!",
    "Your message 2",
    "Your message 3",
    // ... add more messages
    "Final message ❤️"
];
```

## Testing Checklist

- [ ] Stage 1: Can drag photos into drop zones
- [ ] Stage 1: Drop zones highlight on hover
- [ ] Stage 1: Photos snap to zone centers
- [ ] Stage 1: Correct order validation works
- [ ] Stage 1: Wrong order shows error message
- [ ] Stage 1 → 2: Transition after correct answer
- [ ] Stage 2: Puzzle image appears (placeholder)
- [ ] Stage 2 → 3: Button click advances
- [ ] Stage 3: Starfield animates smoothly
- [ ] Stage 3: Photos draggable with momentum
- [ ] Stage 3: Text progression on click
- [ ] Stage 3: Audio starts on first click
- [ ] Mobile: All drag interactions work with touch
- [ ] Mobile: Layouts adjust responsively

## Next Steps

1. **Add your photos**: Replace photo1.jpg, photo2.jpg, photo3.jpg
2. **Set correct order**: Update `CORRECT_ORDER` in script.js
3. **Add puzzle image**: Create `puzzle.jpg` for Stage 2
4. **Implement puzzle**: Replace Stage 2 placeholder with actual jigsaw logic
5. **Customize text**: Update `textSequence` for Stage 3
6. **Add audio**: Optional background music at `audio/background.mp3`
7. **Test thoroughly**: Try all stages on desktop + mobile
8. **Deploy**: Push to GitHub Pages

## Browser Console Tips

```javascript
// Skip to specific stage (for testing)
goToStage2(); // Skip Stage 1
goToStage3(); // Skip to final stage

// Check current stage
console.log(currentStage); // 1, 2, or 3

// Check timeline answer
console.log(photoPositions); // Shows current photo placement
console.log(CORRECT_ORDER);  // Shows correct answer
```

## Future Enhancements

- [ ] Implement actual jigsaw puzzle for Stage 2
- [ ] Add confetti animation on Stage 1 completion
- [ ] Add timer/score tracking
- [ ] Save progress to localStorage
- [ ] Add "replay" button at end
- [ ] Add hints system for timeline
- [ ] Create harder puzzle difficulty levels
