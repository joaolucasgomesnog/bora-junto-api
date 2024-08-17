
import Message from "../modules/Message/index.js";
import { Router } from "express";

const messageRoutes = Router();

messageRoutes.post("/:id", Message.createMessage)
messageRoutes.get("/list/:id", Message.getAllMessagesByUser)

// messageRoutes.put("/:id", Goal.updateGoal)
// messageRoutes.delete("/:id", Goal.deleteGoalById)
// messageRoutes.delete("/list/:id", Goal.deleteAllGoalsByUser)


export {messageRoutes}