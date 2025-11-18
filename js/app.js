// Random Webapp - Main JavaScript File

// Quote database
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The only impossible journey is the one you never begin. - Tony Robbins",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb"
];

// Random Number Generator
document.getElementById('generateNum').addEventListener('click', () => {
    const min = parseInt(document.getElementById('minNum').value) || 1;
    const max = parseInt(document.getElementById('maxNum').value) || 100;
    
    if (min >= max) {
        document.getElementById('numberResult').textContent = 'Min must be less than Max!';
        document.getElementById('numberResult').style.color = '#ef4444';
        return;
    }
    
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const resultElement = document.getElementById('numberResult');
    resultElement.textContent = randomNum;
    resultElement.style.color = '#10b981';
});

// Random Color Generator
document.getElementById('generateColor').addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const resultElement = document.getElementById('colorResult');
    const previewElement = document.getElementById('colorPreview');
    
    resultElement.textContent = randomColor.toUpperCase();
    resultElement.style.color = randomColor;
    previewElement.style.backgroundColor = randomColor;
    previewElement.style.display = 'block';
});

// Random Quote Generator
document.getElementById('generateQuote').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const resultElement = document.getElementById('quoteResult');
    
    resultElement.textContent = randomQuote;
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + 1 for random number
    if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        document.getElementById('generateNum').click();
    }
    
    // Ctrl/Cmd + 2 for random color
    if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        document.getElementById('generateColor').click();
    }
    
    // Ctrl/Cmd + 3 for random quote
    if ((event.ctrlKey || event.metaKey) && event.key === '3') {
        event.preventDefault();
        document.getElementById('generateQuote').click();
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log('Random Webapp initialized successfully!');
});
