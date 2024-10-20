import { prisma } from "../../lib/prisma.js";
import Notification from "../PushNotification/index.js";

// Função para criar uma notificação

let notificationQueue = {}; // Fila de notificações por usuário
let notificationTimeouts = {}; // Timer para cada usuário

const NOTIFICATION_DELAY = 120000; // 1 minuto para agrupar as notificações
const MAX_NOTIFICATIONS_BEFORE_GROUP = 3; // Número máximo de notificações antes de agrupar


export default {
  async createNotification(type, userId, triggeredById, postId = null) {
    try {
      const newNotification = await prisma.notification.create({
        data: {
          type,
          userId,
          triggeredById,
          postId, // postId é opcional, apenas para curtidas/comentários
        },
      });
  
      const { username: sender_name } = await prisma.user.findUnique({
        where: { id: triggeredById },
        select: { username: true }
      });
  
      let notificationMessage = `${sender_name} você tem novas atualizações`;
  
      if (newNotification.type === 'like') {
        notificationMessage = `${sender_name} curtiu sua publicação`;
      } else if (newNotification.type === 'comment') {
        notificationMessage = `${sender_name} comentou sua publicação`;
      } else if (following_id) {
        notificationMessage = `${sender_name} começou a te seguir`;
      }
  
      // Adiciona notificação na fila do usuário
      if (!notificationQueue[userId]) {
        notificationQueue[userId] = [];
      }
  
      notificationQueue[userId].push(notificationMessage);
  
      // Se for a primeira notificação ou poucas notificações, envia imediatamente
      if (notificationQueue[userId].length <= MAX_NOTIFICATIONS_BEFORE_GROUP) {
        Notification.sendImmediateNotification(userId, notificationMessage);
      } else {
        // Se atingir o limite, agrupar notificações
        if (notificationTimeouts[userId]) {
          clearTimeout(notificationTimeouts[userId]);
        }
  
        // Configura o timer para enviar a notificação agrupada após um tempo
        notificationTimeouts[userId] = setTimeout(() => {
          Notification.sendGroupedNotification(userId, notificationQueue, notificationTimeouts);
        }, NOTIFICATION_DELAY);
      }
  
      return newNotification;
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw error;
    }
  },

  // Função para obter todas as notificações por userId
  async getAllNotificationsByUserId(req, res) {
    try {
      const { id } = req.params;

      const notifications = await prisma.notification.findMany({
        where: { userId: id },
        include: {
          Post: {
            select: {
              id: true, // Selecionar apenas o ID do post
              description: true, // Selecionar a descrição do post
              media_url: true, // Selecionar a URL da mídia (se aplicável)
            },
          },
          triggeredBy: {
            select: {
              id: true,
              username: true,
              profile_pic_url: true,
            },
          },
        },
        orderBy: { created_at: "desc" }, // Ordenar pela mais recente
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Erro ao obter notificações:", error);
      throw error;
    }
  },

  // Função para deletar todas as notificações por userId
  async deleteAllNotificationsByUserId(req, res) {
    try {
      const { id } = req.params;

      const deleteCount = await prisma.notification.deleteMany({
        where: { userId: id },
      });
      return deleteCount;
    } catch (error) {
      console.error("Erro ao deletar notificações:", error);
      throw error;
    }
  },
};
