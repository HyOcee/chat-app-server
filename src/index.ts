import "dotenv/config";
import cors from "cors";
import express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { usersRoute } from "./routes/users";
import { authenticateTokenForSocket } from "./auth/authentication";
import mongoose from "mongoose";
import { indexRoute } from "./routes";
import { authRoute } from "./routes/auth";

const port = process.env.PORT;
const app = express();

app.use(express.json());
// app.use(cors());

mongoose.connect(process.env.DB_URL!);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.use((req: any, res: any, next: any) => {
  const error: any = new Error("Not found");
  error["status"] = 404;
  next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const server = http.createServer(app);
const io = new socketio.Server(server, { cors: { origin: "*" } });

io.use((socket: any, next: any) => {
  let user = authenticateTokenForSocket(socket.handshake.auth["token"])
  if (user.username) {
    socket['id'] = user.username
    next();
  } else {
    console.log("unauthorized attempt to connect prevented");
    next(new Error('unauthorized token'));
  }
});

io.on("connection", (socket: any) => {
  console.log(`${socket['id']} connected`);
  console.log(io.allSockets())
  socket.emit("welcome", `Welcome @${socket['id']}`);

  socket.on("sendMessage", (message: string, receiver: string) => {
    console.log(message, receiver, socket.id);
    socket.emit("incomingMessage", message, socket.id, receiver)
    socket.to(receiver).emit("incomingMessage", message, socket.id, receiver)
  });

  socket.on("messageToRoom", (message: string, room: string) => {
    if(room == "") {
      
    } else {
      socket.to(room).emit("messageFromRoom", message)
    }
  })

  socket.on("joinRoom", (room: any)=> {
    socket.join(room)
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(Number(port), "0.0.0.0", () => {
  console.log(`server running on ${port}`);
});
