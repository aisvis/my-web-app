function loadHighScore() {
  try {
    const savedScore = localStorage.getItem('flappyHighScore');
    return savedScore ? parseInt(savedScore) : 0;
  } catch (e) {
    console.error('LocalStorage error:', e);
    return 0;
  }
}

const highScoreElem = document.getElementById('highScore');

function initializeGame() {
  gameState.highScore = loadHighScore();
  highScoreElem.textContent = `Рекорд: ${gameState.highScore}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);
