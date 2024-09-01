import { prisma } from "../../lib/prisma.js";

export default {
  async createChallenge(req, res) {
    let challenge_id = 0
    const {
      title,
      description,
      challenge_date,
      user_id,
      privacy_id,
      category_id,
      address,
      latitude,
      longitude
    } = req.body;
    console.log("TESTE",user_id)
    try {
      const challenge = await prisma.challenge.create({
        data: {
          title,
          description,
          challenge_date,
          user: {
            connect: {
              id: user_id,
            },
          },
          privacy: {
            connect: {
              id: privacy_id,
            },
          },
          challengeCategory: {
            connect: {
              id: category_id,
            },
          },
          location: {
            create: {
              address: address,
              latitude: latitude,
              longitude: longitude
            },
          }

        },
      });
      res.json(challenge);
      challenge_id = challenge.id
    } catch (error) {
      console.error("Erro while creating challenge", error);
      res.status(500).json({ error: "Erro while creating challenge" });
    }
    try {
      const participant = await prisma.participant.create({
        data: {
          challenge_id,
          user_id
        },
      })
      res.json(participant);
    } catch (error) {
      console.error("Erro while creating participant", error);
      res.status(500).json({ error: "Erro while creating a new participant" });
      
    }
  },
  async deleteChallenge(req, res) {
    const { id } = req.params;
    const challenge_id = parseInt(id);
    const challenge_exists = await prisma.challenge.findMany({ where: { id: challenge_id } });
    if (!challenge_exists) {
      res.status(500).json({ erro: "Challenge not found" });
    }
    try {
      const deleted_challenge = await prisma.challenge.delete({
        where: {
          id: challenge_id,
        },
      });
      res.json(deleted_challenge);
    } catch (error) {
      console.error("Erro while deleting challenge", error);
      res.status(500).json({ erro: "Erro while deleting challenge", error });
    }
  },


  async updateChallenge(req, res) {
    console.log(" UPDATE");
    const { id } = req.params;

    const challenge_id = parseInt(id);

    const {
      title,
      description,
      challenge_date,
      user_id,
      privacy_id,
      category_id,
      address,
      latitude,
      longitude
    } = req.body;

    const challenge_exists = await prisma.challenge.findUnique({
      where: { id: challenge_id },
    });
    if (!challenge_exists) {
      res.status(500).json({ erro: "Challenge not found" });
    }

    try {
      const updated_challenge = await prisma.challenge.update({
        where: {
          id: challenge_id,
        },
        data: {
          title,
          description,
          challenge_date,
          user: {
            connect: {
              id: user_id,
            },
          },
          privacy: {
            connect: {
              id: privacy_id,
            },
          },
          challengeCategory: {
            connect: {
              id: category_id,
            },
          },
          location: {
            create: {
              address: address,
              latitude: latitude,
              longitude: longitude
            },
          }

        },
      });
      res.json(updated_challenge);
    } catch (error) {
      console.error("Erro while updating challenge", error);
      res.status(500).json({ erro: "Erro while updating challenge", error });
    }
  },
  async findChallengeById(req, res) {
    try {
      const { id } = req.params;
      const challenge = await prisma.challenge.findUnique({
        where: { id: Number(id), include: { location: true, privacy: true } },
      });
      if (!challenge) return res.json({ error: "Challenge does not exist" });
      return res.json(challenge);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllChallengesByUser(req, res) {
    try {
      const { id } = req.params;
      const challenge = await prisma.challenge.findMany({
        where: { user_id: id },
        include: { location: true, privacy: true },
      });
      if (!challenge) return res.json({ error: "Challenge does not exist" });
      return res.json(challenge);
    } catch (error) {
      return res.json({ error });
    }
  },

  async findAllChallengesByPrivacy(req, res) {
    try {
      const { id } = req.params;
      const challenge = await prisma.challenge.findMany({
        where: {
          privacy_id: Number(id),
          include: { location: true, privacy: true },
        },
      });
      if (!challenge) return res.json({ error: "Challenge does not exist" });
      return res.json(challenge);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllChallenges(req, res) {
    //erro de segurança, futuramente esse método vai ser alterado, por enquanto é só pra ir testando o mapa
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const challenge = await prisma.challenge.findMany({
        include: { 
          location: true, 
          privacy: true, 
          challengeCategory: true, 
          user: {
            select: {
              name: true,
              profile_pic_url: true,
              
            }
          },
          _count: {
            select: {
              Participant: true
            }
          }
        },
        where:{
          challenge_date: {
            gte: startOfDay
          }
        }

      }); //apenas simulação, no futuro vai ser pego somente public e friends-only
      if (!challenge) return res.json({ error: "Challenge does not exist" });
      return res.json(challenge);
    } catch (error) {
      return res.json({ error });
    }
  },


  async findAllChallengesByDate(req, res) {
    const { date } = req.params;
    const user_id  = req.query.user_id;

    // Parse the date string to create a Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Set the start and end of the day in UTC
    const startOfDay = new Date(dateObj);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateObj);
    endOfDay.setUTCHours(23, 59, 59, 999);

    try {
      // Fetch challenges within the start and end of the day
      const challenges = await prisma.challenge.findMany({
        where: {
          user_id,
          challenge_date: {
            gte: startOfDay,
            lte: endOfDay,
          },

        },
        include:{
          location:true,
          user: {
            select: {
              name: true,
              profile_pic_url: true,
              
            }
          },
          _count: {
            select: {
              Participant: true
            }
          }
        },
        
      });

      const participantChallenges = await prisma.participant.findMany({
        where: {
          user_id,
          challenge: {
            challenge_date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            user_id: {
              not: user_id
            }
          },
        },
        include: {
          challenge: {
            include: {
              location: true,
              user: {
                select:{
                  username:true,
                  name:true,
                  profile_pic_url:true
                }
              },
              _count: {
                select: {
                  Participant: true
                }
              }

            },
          },

        },
      });
  
      // Combine both sets of challenges
      const allChallenges = [
        ...challenges,
        ...participantChallenges.map(participant => participant.challenge),
      ];

      if (!allChallenges || allChallenges.length === 0) {
        return res.json({ error: "No challenges found for this date" });
      }

      return res.json(allChallenges);
    } catch (error) {
      console.log('Error while processing challenges')
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  async findAllCategories(req, res) {
    try {
      const categories = await prisma.challengeCategory.findMany();
      if (!categories) return res.json({ error: "No categories" });
      return res.json(categories);
    } catch (error) {
      return res.json({ error });
    }
  },
};
