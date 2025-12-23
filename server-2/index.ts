import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

import mssgRoutes from './routes/message.route';
import convRoutes from './routes/conversation.route';

import { dbConnection } from './db';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

dbConnection();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/conversation', convRoutes);
app.use('/api/message', mssgRoutes);

io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_conversation', (conversationId: string) => {
        socket.join(conversationId);
        console.log(`${socket.id} joined conversation: ${conversationId}`);
    });

    socket.on('send_message', (data: { conversationId: string; message: unknown }) => {
        console.log(`Message to ${data.conversationId}:`, data.message);
        io.to(data.conversationId).emit('new_message', data.message);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
