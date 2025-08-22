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