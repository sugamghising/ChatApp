import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import http from "http"
import connectDB from "./config/db"
import userRouter from "./routes/userRoutes"
import messageRouter from "./routes/messageRoutes"
import { Server } from "socket.io"

dotenv.config();

//express and http setup
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: '*' }
})

//Store onlineUsers
export const userSocketMap: Record<string, string> = {}; //{userId: socketid}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;
    console.log("UserConnected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    //EMit online usres to all connected client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
});


//middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.use("/api/auth", userRouter)
app.use('/api/messages', messageRouter)

connectDB();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//vercel serverless function
export default app;