import { prisma } from "../../lib/prisma.js";

export default {
  
  async createParticipant(req, res){
    const {user_id, event_id} = req.body
    const event_exists = await prisma.event.findUnique({where: { id: Number(event_id) }});
    const user_exists = await prisma.user.findUnique({where: { id: user_id }});
    
    if(!event_exists && !user_exists){
      res.status(500).json({ error: "Event or User not founds" });
      console.log("Event or User not founds")
      return
    }

    const participant_exists = await prisma.participant.findUnique({
      where: {
        event_id_user_id: {
          event_id: Number(event_id),
          user_id
        }
      }
    });

    if(participant_exists){
      res.status(500).json({ error: "Participant already exists" });
      console.log("Participant already exists")
      return;
    }

    try {
      const participant = await prisma.participant.create({
        data: {
          event_id,
          user_id
        },
      })
      res.json(participant);
    } catch (error) {
      console.error("Erro while deleting event", error);
      res.status(500).json({ error: "Erro while creating a new participant" });
      
    }
  },


  //fazer umas função so para verificar se existe
  async getParticipantById(req, res) {
    const { user_id, event_id } = req.body;
  
    console.log("TESTE", user_id, event_id);
    try {
      const user_exists = await prisma.user.findUnique({
        where: { id: user_id },
      });
  
      const event_exists = await prisma.event.findUnique({
        where: { id: Number(event_id) },
      });
      
      if (!event_exists || !user_exists) {
        res.status(404).json({ error: "Event or User not found" });
        console.log("Event or User not found");
        return;
      }
  
  
      const participant_exists = await prisma.participant.findUnique({
        where: {
          event_id_user_id: {
            event_id: Number(event_id),
            user_id: user_id,
          },
        },
      });
  
      if (participant_exists) {
        console.log("Participant already exists");
        res.json({ participant_already_exists: true });
        return;
      }
  
      res.json({ participant_already_exists: false });
    } catch (error) {
      console.error("Error while checking participant", error);
      res.status(500).json({ error: "Error while checking participant" });
    }
  }
  
  
  
};
