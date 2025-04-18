let secretNumber = Math.floor(Math.random() * 100) + 1;
let attemptsLeft = 5;
let score = 0;

const guessBtn = document.getElementById("guess-btn");
const input = document.getElementById("guess-input");
const message = document.getElementById("message");
const cluesList = document.getElementById("clues");
const attemptsText = document.getElementById("attempts");
const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

// Sound effects
const sound = {
  win: new Audio("win.mp3"),
  fail: new Audio("fail.mp3"),
  click: new Audio("click.mp3"),
  guess: new Audio("guess.mp3")
};

// Handle guess button click
guessBtn.addEventListener("click", () => {
  sound.click.play();
  const guess = parseInt(input.value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    message.textContent = "❗ Enter a number between 1 and 100.";
    return;
  }

  sound.guess.play();
  attemptsLeft--;
  attemptsText.textContent = attemptsLeft;

  if (guess === secretNumber) {
    message.textContent = "🎉 You guessed it!";
    score += attemptsLeft * 10;
    scoreText.textContent = score;
    showClues([]);
    winGame();
    return;
  }

  message.textContent = guess < secretNumber ? "📉 Too low!" : "📈 Too high!";
  showClues(generateClues(secretNumber));

  if (attemptsLeft === 0) {
    message.textContent = `💀 Game over! The number was ${secretNumber}.`;
    loseGame();
  }
});

function winGame() {
  input.disabled = true;
  guessBtn.disabled = true;
  restartBtn.style.display = "block";
  sound.win.play();
  launchConfetti();
}

function loseGame() {
  input.disabled = true;
  guessBtn.disabled = true;
  restartBtn.style.display = "block";
  sound.fail.play();
}

// Restart button
restartBtn.addEventListener("click", () => {
  location.reload();
});

// Clue generator
function generateClues(num) {
  let clues = [];

  if (num % 2 === 0) clues.push("It's an even number.");
  else clues.push("It's an odd number.");

  if (num % 3 === 0) clues.push("It's divisible by 3.");
  if (num % 5 === 0) clues.push("It's divisible by 5.");
  if (num % 7 === 0) clues.push("It's divisible by 7.");

  if (num < 25) clues.push("It's in the lower quarter.");
  else if (num <= 50) clues.push("It's between 26 and 50.");
  else if (num <= 75) clues.push("It's between 51 and 75.");
  else clues.push("It's in the top quarter.");

  if (num >= 90) clues.push("You're close to 100!");
  if (num.toString()[0] === '1') clues.push("It starts with 1.");
  if (num.toString().endsWith('0')) clues.push("It ends in 0.");

  return shuffle(clues).slice(0, 2); // return 2 random clues
}

// Display clues
function showClues(clues) {
  cluesList.innerHTML = "";
  clues.forEach(clue => {
    const li = document.createElement("li");
    li.textContent = "🔍 " + clue;
    cluesList.appendChild(li);
  });
}

// Shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Confetti effect 🎉
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      speed: Math.random() * 3 + 2,
      radius: Math.random() * 6 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.y += p.speed;
      if (p.y > canvas.height) p.y = 0;
    });
  }

  function animate() {
    draw();
    update();
    requestAnimationFrame(animate);
  }

  animate();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 4000);
}
