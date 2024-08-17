
import { prisma } from "../../lib/prisma.js";

export default { 

    async createPost(req, res){
        const { description, media_url} = req.body
        try {
            const user = await prisma.post.create({
                data: {
                    description,
                    media_url,
                }
            })
            res.json(user)
        } catch (error) {
            console.error('Erro while creating post', error)
            res.status(500).json({error: 'Erro while creating post'})
        }

    },
    async deletePost(req, res){
        const {id} = req.params
        const post_id = parseInt(id)
        try {
            
            const deleted_post = await prisma.post.delete({
                where: {
                    id: post_id
                }
            })
            res.json(deleted_post)
        } catch (error) {
            console.error('Erro while creating post', error)
            res.status(500).json({erro: 'Erro while deleting post', error})
        }

    },
    async updatePost(req, res){
        const {id} = req.params
        const {description} = req.body
        const post_id = parseInt(id)

        try {
            const updated_post = await prisma.post.update({
                where: {
                    id: post_id,

                },
                data: {
                    description,
                }
            })
            res.json(updated_post)
        } catch (error) {
            console.error('Erro while creating post', error)
            res.status(500).json({erro: 'Erro while updating post', error})
        }


    },
    async getAllPosts(req, res){
        try {
            const all_posts = await prisma.post.findMany({include: {User: {select: {username:true, profile_pic_url:true,name:true}}}})
            res.json(all_posts)
        } catch (error) {
            console.error('Erro while creating post', error)
            res.status(500).json({erro: 'Erro while updating post', error})
        }
    },
    async getAllPostsById(req, res){
        const {id} = req.params
        const post_id = parseInt(id)
        try {
            const allPosts = await prisma.post.findMany({
                where: {
                    id: post_id
                }
            })
            res.json(allPosts)
        } catch (error) {
            console.error('Erro while creating post', error)
            res.status(500).json({erro: 'Erro while updating post', error})
        }
    },
    // async getCommentsByPost(req, res) {
    //     try {
    //         const { postId } = req.params
    //         const comments = await prisma.comment.findMany({ where: { postId: Number(postId) }})
    //         return res.json(comments)

    //     } catch (error) {
    //         return res.json({ error })
    //     }
    // },
}
