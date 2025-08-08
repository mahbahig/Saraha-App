import mongoose from "mongoose";

messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
            maxLength: [500, "Content cannot exceed 500 characters"],
            minLength: [3, "Content must be at least 3 characters long"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "User ID is required"],
            validate: {
                validator: async function (value) {
                    const user = await this.model("User").findById(value);
                    return !!user;
                },
                message: "User not found",
            },
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
