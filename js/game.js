const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const currentScoreElem = document.getElementById('currentScore');
const highScoreElem = document.getElementById('highScore');

// Game state
let gameState = {
  bird: {
    x: 50,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
  },
  pipes: [],
  score: 0,
  highScore: 0,
  gameSpeed: 3,
  isPlaying: false,
  pipeGap: 200,
  lastPipeTime: 0
};

// Game control
let animationFrameId;

class Pipe {
  constructor() {
    this.x = canvas.width;
    this.width = 50;
    this.gap = gameState.pipeGap;
    this.topHeight = Math.random() * (canvas.height - this.gap - 100) + 50;
    this.passed = false;
  }

  draw() {
    // Top pipe with gradient
    const topPipeGradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
    topPipeGradient.addColorStop(0, getCSSVariable('--primary'));
    topPipeGradient.addColorStop(1, getCSSVariable('--secondary'));
    ctx.fillStyle = topPipeGradient;
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    
    // Bottom pipe with gradient
    const bottomPipeGradient = ctx.createLinearGradient(this.x, canvas.height, this.x + this.width, canvas.height);
    bottomPipeGradient.addColorStop(0, getCSSVariable('--secondary'));
    bottomPipeGradient.addColorStop(1, getCSSVariable('--primary'));
    ctx.fillStyle = bottomPipeGradient;
    ctx.fillRect(this.x, this.topHeight + this.gap, this.width, canvas.height - (this.topHeight + this.gap));
  }

  update() {
    this.x -= gameState.gameSpeed;
    return this.x + this.width > 0;
  }
}

function startGame() {
  startScreen.style.display = 'none';
  document.querySelector('.game-over').style.display = 'none';
  gameState = {
    ...gameState,
    bird: { ...gameState.bird, y: 300, velocity: 0 },
    pipes: [],
    score: 0,
    gameSpeed: 3,
    isPlaying: true,
    lastPipeTime: 0
  };
  currentScoreElem.textContent = 0;
  gameLoop();
}

function jump() {
  if (gameState.isPlaying) {
    gameState.bird.velocity = gameState.bird.jump;
  }
}

function updateBird() {
  gameState.bird.velocity += gameState.bird.gravity;
  gameState.bird.y += gameState.bird.velocity;

  // Floor collision
  if (gameState.bird.y + gameState.bird.size > canvas.height) {
    gameOver();
  }
}

function updatePipes() {
  const now = Date.now();
  if (now - gameState.lastPipeTime > 1500) {
    gameState.pipes.push(new Pipe());
    gameState.lastPipeTime = now;
  }

  gameState.pipes = gameState.pipes.filter(pipe => {
    const isActive = pipe.update();
    
    // Score counting
    if (!pipe.passed && pipe.x + pipe.width < gameState.bird.x) {
      pipe.passed = true;
      gameState.score++;
      currentScoreElem.textContent = gameState.score;
      
      // Difficulty progression
      if (gameState.score % 5 === 0) {
        gameState.gameSpeed += 0.3;
        gameState.pipeGap = Math.max(120, gameState.pipeGap - 10);
      }
    }
    
    return isActive;
  });
}

function checkCollision(pipe) {
  const bird = gameState.bird;
  const verticalCollision = 
    bird.y < pipe.topHeight || 
    bird.y + bird.size > pipe.topHeight + pipe.gap;
  const horizontalCollision = 
    bird.x + bird.size > pipe.x && 
    bird.x < pipe.x + pipe.width;

  return verticalCollision && horizontalCollision;
}

function gameOver() {
  gameState.isPlaying = false;
  cancelAnimationFrame(animationFrameId);
  updateHighScore();
  document.querySelector('.game-over').style.display = 'block';
}

function updateHighScore() {
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
  highScoreElem.textContent = `Рекорд: ${gameState.highScore}`;
  document.getElementById('finalScore').textContent = gameState.score;
    localStorage.setItem('flappyHighScore', gameState.highScore);
  }
}

function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawBird() {
  ctx.fillStyle = getCSSVariable('--accent');
  ctx.beginPath();
  ctx.arc(
    gameState.bird.x + gameState.bird.size/2,
    gameState.bird.y + gameState.bird.size/2,
    gameState.bird.size/2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBird();
  updatePipes();

  // Draw elements
  gameState.pipes.forEach(pipe => {
    pipe.draw();
    if (gameState.isPlaying && checkCollision(pipe)) {
      gameOver();
    }
  });
  drawBird();

  if (gameState.isPlaying) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});
canvas.addEventListener('click', jump);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  jump();
});
