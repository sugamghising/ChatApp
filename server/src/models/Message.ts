import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    text: string;
    image: string;
    seen: boolean;
}

const messageSchema = new mongoose.Schema<IMessage>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,

    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', messageSchema);