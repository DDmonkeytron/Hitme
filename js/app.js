// Burger Clicker Game

// JSONBin Configuration
const JSONBIN_API_KEY = '$2a$10$LwIkUXYuI8s1O/c2QteHV.eU7YkjUCfB3ELTQcCR38S2h6aG5j/1q';
const JSONBIN_BIN_ID = '691d92caae596e708f6297f1';
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// Game state
let totalBites = 0;
let burgersEaten = 0;
let currentBurgerBites = 0;
const BITES_PER_BURGER = 10;
let currentMultiplier = 1;
let activeMultipliers = [];
let multiplierSpawnInterval;
let burgerScale = 1;
let backgroundStage = 0;
let burgerTier = 0;
let playerName = '';
let gameStarted = false;

// Burger tier names (100 levels of progression)
const burgerTiers = [
    { name: "Regular Burger", color: "#daa520", value: 1 },
    { name: "Cosmic Burger", color: "#9370DB", value: 5 },
    { name: "Galactic Burger", color: "#4169E1", value: 10 },
    { name: "Universal Burger", color: "#FF1493", value: 20 },
    { name: "Dimensional Burger", color: "#00CED1", value: 35 },
    { name: "Celestial Burger", color: "#FFD700", value: 50 },
    { name: "Nebula Burger", color: "#FF69B4", value: 75 },
    { name: "Quantum Burger", color: "#00FF00", value: 100 },
    { name: "Stellar Burger", color: "#FF4500", value: 150 },
    { name: "Supernova Burger", color: "#FF6347", value: 200 },
    { name: "Pulsar Burger", color: "#1E90FF", value: 300 },
    { name: "Quasar Burger", color: "#8A2BE2", value: 400 },
    { name: "Black Hole Burger", color: "#000000", value: 500 },
    { name: "White Dwarf Burger", color: "#FFFFFF", value: 750 },
    { name: "Red Giant Burger", color: "#DC143C", value: 1000 },
    { name: "Neutron Star Burger", color: "#C0C0C0", value: 1500 },
    { name: "Magnetar Burger", color: "#FF00FF", value: 2000 },
    { name: "Hypernova Burger", color: "#FFFF00", value: 3000 },
    { name: "Gamma Ray Burger", color: "#00FFFF", value: 4000 },
    { name: "Dark Matter Burger", color: "#2F4F4F", value: 5000 },
    { name: "Dark Energy Burger", color: "#191970", value: 7500 },
    { name: "Multiverse Burger", color: "#FF1493", value: 10000 },
    { name: "Omniversal Burger", color: "#9400D3", value: 15000 },
    { name: "Infinite Burger", color: "#FFD700", value: 20000 },
    { name: "Eternal Burger", color: "#FF8C00", value: 30000 },
    { name: "Primordial Burger", color: "#8B4513", value: 40000 },
    { name: "Void Burger", color: "#0000CD", value: 50000 },
    { name: "Chaos Burger", color: "#DC143C", value: 75000 },
    { name: "Order Burger", color: "#4682B4", value: 100000 },
    { name: "Balance Burger", color: "#9370DB", value: 150000 },
    { name: "Harmony Burger", color: "#48D1CC", value: 200000 },
    { name: "Discord Burger", color: "#FF4500", value: 300000 },
    { name: "Reality Burger", color: "#00CED1", value: 400000 },
    { name: "Fantasy Burger", color: "#FF69B4", value: 500000 },
    { name: "Dream Burger", color: "#9932CC", value: 750000 },
    { name: "Nightmare Burger", color: "#8B0000", value: 1000000 },
    { name: "Astral Burger", color: "#7B68EE", value: 1500000 },
    { name: "Ethereal Burger", color: "#E0FFFF", value: 2000000 },
    { name: "Spectral Burger", color: "#ADFF2F", value: 3000000 },
    { name: "Phantom Burger", color: "#696969", value: 4000000 },
    { name: "Spirit Burger", color: "#F0E68C", value: 5000000 },
    { name: "Soul Burger", color: "#DA70D6", value: 7500000 },
    { name: "Essence Burger", color: "#FFE4B5", value: 10000000 },
    { name: "Transcendent Burger", color: "#FAFAD2", value: 15000000 },
    { name: "Ascendant Burger", color: "#FFF8DC", value: 20000000 },
    { name: "Divine Burger", color: "#FFFACD", value: 30000000 },
    { name: "Sacred Burger", color: "#F5DEB3", value: 40000000 },
    { name: "Holy Burger", color: "#FFFAF0", value: 50000000 },
    { name: "Blessed Burger", color: "#FDF5E6", value: 75000000 },
    { name: "Cursed Burger", color: "#2F4F4F", value: 100000000 },
    { name: "Legendary Burger", color: "#FFD700", value: 150000000 },
    { name: "Mythical Burger", color: "#FF1493", value: 200000000 },
    { name: "Epic Burger", color: "#9400D3", value: 300000000 },
    { name: "Heroic Burger", color: "#FF4500", value: 400000000 },
    { name: "Godly Burger", color: "#FFD700", value: 500000000 },
    { name: "Titan Burger", color: "#B8860B", value: 750000000 },
    { name: "Olympian Burger", color: "#FFFFE0", value: 1000000000 },
    { name: "Pantheon Burger", color: "#F0E68C", value: 1500000000 },
    { name: "Creator Burger", color: "#FFFACD", value: 2000000000 },
    { name: "Destroyer Burger", color: "#8B0000", value: 3000000000 },
    { name: "Alpha Burger", color: "#4169E1", value: 4000000000 },
    { name: "Omega Burger", color: "#FF6347", value: 5000000000 },
    { name: "Genesis Burger", color: "#32CD32", value: 7500000000 },
    { name: "Apocalypse Burger", color: "#DC143C", value: 10000000000 },
    { name: "Rebirth Burger", color: "#00FA9A", value: 15000000000 },
    { name: "Resurrection Burger", color: "#ADFF2F", value: 20000000000 },
    { name: "Immortal Burger", color: "#FFD700", value: 30000000000 },
    { name: "Invincible Burger", color: "#FF1493", value: 40000000000 },
    { name: "Unstoppable Burger", color: "#FF4500", value: 50000000000 },
    { name: "Supreme Burger", color: "#9400D3", value: 75000000000 },
    { name: "Ultimate Burger", color: "#FFD700", value: 100000000000 },
    { name: "Absolute Burger", color: "#FFFFFF", value: 150000000000 },
    { name: "Perfect Burger", color: "#FFD700", value: 200000000000 },
    { name: "Flawless Burger", color: "#F0FFFF", value: 300000000000 },
    { name: "Pristine Burger", color: "#FFFAF0", value: 400000000000 },
    { name: "Pure Burger", color: "#FFFAFA", value: 500000000000 },
    { name: "Radiant Burger", color: "#FFFF00", value: 750000000000 },
    { name: "Brilliant Burger", color: "#FAFAD2", value: 1000000000000 },
    { name: "Glorious Burger", color: "#FFD700", value: 1500000000000 },
    { name: "Majestic Burger", color: "#DDA0DD", value: 2000000000000 },
    { name: "Regal Burger", color: "#9370DB", value: 3000000000000 },
    { name: "Imperial Burger", color: "#8B008B", value: 4000000000000 },
    { name: "Royal Burger", color: "#4B0082", value: 5000000000000 },
    { name: "Noble Burger", color: "#6A5ACD", value: 7500000000000 },
    { name: "Exalted Burger", color: "#FFD700", value: 10000000000000 },
    { name: "Venerated Burger", color: "#F0E68C", value: 15000000000000 },
    { name: "Revered Burger", color: "#EEE8AA", value: 20000000000000 },
    { name: "Worshiped Burger", color: "#FAFAD2", value: 30000000000000 },
    { name: "Adored Burger", color: "#FFB6C1", value: 40000000000000 },
    { name: "Cherished Burger", color: "#FFC0CB", value: 50000000000000 },
    { name: "Treasured Burger", color: "#FFD700", value: 75000000000000 },
    { name: "Priceless Burger", color: "#FFFFE0", value: 100000000000000 },
    { name: "Invaluable Burger", color: "#FFFACD", value: 150000000000000 },
    { name: "Beyond Burger", color: "#E6E6FA", value: 200000000000000 },
    { name: "Transcendental Burger", color: "#F0E68C", value: 300000000000000 },
    { name: "Paradox Burger", color: "#FF00FF", value: 400000000000000 },
    { name: "Singularity Burger", color: "#000000", value: 500000000000000 },
    { name: "THE Burger", color: "#FFD700", value: 1000000000000000 }
];

