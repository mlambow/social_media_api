import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";


export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.id || req.body.postId || req.body.post_id;
    const userId = req.user._id;

    const postExists = await Post.findById(postId);
    if (!postExists) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: postId,
      user: userId,
      data: content
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment }
      })

    res.status(201).json({
        message: 'Comment created successfully',
        data: comment
    });
  } catch (error) {
    console.error('Create Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
    next(error)
  }
};

export const getCommentsByPost = async (req, res, next) => {
    try {
        const postId = req.params.id || req.body.postId || req.body.post_id;
        if (!postId) return res.status(400).json({ message: 'Post is not found' });
        const comments = await Comment.find({ post: postId })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });

        if (!comments) return res.status(404).json({ message: 'No comments found for this post' });

        res.status(200).json({
            message: 'Post comments retrieved successfully',
            data: comments
        });
    } catch (error) {
        console.error('Retrieving Comments Error:', error);
        res.status(500).json({ message: 'Server error' })
        next(error)
    }
}

export const getSingleComment = async (req, res, next) => {
    try {
        const commentId = req.params.id || req.body.commentId || req.body.comment_id;
        if (!commentId) return res.status(400).json({ message: 'Comment ID is required' });

        const comment = await Comment.findById(commentId).populate('user', 'username profilePicture');
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({
            message: 'Comment retrieved successfully',
            data: comment
        });
    } catch (error) {
        console.error('Retrieving Single Comment Error:', error);
        res.status(500).json({ message: 'Server error' })
        next(error)
    }
}

export const updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.id || req.body.commentId || req.body.comment_id;
        const comment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true }).populate('user', 'username profilePicture');
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Check if the current user is the author
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only update your own comment' });
        }
        
        res.status(200).json({
            message: 'Comment updated successfully',
            data: comment
        });
    } catch (error) {
        console.error('Updating Comment Error:', error);
        res.status(500).json({ message: 'Server error' })
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id || req.body.commentId || req.body.comment_id;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not be found' });

        // Check if the current user is the author
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only delete your own comment' });
        }

        res.status(200).json({
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        console.error();
        res.status(500).json({ message: 'Deleting Comment Error:', error: error.message });
        next(error)
    }
}