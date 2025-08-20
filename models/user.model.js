import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 250,
    },
    profilePicture: {
        type: String,
    },
    avatar: {
        type: String,
    },
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;