// Audio elements - using Web Audio API for bite sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create bite sound (crunch)
function playBiteSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Create celebration sound
function playCelebrationSound() {
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
    });
}

// Create powerup sound
function playPowerupSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// DOM elements
const burger = document.getElementById('burger');
const totalBitesEl = document.getElementById('totalBites');
const burgersEatenEl = document.getElementById('burgersEaten');
const currentBitesEl = document.getElementById('currentBites');
const clickMessage = document.getElementById('clickMessage');
const celebration = document.getElementById('celebration');
const multiplierValueEl = document.getElementById('multiplierValue');
const multiplierContainer = document.getElementById('multiplierContainer');

// Update display
function updateStats() {
    totalBitesEl.textContent = totalBites.toLocaleString();
    burgersEatenEl.textContent = burgersEaten.toLocaleString();
    
    // Update burger tier
    updateBurgerTier();
    
    // Calculate required bites based on tier
    const tierData = burgerTiers[burgerTier];
    const requiredBites = Math.floor(BITES_PER_BURGER * tierData.value * (1 + (burgersEaten % 100) * 0.1));
    currentBitesEl.textContent = `${currentBurgerBites.toLocaleString()} / ${requiredBites.toLocaleString()}`;
    multiplierValueEl.textContent = `${currentMultiplier}x`;
}

