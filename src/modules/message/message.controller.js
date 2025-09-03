import * as MS from "./message.service.js";

// ====================================== CREATE MESSAGE ======================================
export const createMessage = async (req, res, next) => {
    const { content, userId } = req.body;

    const message = await MS.createMessage({ content, userId });

    res.status(201).json({ success: true, message: "Message created successfully", message });
};

// ====================================== GET ALL MESSAGES ======================================
export const getAllMessages = async (req, res, next) => {
    const userId = req.user.id;

    const messages = await MS.getAllMessages({ userId });

    res.status(200).json({ success: true, messages });
};

// ====================================== GET MESSAGE ======================================
export const getMessage = async (req, res, next) => {
    const userId = req.user.id;
    const messageId = req.params.id;

    const message = await MS.getMessage({ userId, messageId });

    res.status(200).json({ success: true, message });
};