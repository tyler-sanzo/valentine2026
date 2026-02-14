/* ============================================
   VALENTINE'S DAY 4-STAGE GAME - JAVASCRIPT
   ============================================ */

// ==========================================
// GLOBAL STATE
// ==========================================

let currentStage = 1;
const CORRECT_ORDER = [13, 14, 16]; // Photo 13 is first, Photo 14 is second, Photo 16 is third
const SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/YOUR_PLAYLIST_ID"; // Update this!

// Photo configuration
const GALLERY_PHOTO_COUNT = 15; // photo1-15 for random selection
const GALLERY_PHOTOS_TO_SHOW = 5; // Show 5 random photos
const TIMELINE_PHOTOS = [13, 14, 16]; // Timeline ordering game photos
const PUZZLE_PHOTO = 11; // Puzzle game photo

// Helper function to get photo path (handles .jpg vs .JPG)
function getPhotoPath(photoNum) {
    // photo10-15 are .JPG (uppercase), others are .jpg (lowercase)
    const extension = (photoNum >= 10 && photoNum <= 15) ? 'JPG' : 'jpg';
    return `images/gallery/photo${photoNum}.${extension}`;
}

// ==========================================
// 1. CANVAS STARFIELD ANIMATION
// ==========================================

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const stars = [];
const starCount = 500;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
}

function createStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2,
            hue: [0, 330, 340][Math.floor(Math.random() * 3)],
            saturation: 50 + Math.random() * 50,
            opacity: Math.random()
        });
    }
}

function drawStar(star) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${star.hue}, ${star.saturation}%, 70%, ${star.opacity})`;
    ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 88%, ${star.opacity})`;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a0a14');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, i) => {
        if (Math.random() > 0.99) {
            stars[i].opacity = Math.random();
        }
        drawStar(star);
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

initCanvas();
animate();

// ==========================================
// 2. STAGE 1 - PHOTO GALLERY PROGRESSION
// ==========================================

const textSequence = [
    "Hola mi amor, feliz día de San Valentín! 💖",
    "Te quiero mucho, tanto... ",
    "Quería prepararte algo especial...",
    "No tengo mucha experiencia con esto,,,",
    "Así que considéralo una primera prueba... 😅",
    "Pero espero que lo disfrutes.",
    "Tú y yo para siempre",
    "🦝❤️"
];

let currentStep = 0;
let photoIndex = 0;
let photoLayers;
let isDragging = false;
let currentDragElement = null;
let dragOffset = { x: 0, y: 0 };
let stage1PhotoPositions = {};

// Velocity tracking for momentum
let lastPosition = { x: 0, y: 0, time: 0 };
let velocity = { x: 0, y: 0 };
let momentumAnimation = null;

function initStage1() {
    photoLayers = document.querySelectorAll('#stage-1 .photo-layer');

    // Randomly select 5 photos from photo1-15
    const availablePhotos = Array.from({length: GALLERY_PHOTO_COUNT}, (_, i) => i + 1);
    const selectedPhotos = [];

    for (let i = 0; i < GALLERY_PHOTOS_TO_SHOW; i++) {
        const randomIndex = Math.floor(Math.random() * availablePhotos.length);
        selectedPhotos.push(availablePhotos[randomIndex]);
        availablePhotos.splice(randomIndex, 1); // Remove so we don't pick it again
    }

    console.log('Selected random photos for gallery:', selectedPhotos);

    // Apply random photos as backgrounds
    photoLayers.forEach((layer, index) => {
        if (selectedPhotos[index]) {
            layer.style.backgroundImage = `url('${getPhotoPath(selectedPhotos[index])}')`;
        }
    });

    // Initialize parallax
    if (window.matchMedia('(min-width: 769px)').matches) {
        document.addEventListener('mousemove', handleMouseParallax);
    } else {
        photoLayers.forEach((layer, index) => {
            layer.style.animation = `drift ${8 + index * 2}s ease-in-out infinite`;
        });
    }

    // Initialize drag and drop
    initDragAndDrop();

    // Progression system
    const textElement = document.getElementById('progressive-text');
    const hintElement = document.getElementById('tap-hint');

    // Initialize with first message
    textElement.textContent = textSequence[0];
    textElement.style.opacity = 1;

    function nextStep() {
        if (currentStage !== 1 || isDragging) return;

        // Move to next step
        currentStep++;

        if (currentStep < textSequence.length) {
            textElement.style.opacity = 0;

            setTimeout(() => {
                textElement.textContent = textSequence[currentStep];
                textElement.style.opacity = 1;

                if (photoIndex < photoLayers.length) {
                    photoLayers[photoIndex].style.opacity = 1;
                    photoIndex++;
                }

                if (currentStep >= textSequence.length - 1) {
                    // All photos shown, show game invitation
                    setTimeout(() => {
                        showGameInvitation();
                    }, 1500);
                } else if (currentStep === textSequence.length - 2) {
                    hintElement.textContent = "One more tap... ❤️";
                }
            }, 500);
        }
    }

    document.body.addEventListener('click', nextStep);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && currentStage === 1) {
            e.preventDefault();
            nextStep();
        }
    });
}

