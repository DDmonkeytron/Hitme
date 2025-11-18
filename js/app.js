// Burger Clicker Game

// Game state
let totalBites = 0;
let burgersEaten = 0;
let currentBurgerBites = 0;
const BITES_PER_BURGER = 10;

// DOM elements
const burger = document.getElementById('burger');
const totalBitesEl = document.getElementById('totalBites');
const burgersEatenEl = document.getElementById('burgersEaten');
const currentBitesEl = document.getElementById('currentBites');
const clickMessage = document.getElementById('clickMessage');
const celebration = document.getElementById('celebration');

// Update display
function updateStats() {
    totalBitesEl.textContent = totalBites;
    burgersEatenEl.textContent = burgersEaten;
    currentBitesEl.textContent = `${currentBurgerBites} / ${BITES_PER_BURGER}`;
}

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
    totalBites++;
    currentBurgerBites++;
    
    // Add bite animation
    burger.classList.add('bite');
    setTimeout(() => {
        burger.classList.remove('bite');
    }, 200);
    
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
});
