import { Request, Response } from "express"
import User from "../models/User";
import Message from "../models/Message";
import cloudinary from "../utils/cloudinary";
import { io, userSocketMap } from "../index"

interface UnseenMessageCount {
    [userId: string]: number;
}

//get all users except the logged in user
export const getUsersForSideBar = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        //select the user except the logged in user
        const filteredUser = await User.find({ _id: { $ne: userId } }).select('-password');


        //count no of message not seen
        const unseenMessage: UnseenMessageCount = {}
        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessage[String(user._id)] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, user: filteredUser, unseenMessage })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message })
    }
}

//Get all users from the selected users
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user?._id;
        const messages = await Message.find({
            $or: [{ senderId: myId, receiverId: selectedUserId },
            { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.json({ success: true, messages })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message })
    }
}


//Api to mark messages as seen using message Is

export const markMessageSeen = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message })
    }
}



//send message to selected users
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id as string;
        if (!receiverId) {
            return res.status(400).json({ success: false, message: "Receiver id is required" });
        }
        const senderId = req.user?._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        //Emit the new message to receiver socker
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: (error as Error).message })
    }
}