function handleMouseParallax(e) {
    if (isDragging || currentStage !== 1) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const xMove = (e.clientX - centerX) / 25;
    const yMove = (e.clientY - centerY) / 25;

    photoLayers.forEach((layer, index) => {
        if (stage1PhotoPositions[index]) return;

        const depth = (photoLayers.length - index) / photoLayers.length;
        const x = xMove * depth;
        const y = yMove * depth;

        layer.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function initDragAndDrop() {
    photoLayers.forEach((layer, index) => {
        layer.addEventListener('mousedown', (e) => startDrag(e, layer, index));
        layer.addEventListener('touchstart', (e) => startDrag(e, layer, index), { passive: false });
        layer.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', endDrag);
}

function startDrag(e, element, index) {
    e.preventDefault();
    e.stopPropagation();

    isDragging = true;
    currentDragElement = element;

    if (momentumAnimation) {
        cancelAnimationFrame(momentumAnimation);
        momentumAnimation = null;
    }

    const rect = element.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    dragOffset.x = clientX - rect.left;
    dragOffset.y = clientY - rect.top;

    lastPosition = { x: clientX, y: clientY, time: Date.now() };
    velocity = { x: 0, y: 0 };

    element.style.cursor = 'grabbing';
    element.style.transition = 'none';
    element.style.animation = 'none';
    element.style.zIndex = '1000';
}

function handleDragMove(e) {
    if (!isDragging || !currentDragElement) return;
    e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const currentTime = Date.now();
    const timeDelta = currentTime - lastPosition.time;

    if (timeDelta > 0) {
        velocity.x = (clientX - lastPosition.x) / timeDelta;
        velocity.y = (clientY - lastPosition.y) / timeDelta;
    }

    lastPosition = { x: clientX, y: clientY, time: currentTime };

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    currentDragElement.style.left = `${newX}px`;
    currentDragElement.style.top = `${newY}px`;
    currentDragElement.style.transform = 'none';
}

function endDrag(e) {
    if (!isDragging || !currentDragElement) return;

    const index = Array.from(photoLayers).indexOf(currentDragElement);

    currentDragElement.style.cursor = 'grab';
    currentDragElement.style.transition = 'opacity 0.5s ease-in-out';
    currentDragElement.style.zIndex = '';

    const elementToSlide = currentDragElement;

    isDragging = false;
    currentDragElement = null;

    applyMomentum(elementToSlide, index);
}

function applyMomentum(element, index) {
    const minVelocity = 0.1;
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

    if (velocityMagnitude < minVelocity) {
        stage1PhotoPositions[index] = {
            x: element.style.left,
            y: element.style.top
        };
        return;
    }

    const friction = 0.92;
    const minSpeed = 0.05;

    let currentX = parseFloat(element.style.left) || 0;
    let currentY = parseFloat(element.style.top) || 0;

    let vx = velocity.x * 10;
    let vy = velocity.y * 10;

    function animate() {
        vx *= friction;
        vy *= friction;

        currentX += vx;
        currentY += vy;

        const rect = element.getBoundingClientRect();
        const margin = 50;

        if (currentX < -rect.width + margin) {
            currentX = -rect.width + margin;
            vx = 0;
        }
        if (currentX > window.innerWidth - margin) {
            currentX = window.innerWidth - margin;
            vx = 0;
        }
        if (currentY < -rect.height + margin) {
            currentY = -rect.height + margin;
            vy = 0;
        }
        if (currentY > window.innerHeight - margin) {
            currentY = window.innerHeight - margin;
            vy = 0;
        }

        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;

        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > minSpeed) {
            momentumAnimation = requestAnimationFrame(animate);
        } else {
            stage1PhotoPositions[index] = {
                x: element.style.left,
                y: element.style.top
            };
            momentumAnimation = null;
        }
    }

    animate();
}

// ==========================================
// 3. GAME INVITATION TRANSITION
// ==========================================

function showGameInvitation() {
    const popup = document.getElementById('game-transition');
    popup.style.display = 'flex';

    document.getElementById('start-game-btn').addEventListener('click', () => {
        goToStage2();
    }, { once: true });
}

// ==========================================
// 4. STAGE 2 - TIMELINE ORDERING GAME
// ==========================================

let timelinePhotos;
let dropZones;
let currentDragPhoto = null;
let photoPositions = {}; // Track which photo is in which zone
let initialPhotoPositions = {}; // Store starting positions for reset

function initStage2() {
    timelinePhotos = document.querySelectorAll('.photo-timeline');
    dropZones = document.querySelectorAll('.drop-zone');

    // Set timeline photo backgrounds
    timelinePhotos.forEach((photo, index) => {
        const photoNum = TIMELINE_PHOTOS[index];
        photo.style.backgroundImage = `url('${getPhotoPath(photoNum)}')`;
        console.log(`Timeline photo ${index + 1}: photo${photoNum}`);
    });

    // Store initial positions and randomize
    randomizePhotoPositions();

    // Add drag handlers to timeline photos
    timelinePhotos.forEach(photo => {
        photo.addEventListener('mousedown', startTimelineDrag);
        photo.addEventListener('touchstart', startTimelineDrag, { passive: false });
    });

    // Global move and end handlers
    document.addEventListener('mousemove', handleTimelineDragMove);
    document.addEventListener('mouseup', endTimelineDrag);
    document.addEventListener('touchmove', handleTimelineDragMove, { passive: false });
    document.addEventListener('touchend', endTimelineDrag);

    // Check answer button
    document.getElementById('check-order-btn').addEventListener('click', checkTimelineOrder);
}

function randomizePhotoPositions() {
    // Position photos randomly on the screen (not in zones)
    const positions = [
        { top: '20%', left: '10%' },
        { top: '50%', right: '15%' },
        { bottom: '20%', left: '20%' }
    ];

    // Shuffle positions
    positions.sort(() => Math.random() - 0.5);

    timelinePhotos.forEach((photo, index) => {
        const pos = positions[index];
        if (pos.top) photo.style.top = pos.top;
        if (pos.bottom) photo.style.bottom = pos.bottom;
        if (pos.left) photo.style.left = pos.left;
        if (pos.right) photo.style.right = pos.right;

        // Store initial position
        initialPhotoPositions[index] = { ...pos };
    });
}

function startTimelineDrag(e) {
    e.preventDefault();
    e.stopPropagation();

    currentDragPhoto = e.currentTarget;
    currentDragPhoto.classList.add('dragging');

    const rect = currentDragPhoto.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    dragOffset.x = clientX - rect.left;
    dragOffset.y = clientY - rect.top;

    // If photo is in a zone, remove it
    const photoId = currentDragPhoto.dataset.photo;
    Object.keys(photoPositions).forEach(zonePos => {
        if (photoPositions[zonePos] === photoId) {
            delete photoPositions[zonePos];
            const zone = document.querySelector(`.drop-zone[data-position="${zonePos}"]`);
            zone.classList.remove('filled');
        }
    });
}

function handleTimelineDragMove(e) {
    if (!currentDragPhoto) return;
    e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    currentDragPhoto.style.left = `${newX}px`;
    currentDragPhoto.style.top = `${newY}px`;
    currentDragPhoto.style.right = 'auto';
    currentDragPhoto.style.bottom = 'auto';

    // Highlight drop zones on hover
    dropZones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const photoRect = currentDragPhoto.getBoundingClientRect();

        const photoCenterX = photoRect.left + photoRect.width / 2;
        const photoCenterY = photoRect.top + photoRect.height / 2;

        if (photoCenterX > zoneRect.left && photoCenterX < zoneRect.right &&
            photoCenterY > zoneRect.top && photoCenterY < zoneRect.bottom) {
            zone.classList.add('drag-over');
        } else {
            zone.classList.remove('drag-over');
        }
    });
}

function endTimelineDrag(e) {
    if (!currentDragPhoto) return;

    const photoRect = currentDragPhoto.getBoundingClientRect();
    const photoCenterX = photoRect.left + photoRect.width / 2;
    const photoCenterY = photoRect.top + photoRect.height / 2;

    let droppedInZone = false;

    // Check if dropped in a zone
    dropZones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();

        if (photoCenterX > zoneRect.left && photoCenterX < zoneRect.right &&
            photoCenterY > zoneRect.top && photoCenterY < zoneRect.bottom) {

            const zonePosition = zone.dataset.position;
            const photoId = currentDragPhoto.dataset.photo;

            // Check if zone is already occupied
            if (!photoPositions[zonePosition]) {
                // Snap photo to zone center
                currentDragPhoto.style.left = `${zoneRect.left + (zoneRect.width - photoRect.width) / 2}px`;
                currentDragPhoto.style.top = `${zoneRect.top + (zoneRect.height - photoRect.height) / 2}px`;

                photoPositions[zonePosition] = photoId;
                zone.classList.add('filled');
                currentDragPhoto.classList.add('in-zone');
                droppedInZone = true;
            }
        }
        zone.classList.remove('drag-over');
    });

    if (!droppedInZone) {
        currentDragPhoto.classList.remove('in-zone');
    }

    currentDragPhoto.classList.remove('dragging');
    currentDragPhoto = null;
}

