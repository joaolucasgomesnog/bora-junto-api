import { prisma } from "../../lib/prisma.js";

export default {
  async createSolicitation(req, res) {
    let solicitation_id = 0;
    const {
      sender_id,
  receiver_id,
  challenge_id,
  following_id,
  event_id
    } = req.body;
    console.log("TESTE", sender_id);
    try {
      const solicitation = await prisma.solicitation.create({
        data: {
          sender: {
            connect: {
              id: sender_id,
            },
          },
          receiver: {
            connect: {
              id: receiver_id,
            },
          },
          challenge: {
            connect: {
              id: challenge_id,
            },
          },
          event: {
            connect: {
              id: event_id,
            },
          },
          following: {
            connect: {
              id: following_id,
            },
          },
        },
      });
      res.json(solicitation);
      solicitation_id = solicitation.id;
    } catch (error) {
      console.error("Erro while creating solicitation", error);
      res.status(500).json({ error: "Erro while creating solicitation" });
    }
  },
  async deleteSolicitation(req, res) {
    const { id } = req.params;
    const solicitation_id = parseInt(id);
    const solicitation_exists = await prisma.solicitation.findMany({
      where: { id: solicitation_id },
    });
    if (!solicitation_exists) {
      res.status(500).json({ erro: "Solicitation not found" });
    }
    try {
      const deleted_solicitation = await prisma.solicitation.delete({
        where: {
          id: solicitation_id,
        },
      });
      res.json(deleted_solicitation);
    } catch (error) {
      console.error("Erro while deleting solicitation", error);
      res.status(500).json({ erro: "Erro while deleting solicitation", error });
    }
  },

  async findSolicitationById(req, res) {
    try {
      const { id } = req.params;
      const solicitation = await prisma.solicitation.findUnique({
        where: { id: Number(id) },
      });
      if (!solicitation) return res.json({ error: "Solicitation does not exist" });
      return res.json(solicitation);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllSolicitationsByReceiver(req, res) {
    try {
      const { id } = req.params;
      console.log("jjjjjjjjjjjjj", id)

      const solicitations = await prisma.solicitation.findMany({
        where: { receiver_id: id },
        include:{
          sender:{
            select:{
              username: true,
              name:true,
              profile_pic_url:true
            }
          },
          challenge:{
            select:{
              title:true
            }
          },
          event:{
            select:{
              title:true
            }
          },
        }
      });

      return res.json(solicitations);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllSolicitationsBySender(req, res) {
    try {
      const { id } = req.params;
      console.log("jjjjjjjjjjjjj", id)

      const solicitations = await prisma.solicitation.findMany({
        where: { sender_id: id },
      });

      return res.json(solicitations);
    } catch (error) {
      return res.json({ error });
    }
  },

};
