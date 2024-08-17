// import { prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export default {
  async createUser(req, res) {
    const {
      id,
      name,
      username,
      user_category_id,
      profile_pic_url,
      phone,
      email,
      location_id,
    } = req.body;
    console.log(
      "usuario no create",
      name,
      username,
      user_category_id,
      profile_pic_url,
      phone,
      email,
    );
    console.log("usuario", username);

    try {
      const user = await prisma.user.create({
        data: {
          id,
          name,
          username,
          email,
          phone,
          user_category_id: parseInt(user_category_id),
          profile_pic_url,
          location_id,

        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error while creating user:", error);
      res.status(500).json({ error: "Error while creating user" });
    }
  },

  async getContactListByUserId(req, res) {
    const {user_id} = req.params;
    console.log("ID", user_id)
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: user_id,
        },
        include: {
          contact: true,
          user_category:true
           
        },
      });
  
      if (!user) {
        
        console.error("user not found");
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user.contact);
    } catch (error) {
      console.error("Error while getting contacts:", error);
      res.status(500).json({ error: "Error while getting contacts" });
    }
  },
  
  async setContactToUser(req, res){
    const { user_id } = req.params;
    const { contact_id } = req.body;

    console.log("UPDATE", contact_id, user_id)
  
    try {
      // Verificar se o usuário e o contato existem
      const user = await prisma.user.findUnique({ where: { id: user_id } });
      const contact = await prisma.user.findUnique({ where: { id: contact_id } });
  
      if (!user || !contact) {
        return res.status(404).json({ error: "User or contact not found" });
      }
  
      // Adicionar o contato à lista de contatos do usuário
      const updatedUser = await prisma.user.update({
        where: { id: user_id },
        data: {
          contact: {
            connect: { id: contact_id },
          },
        },
        include: {
          contact: true,// Inclui a lista atualizada de contatos na resposta
          user_category:true          },
      });
  
      res.json(updatedUser.contacts);
    } catch (error) {
      console.error("Error while adding contact:", error);
      res.status(500).json({ error: "Error while adding contact" });
    }

  },

  async findAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  },

  async filterAllUsers(req, res){
    const {query} = req.query
    console.log("QUERY", query)
    try {
      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: query,
            mode: "insensitive",
          }
          
        },
        include: {
          user_category:true
        }
      })
      console.log("USER FILTERED", users)
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error})
    }
  },

  async findUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id }, include: {user_category: true}});
      if (!user) return res.json({ error: "User does not exist" });
      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },

  async findUserByUserName(req, res) {
    try {
      const { username } = req.params;
      const users = await prisma.$queryRaw`
            SELECT * FROM "User"
            WHERE LOWER("username") LIKE ${`%${username.toLowerCase()}%`}            
        `;

      if (!users || users.length === 0) {
        return res.json({ error: "User does not exist" });
      }

      return res.json(users);
    } catch (error) {
      console.error("Error while searching for users.", error);
      return res
        .status(500)
        .json({ error: "Error while searching for users." });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const {
        name,
        username,
        user_category,
        phone,
        email,
        birth_date,
      } = req.body;

      let user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: "User does not exist" });

      user = await prisma.user.update({
        where: { id },
        data: {
          name,
          username,
          email,
          phone,
          birth_date,
        },
      });
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "It was not possible to update user" });
    }
  },

  async findFollowersByUser(req, res) {
    try {
      const { id } = req.params;
      const followers = await prisma.following.findMany({
        where: { following: Number(id) },
        include: { follower: true },
      });
      return res.json(followers);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findFollowingByUser(req, res) {
    try {
      const { id } = req.params;
      const following = await prisma.following.findMany({
        where: { follower: Number(id) },
        include: { following: true },
      });
      return res.json(following);
    } catch (error) {
      return res.json({ error });
    }
  },

  async deleteUserById(req, res) {
    try {
      const { id } = req.params;
      let user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.json({ error: "User does not exist" });
      await prisma.user.delete({ where: { id: Number(id) } });
      return res.json({ message: "User deleted" });
    } catch (error) {
      return res.json({ error });
    }
  },
};