// Update burger tier based on burgers eaten
function updateBurgerTier() {
    const newTier = Math.min(Math.floor(burgersEaten / 100), burgerTiers.length - 1);
    
    if (newTier !== burgerTier) {
        burgerTier = newTier;
        const tierData = burgerTiers[burgerTier];
        
        // Update burger color
        document.documentElement.style.setProperty('--bun-color', tierData.color);
        
        // Show tier upgrade notification
        if (burgerTier > 0) {
            const notification = document.createElement('div');
            notification.textContent = `✨ TIER UP! ${tierData.name.toUpperCase()}! ✨`;
            notification.style.position = 'fixed';
            notification.style.top = '30%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.fontSize = '4rem';
            notification.style.fontWeight = 'bold';
            notification.style.color = tierData.color;
            notification.style.textShadow = `0 0 20px ${tierData.color}, 2px 2px 4px rgba(0,0,0,0.8)`;
            notification.style.zIndex = '999';
            notification.style.pointerEvents = 'none';
            notification.style.animation = 'celebrate 2s ease-out';
            notification.style.textAlign = 'center';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
            playCelebrationSound();
        }
    }
    
    // Update burger name display
    const tierData = burgerTiers[burgerTier];
    document.querySelector('header h1').innerHTML = `🍔 ${tierData.name} Clicker 🍔`;
}

// Update burger size and background based on progress
function updateBurgerSize() {
    // Scale increases with each burger eaten
    burgerScale = 1 + (burgersEaten * 0.15);
    burger.style.transform = `scale(${burgerScale})`;
    
    // Update background based on milestones
    const body = document.body;
    
    if (burgersEaten >= 100) {
        backgroundStage = 7;
        body.style.background = 'radial-gradient(circle, #000033 0%, #000000 100%)';
        body.style.backgroundSize = 'cover';
        document.querySelector('.container').style.background = 'rgba(0,0,0,0.3)';
    } else if (burgersEaten >= 75) {
        backgroundStage = 6;
        body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)';
        document.querySelector('.container').style.background = 'rgba(0,0,0,0.4)';
    } else if (burgersEaten >= 50) {
        backgroundStage = 5;
        body.style.background = 'linear-gradient(to bottom, #87CEEB 0%, #4682B4 50%, #2F4F4F 100%)';
        document.querySelector('.container').style.background = 'rgba(255,255,255,0.1)';
    } else if (burgersEaten >= 30) {
        backgroundStage = 4;
        body.style.background = 'linear-gradient(to bottom, #654321 0%, #8B4513 50%, #A0522D 100%)';
        document.querySelector('.container').style.background = 'rgba(139,69,19,0.3)';
    } else if (burgersEaten >= 15) {
        backgroundStage = 3;
        body.style.background = 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)';
        document.querySelector('.container').style.background = 'rgba(139,69,19,0.2)';
    } else if (burgersEaten >= 5) {
        backgroundStage = 2;
        body.style.background = 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF6347 100%)';
        document.querySelector('.container').style.background = 'rgba(139,0,0,0.2)';
    } else if (burgersEaten >= 1) {
        backgroundStage = 1;
        body.style.background = 'linear-gradient(135deg, #654321 0%, #8B4513 100%)';
        document.querySelector('.container').style.background = 'rgba(101,67,33,0.3)';
    }
    
    // Show progress message
    updateBackgroundMessage();
}

