import mongoose from "mongoose";

const revokeTokenSchema = new mongoose.Schema(
    {
        tokenId: {
            type: String,
            required: true,
            unique: [true, "Please login again"]
        },
        expiresAt: {
            type: String,
            required: true,
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

const revokeToken =
    mongoose.models.revokeToken ||
    mongoose.model("revokeToken", revokeTokenSchema);

export default revokeToken;
