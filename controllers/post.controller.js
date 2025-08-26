import Post from '../models/post.model.js';

export const createPost = async (req, res, next) => {
    try {
        const { content, image } = req.body;
        const post = await Post.create({
            content,
            image,
            user: req.user._id
        })

        res.status(201).json({
            message: 'Post created successfully',
            data: post
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);   
    }
}

//later we can add pagination, filtering, comments scetion etc.
//make sure the user can be able to make their posts private or public or can only show posts to their friends
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('user', 'username profilePicture').sort({ createdAt: -1 }).populate('comments', 'content user createdAt');
        res.status(200).json({
            message: 'Posts retrieved successfully', 
            data: posts,
            user: req.user._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const getSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username profilePicture').populate('comments', 'content user createdAt');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        res.status(200).json({
            message: 'Post retrieved successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id || req.body.postId || req.body.post_id;
        // Find the post first
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the current user is the author
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only update your own posts' });
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
        res.status(200).json({
            message: 'Post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id || req.body.postId || req.body.post_id;
        // Find the post first
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the current user is the author
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only delete your own post' });
        }
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const getPostsByUser = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: req.params.id }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
        if (!posts) return res.status(404).json({ message: 'No posts found for this user' });

        res.status(200).json({ message: 'Posts from a user successfully retrieved', data: posts});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const likeToggle = async (req, res, next) => {
    try {
        const postId = req.params.id || req.body.postId || req.body.post_id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user._id.toString();
        const liked = post.likes.map(id => id.toString()).includes(userId);

        if (liked) {
            // Unlike: remove userId from likes
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();
            return res.status(200).json({ message: 'Post unliked successfully', data: post });
        } else {
            // Like: add userId to likes
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({ message: 'Post liked successfully', data: post });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}