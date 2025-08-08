import mongoose from "mongoose";

export const userGender = {
    male: "male",
    female: "female",
};
export const userRole = {
    user: "user",
    admin: "admin",
};

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            min: [3, "Name must be at least 3 characters long"],
            max: [15, "Name must be at most 15 characters long"],
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
        age: {
            type: Number,
            min: [18, "You must be at least 18 years old"],
            max: [60, "You must be at most 60 years old"],
            required: [true, "Age is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
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
            required: [true, "Gender is required"],
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
    },
    {
        strict: true,
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
