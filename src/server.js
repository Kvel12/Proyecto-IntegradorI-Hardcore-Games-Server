"use strict";

const { Server } = require("socket.io");

const clientURLLocalhost = "http://localhost:3000";
const clientUrlDeploy = "https://sphere-websockets-r3f-client.vercel.app";

const port = process.env.PORT || 8080;

const io = new Server({
  cors: {
    origin: [clientURLLocalhost, clientUrlDeploy],
  },
});

io.listen(port);

let gameState = {
  platforms: {
    platform5: false,
    rest: false
  },
  keys: {
    Key1: true,
    Key2: true
  },
  apples: {
    apple1: true,
    apple2: true
  },
  stars: {
    Start1: true,
    Start2: true,
    Start3: true
  },
  playersTouchingFlag: {
    player1: false,
    player2: false
  }
};

io.on("connection", (socket) => {
  console.log(
    "Player joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " players connected."
  );

  // Enviar el estado actual del juego al nuevo jugador
  socket.emit('game-state', gameState);
  console.log("Sent initial game state to player:", socket.id);

  socket.on("player-moving", (transforms) => {
    socket.broadcast.emit("player-moving", transforms);
  });

  socket.on('unlock-platform', (key) => {
    console.log("Unlocking platform for key:", key);
    
    if (key === 'Key1') {
      gameState.platforms.platform5 = true;
      gameState.keys.Key1 = false;
    } else if (key === 'Key2') {
      gameState.platforms.rest = true;
      gameState.keys.Key2 = false;
    }

    console.log("Updated game state:", gameState);
    io.emit('update-game-state', gameState);
  });

  socket.on('collect-apple', (apple) => {
    console.log("Collecting apple:", apple);
    gameState.apples[apple] = false;
    io.emit('update-game-state', gameState);
  });

  socket.on('collect-star', (star) => {
    console.log("Collecting star:", star);
    if (gameState.stars[star] !== undefined) {
      gameState.stars[star] = false;
      console.log("Updated stars state:", gameState.stars);
      io.emit('update-game-state', gameState);
    } else {
      console.log("Error: Star not found in gameState:", star);
    }
  });

  socket.on("disconnect", () => {
    console.log(
      "Player disconnected with ID",
      socket.id,
      ". There are " + io.engine.clientsCount + " players connected"
    );
  });
});