// Display messages about burger growth
function updateBackgroundMessage() {
    let message = '';
    
    if (burgersEaten >= 100) {
        message = '🌌 THE BURGER CONSUMES THE UNIVERSE! 🌌';
    } else if (burgersEaten >= 75) {
        message = '🏙️ BURGER BIGGER THAN THE CITY! 🏙️';
    } else if (burgersEaten >= 50) {
        message = '🏢 BURGER TOWERS OVER SKYSCRAPERS! 🏢';
    } else if (burgersEaten >= 30) {
        message = '🏗️ BURGER CRUSHES THE BUILDING! 🏗️';
    } else if (burgersEaten >= 15) {
        message = '🏪 BURGER BURSTS OUT OF THE RESTAURANT! 🏪';
    } else if (burgersEaten >= 5) {
        message = '🪑 BURGER BREAKS THE TABLE! 🪑';
    } else if (burgersEaten >= 1) {
        message = '🍽️ Burger on the table...';
    }
    
    if (message) {
        const existingMsg = document.querySelector('.background-message');
        if (existingMsg) existingMsg.remove();
        
        const msgElement = document.createElement('div');
        msgElement.className = 'background-message';
        msgElement.textContent = message;
        document.body.appendChild(msgElement);
    }
}

// Calculate total multiplier from active multipliers
function calculateMultiplier() {
    if (activeMultipliers.length === 0) {
        currentMultiplier = 1;
    } else {
        currentMultiplier = activeMultipliers.reduce((total, mult) => total * mult.value, 1);
    }
    updateStats();
}

// Spawn a random multiplier powerup
function spawnMultiplier() {
    const multiplierType = Math.random() < 0.6 ? 2 : 4; // 60% chance for 2x, 40% for 4x
    const powerup = document.createElement('div');
    powerup.className = `multiplier-powerup x${multiplierType}`;
    powerup.textContent = `${multiplierType}x`;
    
    // Random position (avoid edges)
    const x = Math.random() * (window.innerWidth - 100) + 10;
    const y = Math.random() * (window.innerHeight - 100) + 10;
    powerup.style.left = x + 'px';
    powerup.style.top = y + 'px';
    
    // Click handler
    powerup.addEventListener('click', () => {
        activateMultiplier(multiplierType);
        powerup.remove();
        playPowerupSound();
    });
    
    powerup.addEventListener('touchend', (event) => {
        event.preventDefault();
        activateMultiplier(multiplierType);
        powerup.remove();
        playPowerupSound();
    });
    
    multiplierContainer.appendChild(powerup);
    
    // Auto-remove after 10 seconds if not clicked
    setTimeout(() => {
        if (powerup.parentElement) {
            powerup.remove();
        }
    }, 10000);
}

// Activate a multiplier
function activateMultiplier(value) {
    const duration = Math.floor(Math.random() * 40000) + 20000; // 20-60 seconds
    const endTime = Date.now() + duration;
    
    const multiplier = {
        value: value,
        endTime: endTime,
        id: Date.now()
    };
    
    activeMultipliers.push(multiplier);
    calculateMultiplier();
    updateMultiplierDisplay();
    
    // Show notification
    const notification = document.createElement('div');
    notification.textContent = `${value}x Multiplier Activated!`;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.fontSize = '3rem';
    notification.style.fontWeight = 'bold';
    notification.style.color = value === 2 ? '#4ade80' : '#f59e0b';
    notification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    notification.style.zIndex = '999';
    notification.style.pointerEvents = 'none';
    notification.style.animation = 'celebrate 1s ease-out';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 1000);
    
    // Remove multiplier when it expires
    setTimeout(() => {
        activeMultipliers = activeMultipliers.filter(m => m.id !== multiplier.id);
        calculateMultiplier();
        updateMultiplierDisplay();
    }, duration);
}

