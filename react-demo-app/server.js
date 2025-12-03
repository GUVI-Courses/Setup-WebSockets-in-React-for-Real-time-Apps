import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New client:", socket.id);
  socket.emit("message", "Welcome to the WebSocket demo!");
  socket.broadcast.emit("user-joined", socket.id);

  socket.on("message", (data) => {
    console.log("Received:", data);
    io.emit("message", data); // broadcast to all
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(4000, () => console.log("Server running on port 4000"));
