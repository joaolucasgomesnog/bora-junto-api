import express from 'express';
import { routes } from './routes/index.js';
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'http';


import Message from './modules/Message/index.js'; // Importe o controller de mensagens
import Notification from './modules/Notification/index.js'

const PORT = process.env.PORT || 3030;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

app.use(express.json());
app.use(cors({
    origin: "*", // Permite solicitações de qualquer domínio
    methods: "GET,PUT,POST,DELETE", // Métodos permitidos
    optionsSuccessStatus: 204 // Define o status de sucesso para preflight requests para 204
}));

app.use(routes);

app.get("/", (req, res) => {
    return res.json({ status: 'FUNCIONOU HEHEHE' });
});

// Use server.listen instead of app.listen to bind the server
server.listen(PORT, '0.0.0.0', () => {
    console.log('listening on port 3030');
});

io.on("connection", (socket) => {
    console.log('user connected to websocket');
    console.log(socket.id)

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User with ID: ${userId} joined room: ${userId}`);
    });

    socket.on('message', async ({ sender_id, sender_name, receiver_id, content }) => {
        console.log('message received:', sender_id, receiver_id, content);

        try {
            const message = await Message.createMessage(sender_id, receiver_id, content);

            // Emitir a mensagem para ambos os usuários
            io.to(sender_id).emit('message', message);
            io.to(receiver_id).emit('message', message);

            const messages = await Message.fetchAllMessagesByUser(sender_id, receiver_id);
            io.to(sender_id).emit('get_messages', messages);
            io.to(receiver_id).emit('get_messages', messages);

            const {notificationTokens} = await Notification.getNotificationTokenByUserId(receiver_id)

            console.log("KKKKKKKKKKKKKKKKKKK", notificationTokens)
            if (notificationTokens.length > 0) {
                await Promise.all(
                  notificationTokens.map(async (token) => {
                    await Notification.sendPushNotification(token, `${sender_name}: ${content}`);
                  })
                );
                console.log('Notificações enviadas para todos os tokens');
              }
              
            
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Error fetching messages' });
        }
    });

    socket.on('get_messages', async ({ userId, receiverId }) => {
        try {
            const messages = await Message.fetchAllMessagesByUser(userId, receiverId);
            socket.emit('get_messages', messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Error fetching messages' });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