// Update multiplier timer display
function updateMultiplierDisplay() {
    let existingTimer = document.querySelector('.multiplier-timer');
    
    if (activeMultipliers.length === 0) {
        if (existingTimer) existingTimer.remove();
        return;
    }
    
    if (!existingTimer) {
        existingTimer = document.createElement('div');
        existingTimer.className = 'multiplier-timer';
        document.body.appendChild(existingTimer);
    }
    
    existingTimer.innerHTML = '<h4>Active Multipliers</h4>';
    
    activeMultipliers.forEach(mult => {
        const timeLeft = Math.ceil((mult.endTime - Date.now()) / 1000);
        const div = document.createElement('div');
        div.className = `active-multiplier x${mult.value}`;
        div.innerHTML = `
            <span class="mult-label">${mult.value}x</span>
            <span class="mult-time">${timeLeft}s</span>
        `;
        existingTimer.appendChild(div);
    });
}

// Update timer display every second
setInterval(() => {
    if (activeMultipliers.length > 0) {
        updateMultiplierDisplay();
    }
}, 1000);

// Create floating bite animation
function createFloatingBite(x, y) {
    const floatingBite = document.createElement('div');
    floatingBite.textContent = '😋';
    floatingBite.style.position = 'fixed';
    floatingBite.style.left = x + 'px';
    floatingBite.style.top = y + 'px';
    floatingBite.style.fontSize = '2rem';
    floatingBite.style.pointerEvents = 'none';
    floatingBite.style.zIndex = '1000';
    floatingBite.style.animation = 'celebrate 1s ease-out forwards';
    document.body.appendChild(floatingBite);
    
    setTimeout(() => {
        floatingBite.remove();
    }, 1000);
}

// Eat burger (complete burger)
function eatBurger() {
    burger.style.opacity = '0';
    burger.style.transform = `scale(0) rotate(360deg)`;
    burger.style.transition = 'all 0.5s ease';
    
    celebration.textContent = '🎉 BURGER EATEN! 🎉';
    celebration.classList.add('show');
    
    playCelebrationSound();
    
    setTimeout(() => {
        celebration.classList.remove('show');
        
        // Reset burger with new size
        burger.style.opacity = '1';
        updateBurgerSize();
        burger.style.transition = 'all 0.5s ease';
        currentBurgerBites = 0;
        updateStats();
    }, 1000);
}

// Take a bite
function takeBite(event) {
    const tierInfo = burgerTiers[burgerTier];
    const bitesToAdd = currentMultiplier * tierInfo.value;
    totalBites += bitesToAdd;
    currentBurgerBites += bitesToAdd;
    
    // Add bite animation
    burger.classList.add('bite');
    setTimeout(() => {
        burger.classList.remove('bite');
    }, 200);
    
    // Play bite sound
    playBiteSound();
    
    // Create floating emoji
    createFloatingBite(event.clientX, event.clientY);
    
    // Update stats
    updateStats();
    
    // Hide click message after first click
    if (totalBites === bitesToAdd) {
        clickMessage.style.display = 'none';
    }
    
    // Check if burger is finished
    const requiredBites = Math.floor(BITES_PER_BURGER * tierInfo.value * (1 + (burgersEaten % 100) * 0.1));
    
    if (currentBurgerBites >= requiredBites) {
        burgersEaten++;
        eatBurger();
        
        // Save to leaderboard on burger completion
        if (gameStarted && burgersEaten % 10 === 0) {
            saveToLeaderboard();
        }
    } else {
        // Scale down burger slightly with each bite
        const biteProgress = currentBurgerBites / requiredBites;
        const currentScale = burgerScale * (1 - biteProgress * 0.3);
        burger.style.transform = `scale(${currentScale})`;
    }
}

