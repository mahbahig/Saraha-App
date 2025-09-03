import Message from "../../db/models/message.model.js";
import { User } from "../../db/models/user.model.js";

// ====================================== CREATE MESSAGE ======================================
export const createMessage = async ({ content, userId }) => {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }

    const message = Message.create({ content, userId });
    return message
};

// ====================================== GET ALL MESSAGES ======================================
export const getAllMessages = async ({ userId }) => {
    const messages = await Message.find({ userId });
    return messages;
};

// ====================================== GET MESSAGE ======================================
export const getMessage = async ({ userId, messageId }) => {
    const message = await Message.findOne({ userId, _id: messageId });

    return message;
};