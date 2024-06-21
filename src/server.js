// server.js
"use strict";
const { Server } = require("socket.io");

const clientURLLocalhost = "http://localhost:3000";
const clientUrlDeploy = "https://proyecto-integrador-i-hardcore-games.vercel.app/";
const port = 8080;

const io = new Server({
  cors: {
    origin: [clientURLLocalhost, clientUrlDeploy],
  },
});

io.listen(port);

io.on("connection", (socket) => {
  console.log("Player joined with ID", socket.id, ". There are " + io.engine.clientsCount + " players connected.");

  // Emitir el ID del jugador al cliente para que lo use como identificador
  socket.emit("assign-id", socket.id);

  socket.on("player-moving", (transforms) => {
    // Transmitir los movimientos del jugador a todos los otros clientes
    socket.broadcast.emit("player-moving", { playerId: socket.id, transforms });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected with ID", socket.id, ". There are " + io.engine.clientsCount + " players connected");
  });
});
