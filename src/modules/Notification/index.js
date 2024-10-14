import { prisma } from "../../lib/prisma.js";
import PushNotification from '../PushNotification/index.js'

// Função para criar uma notificação

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
      return newNotification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  },
  
  // Função para obter todas as notificações por userId
  async getAllNotificationsByUserId(req, res) {
    try {
      const {id} = req.params

      const notifications = await prisma.notification.findMany({
        where: { userId: id },
        include: {
          Post: {
            select: {
              id: true,          // Selecionar apenas o ID do post
              description: true, // Selecionar a descrição do post
              media_url: true,   // Selecionar a URL da mídia (se aplicável)
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
        orderBy: { created_at: 'desc' }, // Ordenar pela mais recente
      });
      
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Erro ao obter notificações:', error);
      throw error;
    }
  },
  
  // Função para deletar todas as notificações por userId
  async deleteAllNotificationsByUserId(req, res) {
    try {
      const {id} = req.params

      const deleteCount = await prisma.notification.deleteMany({
        where: { userId: id },
      });
      return deleteCount;
    } catch (error) {
      console.error('Erro ao deletar notificações:', error);
      throw error;
    }
  }

}

