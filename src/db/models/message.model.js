import mongoose from "mongoose";

messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
            minLength: [1, "Content must be at least 1 character long"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User ID is required"],
            ref: "User"
        },
    },
    {
        strict: true,
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

const Message =
    mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
