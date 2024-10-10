import post from "../modules/Post/index.js";
import { Router } from "express";

const postRoutes = Router()

postRoutes.post('/', post.createPost)
postRoutes.delete('/:id', post.deletePost)
postRoutes.put('/:id', post.updatePost)
postRoutes.get('/:user_id/feed', post.getAllPosts)
postRoutes.get('/list/:id', post.getAllPostsById)
postRoutes.put('/:post_id/:user_id/like', post.likePost)
postRoutes.put('/:post_id/:user_id/dislike', post.dislikePost)
postRoutes.put('/:post_id/:user_id/comment', post.commentPost)

export { postRoutes }