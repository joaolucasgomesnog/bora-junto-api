
import user from "../modules/User/index.js";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/", user.createUser)
userRoutes.get("/list", user.findAllUsers)
userRoutes.get("/list/filter", user.filterAllUsers)
// userRoutes.get("/list/id", user.fidUserIdByEmail)
userRoutes.get("/:id", user.findUserById)
userRoutes.get("/username/:username", user.findUserByUserName)
userRoutes.put("/:id", user.updateUser)
userRoutes.delete("/:id", user.deleteUserById)

userRoutes.get("/contact/list/:user_id", user.getContactListByUserId)
userRoutes.put("/contact/:user_id", user.setContactToUser)


export {userRoutes}