function resetTimelinePhotos() {
    // Return photos to their initial positions
    timelinePhotos.forEach((photo, index) => {
        photo.classList.remove('in-zone');
        const pos = initialPhotoPositions[index];

        photo.style.left = pos.left || 'auto';
        photo.style.right = pos.right || 'auto';
        photo.style.top = pos.top || 'auto';
        photo.style.bottom = pos.bottom || 'auto';
    });

    // Clear zones
    dropZones.forEach(zone => {
        zone.classList.remove('filled');
    });

    // Clear position tracking
    photoPositions = {};
}

function checkTimelineOrder() {
    // Check if all zones are filled
    if (Object.keys(photoPositions).length !== 3) {
        showMessage('Place all photos in the timeline first!', 'error');
        return;
    }

    // Check if order is correct
    let isCorrect = true;
    for (let i = 1; i <= 3; i++) {
        const photoInZone = photoPositions[i];
        const correctPhoto = CORRECT_ORDER[i - 1];
        if (photoInZone != correctPhoto) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        showMessage('Perfecto! ❤️', 'success');
        setTimeout(() => {
            // Remove success message before transitioning
            const successMsg = document.querySelector('.game-message');
            if (successMsg) successMsg.remove();
            goToStage3();
        }, 2000);
    } else {
        showMessage('Try again...', 'error');
        setTimeout(() => {
            resetTimelinePhotos();
        }, 1500);
    }
}

