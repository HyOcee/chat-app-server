import mongoose from "mongoose";

interface IUser {
    username: string,
    hashedPassword: string,
    createdAt: Date,
    firstName: string,
    lastName: string
}

const usersSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
})

const User = mongoose.model<IUser>('User', usersSchema);
export default User;