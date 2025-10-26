const canvas = document.getElementById("myCanvas");         //знаходимо елемент <canvas> із HTML і зберігаємо його у змінній canvas
const ctx = canvas.getContext("2d");

//Параметри для цеглинок
const brickRowCount = 3;
const brickColumnCount = 17;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//Параметри для м'яча
let x = canvas.width / 2;
let y = canvas.height - 30;
ctx.fillStyle = "#ef0f9dff";
let dx = -2;
let dy = -3;
let lives = 3;

//Ракетка
const paddleHeight = 10;         //висота ракетки           
const paddleWidth = 75;         //ширина ракетки  
let paddleX = (canvas.width - paddleWidth) / 2; //початкова позиція ракетки по осі X

//Керування ракеткою
let rightPressed = false;
let leftPressed = false;

let interval = 0;       //інтервал для оновлення кадрів

const ballRadius = 10;

//Створення масиву цеглинок
let bricks = [];

//Рахунок
let score = 0;

//Обробники подій для натискання клавіш
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

//Ініціалізація масиву цеглинок
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//Функція для малювання цеглинок
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#cb107aff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


//Функція для виявлення зіткнень м'яча з цеглинками
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("ВИ ПЕРЕМОГЛИ, ВІТАЄМО!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

//Функція для малювання рахунку
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#efef14ff";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

//Функція для малювання життів
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#c9f41dff";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

//Функція для малювання м'яча
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#1e9cf1ff";
  ctx.fill();
  ctx.closePath();
}

//Функція для малювання ракетки
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#05b05dff";
  ctx.fill();
  ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();       //малюємо цеглинки
    drawBall();         //малюємо м'яч
    drawPaddle();      //малюємо ракетку
    drawScore();       //малюємо рахунок
    drawLives();       //малюємо життя
    collisionDetection(); //перевіряємо зіткнення м'яча з цеглинками
    //Рух м'яча
    x += dx;
    y += dy;
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        ctx.fillStyle = "#c2ef0fff";
        dx = -dx;
    }
    if (y + dy < ballRadius) 
    {
      dy = -dy;
    } 
    else if (y + dy > canvas.height - ballRadius) 
    {
      if (x > paddleX && x < paddleX + paddleWidth) 
      {
        dy = -dy;
      } 
      else 
      {
        lives--;
        if (!lives) {
          alert("GAME OVER");
          document.location.reload();
          clearInterval(interval); // Needed for Chrome to end game
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
      }

      }
    }
    //Рух ракетки
    if (rightPressed) {
      paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
      paddleX = Math.max(paddleX - 7, 0);
    }

}

function startGame() {
  interval = setInterval(draw, 10);
}

//Функція обробки натискання клавіш
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

//Функція обробки відпускання клавіш
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

//Функція обробки руху миші
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//Обробник події для кнопки "Run"
const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});


