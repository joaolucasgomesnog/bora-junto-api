import { prisma } from "../../lib/prisma.js"

export default {
    async createMessage(sender_id, receiver_id, content ){
        
        try {
            const new_message = await prisma.message.create({
                data: {
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    content,
                    status: 0,
                }
            })
            return new_message
        } catch (error) {
            console.error('Erro while creating message', error)
            throw new Error('Error while creating messages');
        }
    },

    async getAllMessagesByUser(req, res){
        const {id} = req.params
        const receiver_id = req.query.receiver_id;

        console.log('receiver:',receiver_id)
        console.log('sender:',id)

        try {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            sender_id: id,
                            receiver_id: receiver_id
                        },
                        {
                            sender_id: receiver_id,
                            receiver_id: id
                        }
                    ]
                },
                orderBy: {
                    created_at: 'desc' // or 'desc' for descending order
                }
            });
            console.log(messages)
            return res.json(messages);

        } catch (error) {
            console.error('Erro while getting messages', error)
            res.status(500).json({error: 'Erro while getting messages'})
        }
    },
    async fetchAllMessagesByUser(userId, receiverId) {
        console.log('receiver:', receiverId);
    
        try {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            sender_id: userId,
                            receiver_id: receiverId
                        },
                        {
                            sender_id: receiverId,
                            receiver_id: userId
                        }
                    ]
                },
                orderBy: {
                    created_at: 'desc' // or 'desc' for descending order
                }
            });
            return messages;
        } catch (error) {
            console.error('Error while getting messages', error);
            throw new Error('Error while getting messages');
        }
    },

    async fetchLastMessageWithSenderFlag(req, res) {
        const {id: userId} = req.params
        const receiver_id = req.query.receiver_id;
        console.log("chegouu", userId, receiver_id)

        try {
          // Busca a última mensagem na conversa entre userId e receiverId
          const lastMessage = await prisma.message.findFirst({
            where: {
              OR: [
                {
                  sender_id: userId,
                  receiver_id: receiver_id
                },
                {
                  sender_id: receiver_id,
                  receiver_id: userId
                }
              ]
            },
            orderBy: {
              created_at: 'desc' // Ordena pela data de criação de forma decrescente para obter a última mensagem
            }
          });
    
          // Verifica se a última mensagem foi enviada pelo próprio usuário
          const isSentByUser = lastMessage ? lastMessage.sender_id === userId : false;
    
          console.log("Last", lastMessage, isSentByUser)
          return res.status(200).json({
            lastMessage,
            isSentByUser
          }) 
          
        } catch (error) {
          console.error('Error while getting the last message:', error);
          throw new Error('Error while getting the last message');
        }
      }
    
    
    
  
}