// Capturando o canvas e contexto
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Definindo a posição inicial do jogador
let playerX = 400;
let playerY = 300;
let playerHealth = 100;
const playerSpeed = 5;

// Função para desenhar o jogador
function drawPlayer() {
  context.fillStyle = "green";
  context.fillRect(playerX, playerY, 50, 50);
}

// Tamanho do bloco do cenário
const blockSize = 120;

// Definindo o cenário
const map = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];

// Função para desenhar o cenário
function drawMap() {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tile = map[row][col];
      let color;

      if (tile === 0) {
        color = "yellow"; // Espaço vazio
      } else if (tile === 1) {
        color = "brown"; // Terreno
      }

      const x = col * blockSize;
      const y = row * blockSize;

      context.fillStyle = color;
      context.fillRect(x, y, blockSize, blockSize);
    }
  }
}

// Definir um objeto para representar o monstro
const monster = {
  x: 200,
  y: 150,
  width: 50,
  height: 50,
  speed: 0.5,
  health: 100,
  damage: 10,
};

// Função para desenhar o monstro
function drawMonster() {
  context.fillStyle = "red";
  context.fillRect(monster.x, monster.y, monster.width, monster.height);
}

// Verificar colisão entre dois retângulos
function checkCollision(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) {
    return true; // Colisão detectada
  }
  return false; // Sem colisão
}

// Função para verificar colisão entre o jogador e o terreno
function checkPlayerCollision() {
  const playerRect = {
    x: playerX,
    y: playerY,
    width: 50,
    height: 50,
  };

  let collision = false;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tile = map[row][col];
      if (tile === 1) {
        const tileRect = {
          x: col * blockSize,
          y: row * blockSize,
          width: blockSize,
          height: blockSize,
        };

        if (checkCollision(playerRect, tileRect)) {
          collision = true;
          break;
        }
      }
    }

    if (collision) {
      break;
    }
  }

  return collision;
}

// Função para verificar colisão entre o monstro e o terreno
function checkMonsterCollision() {
  const monsterRect = {
    x: monster.x,
    y: monster.y,
    width: monster.width,
    height: monster.height,
  };

  let collision = false;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tile = map[row][col];
      if (tile === 1) {
        const tileRect = {
          x: col * blockSize,
          y: row * blockSize,
          width: blockSize,
          height: blockSize,
        };

        if (checkCollision(monsterRect, tileRect)) {
          collision = true;
          break;
        }
      }
    }

    if (collision) {
      break;
    }
  }

  return collision;
}

// Função para atualizar o estado do jogo
function update() {
  // Limpar o canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar o cenário
  drawMap();

  // Atualizar posição do monstro
  if (monster.x < playerX) {
    monster.x += monster.speed;
  } else if (monster.x > playerX) {
    monster.x -= monster.speed;
  }

  if (monster.y < playerY) {
    monster.y += monster.speed;
  } else if (monster.y > playerY) {
    monster.y -= monster.speed;
  }

  // Verificar colisão entre jogador e monstro
  const playerRect = {
    x: playerX,
    y: playerY,
    width: 50,
    height: 50,
  };

  const monsterRect = {
    x: monster.x,
    y: monster.y,
    width: monster.width,
    height: monster.height,
  };

  if (checkCollision(playerRect, monsterRect)) {
    if (playerHealth > 0) {
      // O jogador colidiu com o monstro
      // Reduzir a vida do jogador
      playerHealth -= monster.damage;
    }

    if (playerHealth <= 0) {
      // O jogador foi derrotado
      alert("Você foi derrotado!");
      resetGame();
    }
  }

  // Verificar colisão entre jogador e terreno
  if (checkPlayerCollision()) {
    // O jogador colidiu com o terreno, então pare seu movimento
    playerX -= playerSpeed;
    playerY -= playerSpeed;
  }

  // Verificar colisão entre monstro e terreno
  if (checkMonsterCollision()) {
    // O monstro colidiu com o terreno, então inverta sua direção
    monster.speed *= -1;
  }

  // Verificar se o monstro foi derrotado
  if (monster.health <= 0) {
    // O monstro foi derrotado
    // Remover o monstro do jogo
    monster.x = -100;
    monster.y = -100;
  } else {
    // Desenhar o monstro apenas se ele ainda estiver vivo
    drawMonster();
  }

  // Desenhar o jogador
  drawPlayer();

  // Solicitar o próximo frame
  requestAnimationFrame(update);
}

// Função para lidar com eventos de teclado
function handleKeyPress(event) {
  const key = event.key;

  // Copiar a posição atual do jogador
  let newPlayerX = playerX;
  let newPlayerY = playerY;

  if (key === "ArrowUp") {
    newPlayerY -= 10;
  } else if (key === "ArrowDown") {
    newPlayerY += 10;
  } else if (key === "ArrowLeft") {
    newPlayerX -= 10;
  } else if (key === "ArrowRight") {
    newPlayerX += 10;
  } else if (key === " ") {
    // Tecla Space representa o ataque do jogador

    // Verificar se o jogador está próximo o suficiente para atacar o monstro
    const attackRange = 70;
    const distanceX = Math.abs(playerX - monster.x);
    const distanceY = Math.abs(playerY - monster.y);

    if (distanceX <= attackRange && distanceY <= attackRange) {
      // O jogador está próximo o suficiente para atacar
      // Reduzir a vida do monstro
      monster.health -= 20;

      if (monster.health <= 0) {
        // O monstro foi derrotado
        alert("Você derrotou o monstro!");
        resetGame();
      }
    }
  }

  // Verificar colisão entre o jogador e o terreno após o movimento
  const playerRect = {
    x: newPlayerX,
    y: newPlayerY,
    width: 50,
    height: 50,
  };

  let collision = false;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tile = map[row][col];
      if (tile === 1) {
        const tileRect = {
          x: col * blockSize,
          y: row * blockSize,
          width: blockSize,
          height: blockSize,
        };

        if (checkCollision(playerRect, tileRect)) {
          collision = true;
          break;
        }
      }
    }

    if (collision) {
      break;
    }
  }

  // Atualizar a posição do jogador se não houver colisão
  if (!collision) {
    playerX = newPlayerX;
    playerY = newPlayerY;
  }
}

// Adicionar um ouvinte de eventos de teclado
document.addEventListener("keydown", handleKeyPress);

// Iniciar o jogo chamando a função update()
update();
