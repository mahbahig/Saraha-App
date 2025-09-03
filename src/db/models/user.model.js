import mongoose from "mongoose";

export const userGender = {
    male: "male",
    female: "female",
};
export const userRole = {
    user: "user",
    admin: "admin",
};
export const userProvider = {
    system: "system",
    google: "google",
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            min: [3, "Name must be at least 3 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exists"],
            trim: true,
            lowercase: true,
        },
        role: {
            type: String,
            enum: {
                values: [userRole.user, userRole.admin],
                message: "Role can only be user or admin",
            },
            default: userRole.user,
            set: (value) => value?.toLowerCase(),
        },
        profilePicture: String,
        age: {
            type: Number,
            min: [18, "You must be at least 18 years old"],
            max: [60, "You must be at most 60 years old"],
            required: function () { return this.provider === userProvider.system },
        },
        password: {
            type: String,
            required: function () { return this.provider === userProvider.system },
            trim: true,
        },
        phone: {
            type: String,
            unique: [true, "Phone number already exists"],
            trim: true,
        },
        gender: {
            type: String,
            enum: [userGender.male, userGender.female],
            required: function () { return this.provider === userProvider.system },
            set: (value) => {
                if (!value) return undefined;
                value = value.toLowerCase();
                if (["m", "male"].includes(value)) return userGender.male;
                if (["f", "female"].includes(value)) return userGender.female;
                return undefined;
            },
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String
        },
        provider: {
            type: String,
            enum: Object.values(userProvider),
            default: userProvider.system
        }
    },
    {
        strict: true,
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
