const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({
            user: req.user.id,
            content: req.body.content,
            recommendation: req.body.recommendation,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            status: 'success',
            data: post
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'fullName')
            .populate({
                path: 'recommendation',
                select: 'prediction fieldName inputs'
            })
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ status: 'fail', message: 'No post found' });
        }

        const isLiked = post.likes.includes(req.user.id);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id.toString());
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({
            status: 'success',
            data: {
                likes: post.likes,
                isLiked: !isLiked
            }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
