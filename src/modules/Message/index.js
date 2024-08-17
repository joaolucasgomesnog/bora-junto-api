import { prisma } from "../../lib/prisma.js"

export default {
    async createMessage(sender_id, receiver_id, content ){
        // const { sender_id, receiver_id, content } = message
        console.log('ççççç')
        console.log(sender_id, receiver_id, content)
        console.log('ççççç')
        
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
    // async createMessage(req, res){
    //     const { sender_id, receiver_id, content, status } = req.body
    //     console.log(sender_id, receiver_id, content)
        
    //     try {
    //         const new_message = await prisma.message.create({
    //             data: {
    //                 sender_id: parseInt(sender_id),
    //                 receiver_id: parseInt(receiver_id),
    //                 content,
    //                 status: 0,
    //             }
    //         })
    //         return res.json(new_message)
    //     } catch (error) {
    //         console.error('Erro while creating message', error)
    //         res.status(500).json({error: 'Erro while creating message'})        
    //     }
    // },
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
    }
    
    
    
  
}