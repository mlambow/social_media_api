import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password');
        if (!users) {
            const error = new Error("No users found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error("No users found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        if(req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only update your profile' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user  
        })
    } catch (error) {
        next(error);
    } 
}

export const deleteUser = async (req, res, next) => {
    try {
        if(req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized, you can only delete your profile' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const followUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id
        const currentUserId = req.user._id;
        const userToFollow = await User.findById(userToFollowId);
        const currentUser = await User.findById(currentUserId);

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.following.includes(userToFollowId)) {
            return res.status(400).json({ message: 'Already following this user' })
        }

        // Add to currentUser's following list
        currentUser.following.push(userToFollowId);

        // Add to userToFollow's followers list
        userToFollow.followers.push(currentUserId);

        await currentUser.save()
        await userToFollow.save()

        res.status(200).json({ message: `You are now following ${userToFollow.username}` });
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error: error.message });
        next(error)
    }
}

export const unfollowUser = async (req, res, next) => {
    try {
        const userToUnfollowId = req.params.id
        const currentUserId = req.user._id;

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
        }

        const userToUnfollow = await User.findById(userToUnfollowId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if currently following
        if (!currentUser.following.includes(userToUnfollowId)) {
            return res.status(400).json({ message: 'You do not follow this user' });
        }

        // Remove from currentUser's following list
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToUnfollowId
        );

        // Remove from userToUnfollow's followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUserId
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: `You have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error: error.message });
        next(error)
    }
}

export const getFollowers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username')
        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({followers: user.followers})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}

export const getFollowing = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username')
        if (!user) return res.status(404).json({ message: 'User not found' })

        res.status(200).json({following: user.following})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        next(error);
    }
}