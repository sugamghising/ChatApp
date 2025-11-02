import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
    bio: string;
}



const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);