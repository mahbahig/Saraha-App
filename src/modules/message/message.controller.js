import * as MS from "./message.service.js";

// ====================================== CREATE MESSAGE ======================================
export const createMessage = async (req, res, next) => {
    const { content, userId } = req.body;

    const message = await MS.createMessage({ content, userId });

    res.status(201).json({ success: true, message: "Message created successfully", message });
};