function showMessage(text, type) {
    const existing = document.querySelector('.game-message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.className = `game-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'rgba(46, 213, 115, 0.9)' : 'rgba(255, 107, 157, 0.9)'};
        color: white;
        padding: 1.5rem 3rem;
        border-radius: 50px;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: messageSlide 0.3s ease;
    `;

    document.body.appendChild(message);

    if (type === 'error') {
        setTimeout(() => message.remove(), 2000);
    }
}

// ==========================================
// 5. STAGE 3 - JIGSAW PUZZLE (CLICK TO PLACE)
// ==========================================

const PUZZLE_COLS = 3;
const PUZZLE_ROWS = 3;

let puzzlePieces;
let puzzleSlots;
let selectedPiece = null; // Currently selected piece
let puzzlePlacements = {}; // Track which piece is in which slot

function initStage3() {
    createPuzzleGrid();
    createPuzzlePieces();
    randomizePuzzlePieces();

    // Add click handlers
    puzzlePieces = document.querySelectorAll('.puzzle-piece');
    puzzleSlots = document.querySelectorAll('.puzzle-slot');

    puzzlePieces.forEach(piece => {
        piece.addEventListener('click', selectPiece);
    });

    puzzleSlots.forEach(slot => {
        slot.addEventListener('click', placeInSlot);
    });

    // Check puzzle button
    document.getElementById('check-puzzle-btn').addEventListener('click', checkPuzzle);
}

function createPuzzleGrid() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';

    for (let row = 0; row < PUZZLE_ROWS; row++) {
        for (let col = 0; col < PUZZLE_COLS; col++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.row = row;
            slot.dataset.col = col;
            slot.dataset.position = row * PUZZLE_COLS + col; // 0-11
            grid.appendChild(slot);
        }
    }
}

function createPuzzlePieces() {
    const container = document.getElementById('puzzle-pieces-container');
    container.innerHTML = '';

    // Create pieces in order, will be randomized later
    for (let row = 0; row < PUZZLE_ROWS; row++) {
        for (let col = 0; col < PUZZLE_COLS; col++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';

            const correctPosition = row * PUZZLE_COLS + col;
            piece.dataset.correctRow = row;
            piece.dataset.correctCol = col;
            piece.dataset.correctPosition = correctPosition;

            // Set background image and position to show correct slice
            const puzzleImagePath = getPhotoPath(PUZZLE_PHOTO);
            piece.style.backgroundImage = `url('${puzzleImagePath}')`;
            const bgPosX = -(col * 240); // 240px is piece width (16:9 ratio)
            const bgPosY = -(row * 135); // 135px is piece height (16:9 ratio)
            piece.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

            // No overlay numbers

            // Initial spin animation (will be set to scale 0, then animated in)
            piece.style.transform = 'rotate(720deg) scale(0)';
            piece.style.opacity = '0';

            container.appendChild(piece);
        }
    }
}

function randomizePuzzlePieces() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    console.log('Randomizing puzzle pieces, found:', pieces.length);

    const pieceCount = PUZZLE_COLS * PUZZLE_ROWS;

    // Get puzzle grid position to calculate circle center
    const grid = document.getElementById('puzzle-grid');
    const gridRect = grid.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;

    // Calculate positions in a circle around the puzzle grid
    const radius = Math.max(gridRect.width, gridRect.height) * 0.8; // Circle radius
    const angleStep = (Math.PI * 2) / pieceCount; // Evenly space pieces
    const positions = [];

    for (let i = 0; i < pieceCount; i++) {
        // Add some randomness to the angle for less perfect circle
        const angle = angleStep * i + (Math.random() - 0.5) * 0.3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        positions.push({
            left: x - 120, // Center the piece (240px / 2)
            top: y - 67.5  // Center the piece (135px / 2)
        });
    }

    // Shuffle positions so pieces don't appear in order
    positions.sort(() => Math.random() - 0.5);

    // Spin in animation
    pieces.forEach((piece, index) => {
        const pos = positions[index];

        console.log(`Piece ${index + 1} position:`, pos);

        // Delay each piece slightly for staggered effect
        setTimeout(() => {
            piece.style.transition = 'all 1s ease-out';
            piece.style.transform = 'rotate(0deg) scale(1)';
            piece.style.opacity = '1';
            piece.style.left = `${pos.left}px`;
            piece.style.top = `${pos.top}px`;
        }, index * 80); // 80ms delay between each piece for nice effect
    });
}

function selectPiece(e) {
    e.stopPropagation();

    const piece = e.currentTarget;

    // If clicking an already selected piece, deselect it
    if (selectedPiece === piece) {
        piece.classList.remove('selected');
        selectedPiece = null;
        return;
    }

    // Deselect previously selected piece
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
    }

    // Select this piece
    selectedPiece = piece;
    piece.classList.add('selected');

    // Visual feedback
    piece.style.transform = 'scale(1.1)';
    setTimeout(() => {
        if (selectedPiece === piece) {
            piece.style.transform = 'scale(1)';
        }
    }, 200);
}

function placeInSlot(e) {
    if (!selectedPiece) return; // No piece selected
    e.stopPropagation();

    const slot = e.currentTarget;
    const slotPosition = slot.dataset.position;

    // Check if slot is already occupied
    if (puzzlePlacements[slotPosition]) {
        showMessage('This spot is already filled!', 'error');
        return;
    }

    const pieceCorrectPosition = selectedPiece.dataset.correctPosition;

    // Remove piece from old position if it was in a slot
    Object.keys(puzzlePlacements).forEach(pos => {
        if (puzzlePlacements[pos] === pieceCorrectPosition) {
            delete puzzlePlacements[pos];
            const oldSlot = document.querySelector(`.puzzle-slot[data-position="${pos}"]`);
            oldSlot.classList.remove('filled');
        }
    });

    // Get slot dimensions
    const slotRect = slot.getBoundingClientRect();
    const gridRect = document.getElementById('puzzle-grid').getBoundingClientRect();

    // Calculate position relative to viewport
    const pieceWidth = slotRect.width;
    const pieceHeight = slotRect.height;

    // Place piece in slot
    selectedPiece.style.position = 'fixed';
    selectedPiece.style.left = `${slotRect.left}px`;
    selectedPiece.style.top = `${slotRect.top}px`;
    selectedPiece.style.width = `${pieceWidth}px`;
    selectedPiece.style.height = `${pieceHeight}px`;

    // Update background size to match slot size
    const scaleX = pieceWidth / 240;
    const scaleY = pieceHeight / 135;
    selectedPiece.style.backgroundSize = `${720 * scaleX}px ${405 * scaleY}px`;

    // Update tracking
    puzzlePlacements[slotPosition] = pieceCorrectPosition;
    slot.classList.add('filled');
    selectedPiece.classList.add('in-slot');
    selectedPiece.classList.remove('selected');

    // Deselect
    selectedPiece = null;
}

function checkPuzzle() {
    // Check if all slots are filled
    if (Object.keys(puzzlePlacements).length !== 9) {
        showMessage('Place all pieces in the grid first!', 'error');
        return;
    }

    // Check if all pieces are in correct positions
    let isCorrect = true;
    for (let slotPos = 0; slotPos < 9; slotPos++) {
        const pieceInSlot = puzzlePlacements[slotPos];
        if (pieceInSlot != slotPos) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        showMessage('Perfect! You solved the puzzle! 🧩', 'success');
        setTimeout(() => {
            // Remove success message
            const successMsg = document.querySelector('.game-message');
            if (successMsg) successMsg.remove();
            goToStage4();
        }, 2000);
    } else {
        showMessage('Not quite right... keep trying! 💕', 'error');
    }
}

// ==========================================
// 6. STAGE 4 - VICTORY WITH SWIRLING PHOTOS
// ==========================================

function initStage4() {
    const swirlContainer = document.querySelector('.swirl-container');

    // Randomly select 3 photos from all photos (1-16)
    const allPhotos = Array.from({length: 16}, (_, i) => i + 1);
    const selectedPhotos = [];

    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * allPhotos.length);
        selectedPhotos.push(allPhotos[randomIndex]);
        allPhotos.splice(randomIndex, 1); // Remove so we don't pick it again
    }

    console.log('Selected random photos for victory swirl:', selectedPhotos);

    // Create 3 swirling photos
    selectedPhotos.forEach(photoNum => {
        const photo = document.createElement('div');
        photo.className = 'swirl-photo';
        photo.style.backgroundImage = `url('${getPhotoPath(photoNum)}')`;
        swirlContainer.appendChild(photo);
    });

    // Update Spotify link
    const spotifyLink = document.querySelector('.spotify-link');
    spotifyLink.href = SPOTIFY_PLAYLIST;
}

// ==========================================
// 7. STAGE TRANSITIONS
// ==========================================

function goToStage2() {
    // Fade out Stage 1
    const stage1 = document.getElementById('stage-1');
    const popup = document.getElementById('game-transition');

    popup.style.opacity = '0';
    setTimeout(() => popup.style.display = 'none', 500);

    // Get the 3 photos that will be used in Stage 2
    const galleryPhotos = document.querySelectorAll('#stage-1 .photo-layer');

    // Spin transition animation
    galleryPhotos.forEach((photo, index) => {
        photo.style.transition = 'all 1s ease-in-out';
        photo.style.transform = `rotate(${360 * 2}deg) scale(0)`;
        photo.style.opacity = '0';
    });

    setTimeout(() => {
        stage1.style.display = 'none';
        document.getElementById('stage-2').style.display = 'flex';
        currentStage = 2;

        // Spin in timeline photos
        const timelinePhotos = document.querySelectorAll('.photo-timeline');
        timelinePhotos.forEach((photo, index) => {
            photo.style.transform = `rotate(${360 * 2}deg) scale(0)`;
            photo.style.opacity = '0';

            setTimeout(() => {
                photo.style.transition = 'all 1s ease-out';
                photo.style.transform = 'rotate(0deg) scale(1)';
                photo.style.opacity = '1';
            }, 50);
        });

        initStage2();
    }, 1000);
}

function goToStage3() {
    document.getElementById('stage-2').style.display = 'none';
    document.getElementById('stage-3').style.display = 'flex';
    currentStage = 3;
    initStage3();
}

function goToStage4() {
    document.getElementById('stage-3').style.display = 'none';
    document.getElementById('stage-4').style.display = 'flex';
    currentStage = 4;
    initStage4();
}

// ==========================================
// 8. AUDIO MANAGEMENT
// ==========================================

let audioStarted = false;
let bgMusic = null;

function initAudio() {
    bgMusic = new Audio('audio/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0;
}

function startAudio() {
    if (!audioStarted && bgMusic) {
        bgMusic.play()
            .then(() => {
                console.log('Background music started');
                audioStarted = true;
                fadeInAudio(bgMusic, 2000);
            })
            .catch(error => {
                console.log('Audio autoplay blocked or file missing:', error);
            });
    }
}

function fadeInAudio(audio, duration = 2000) {
    const targetVolume = 0.3;
    const steps = 20;
    const volumeStep = targetVolume / steps;
    const interval = duration / steps;

    let step = 0;
    const fadeInterval = setInterval(() => {
        if (step >= steps) {
            clearInterval(fadeInterval);
            return;
        }
        audio.volume = Math.min(volumeStep * step, targetVolume);
        step++;
    }, interval);
}

try {
    initAudio();
} catch (error) {
    console.log('Audio initialization failed:', error);
}

document.body.addEventListener('click', startAudio, { once: true });

// Preload images
window.addEventListener('load', () => {
    const allPhotos = document.querySelectorAll('[style*="background-image"]');
    allPhotos.forEach(element => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        const url = bgImage.slice(4, -1).replace(/"/g, "");
        if (url && url !== 'none') {
            const img = new Image();
            img.src = url;
        }
    });
});

// ==========================================
// 9. INITIALIZE
// ==========================================

console.log('Valentine\'s Day 4-Stage Game loaded ❤️');
console.log('Stage 1: Photo Gallery → Stage 2: Timeline → Stage 3: Puzzle → Stage 4: Victory');

// Initialize Stage 1 on load
initStage1();
