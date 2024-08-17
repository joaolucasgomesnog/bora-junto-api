import post from "../modules/Post/index.js";
import { Router } from "express";

const postRoutes = Router()

postRoutes.post('/', post.createPost)
postRoutes.delete('/:id', post.deletePost)
postRoutes.put('/:id', post.updatePost)
postRoutes.get('/list', post.getAllPosts)
postRoutes.get('/list/:id', post.getAllPostsById)

export { postRoutes }