// Keyboard shortcut (spacebar)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        const burger = document.getElementById('burger');
        if (burger) {
            const rect = burger.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            takeBite({ clientX: centerX, clientY: centerY });
        }
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    console.log('🍔 Burger Clicker initialized! Click the burger to eat!');
    
    // Show name entry modal
    const nameModal = document.getElementById('nameModal');
    const playerNameInput = document.getElementById('playerNameInput');
    const startGameBtn = document.getElementById('startGameBtn');
    
    startGameBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name.length > 0) {
            playerName = name;
            nameModal.style.display = 'none';
            startGame();
        } else {
            alert('Please enter your name!');
        }
    });
    
    // Allow Enter key to submit
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGameBtn.click();
        }
    });
    
    // Leaderboard toggle
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardModal = document.getElementById('leaderboardModal');
    const closeLeaderboard = document.getElementById('closeLeaderboard');
    const refreshLeaderboard = document.getElementById('refreshLeaderboard');
    
    leaderboardBtn.addEventListener('click', () => {
        leaderboardModal.style.display = 'flex';
        loadLeaderboard();
    });
    
    closeLeaderboard.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
    });
    
    refreshLeaderboard.addEventListener('click', () => {
        loadLeaderboard();
    });
    
    // Close modal when clicking outside
    leaderboardModal.addEventListener('click', (e) => {
        if (e.target === leaderboardModal) {
            leaderboardModal.style.display = 'none';
        }
    });
});

function startGame() {
    gameStarted = true;
    
    // Set up event listeners
    const burger = document.getElementById('burger');
    burger.addEventListener('click', takeBite);
    burger.addEventListener('touchend', (event) => {
        event.preventDefault();
        const touch = event.changedTouches[0];
        takeBite({ clientX: touch.clientX, clientY: touch.clientY });
    });
    
    updateStats();
    
    // Auto-save to leaderboard every 30 seconds
    setInterval(() => {
        if (gameStarted) {
            saveToLeaderboard();
        }
    }, 30000);
    
    // Start spawning multipliers every 10-20 seconds
    function scheduleNextMultiplier() {
        const delay = Math.random() * 10000 + 10000; // 10-20 seconds
        setTimeout(() => {
            spawnMultiplier();
            scheduleNextMultiplier();
        }, delay);
    }
    
    // Spawn first multiplier after 5 seconds
    setTimeout(() => {
        spawnMultiplier();
        scheduleNextMultiplier();
    }, 5000);
}

// Leaderboard Functions
async function saveToLeaderboard() {
    if (!playerName || !gameStarted) return;
    
    try {
        // Get current leaderboard
        const response = await fetch(JSONBIN_API_URL + '/latest', {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        const data = await response.json();
        let leaderboard = data.record.leaderboard || [];
        
        // Find existing entry or create new one
        const existingIndex = leaderboard.findIndex(entry => entry.name === playerName);
        const tierData = burgerTiers[burgerTier];
        
        const playerData = {
            name: playerName,
            burgers: burgersEaten,
            bites: totalBites,
            tier: burgerTier,
            tierName: tierData.name,
            timestamp: Date.now()
        };
        
        if (existingIndex >= 0) {
            // Update if better score
            if (burgersEaten > leaderboard[existingIndex].burgers) {
                leaderboard[existingIndex] = playerData;
            }
        } else {
            leaderboard.push(playerData);
        }
        
        // Sort by burgers eaten
        leaderboard.sort((a, b) => b.burgers - a.burgers);
        
        // Keep top 100
        leaderboard = leaderboard.slice(0, 100);
        
        // Update JSONBin
        await fetch(JSONBIN_API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ leaderboard })
        });
        
        console.log('Saved to leaderboard!');
    } catch (error) {
        console.error('Failed to save to leaderboard:', error);
    }
}

async function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<p>Loading...</p>';
    
    try {
        const response = await fetch(JSONBIN_API_URL + '/latest', {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        const data = await response.json();
        const leaderboard = data.record.leaderboard || [];
        
        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<p>No entries yet. Be the first!</p>';
            return;
        }
        
        leaderboardList.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            if (index === 0) div.classList.add('top1');
            if (index === 1) div.classList.add('top2');
            if (index === 2) div.classList.add('top3');
            
            const rank = index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`;
            
            div.innerHTML = `
                <span class="leaderboard-rank">${rank}</span>
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-stats">
                    <div>${entry.burgers.toLocaleString()} 🍔</div>
                    <div class="leaderboard-tier">${entry.tierName}</div>
                </span>
            `;
            
            leaderboardList.appendChild(div);
        });
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        leaderboardList.innerHTML = '<p>Failed to load leaderboard. Please try again.</p>';
    }
}
