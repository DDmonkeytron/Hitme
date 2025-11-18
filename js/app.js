// Burger Clicker Game

// Game state
let totalBites = 0;
let burgersEaten = 0;
let currentBurgerBites = 0;
const BITES_PER_BURGER = 10;
let currentMultiplier = 1;
let activeMultipliers = [];
let multiplierSpawnInterval;

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
    totalBitesEl.textContent = totalBites;
    burgersEatenEl.textContent = burgersEaten;
    currentBitesEl.textContent = `${currentBurgerBites} / ${BITES_PER_BURGER}`;
    multiplierValueEl.textContent = `${currentMultiplier}x`;
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
    burger.style.transform = 'scale(0) rotate(360deg)';
    burger.style.transition = 'all 0.5s ease';
    
    celebration.textContent = '🎉 BURGER EATEN! 🎉';
    celebration.classList.add('show');
    
    playCelebrationSound();
    
    setTimeout(() => {
        celebration.classList.remove('show');
        
        // Reset burger
        burger.style.opacity = '1';
        burger.style.transform = 'scale(1) rotate(0deg)';
        currentBurgerBites = 0;
        updateStats();
    }, 1000);
}

// Take a bite
function takeBite(event) {
    const bitesToAdd = currentMultiplier;
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
    if (totalBites === 1) {
        clickMessage.style.display = 'none';
    }
    
    // Check if burger is finished
    if (currentBurgerBites >= BITES_PER_BURGER) {
        burgersEaten++;
        eatBurger();
    } else {
        // Scale down burger slightly with each bite
        const scale = 1 - (currentBurgerBites / BITES_PER_BURGER) * 0.3;
        burger.style.transform = `scale(${scale})`;
    }
}

// Event listener
burger.addEventListener('click', takeBite);

// Keyboard shortcut (spacebar)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        const rect = burger.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        takeBite({ clientX: centerX, clientY: centerY });
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    console.log('🍔 Burger Clicker initialized! Click the burger to eat!');
    updateStats();
    
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
});
