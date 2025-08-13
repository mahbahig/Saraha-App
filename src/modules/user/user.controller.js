import { nanoid, customAlphabet } from "nanoid";
import { generateToken, verifyToken, Hash, Compare, Encrypt, Decrypt, eventEmitter } from "../../utils/index.js";
import revokeToken from "../../db/models/revokeToken.model.js";
import * as US from "./user.service.js";

// ====================================== SIGNUP ======================================
export const signup = async (req, res, next) => {
    const { name, email, phone, gender, age, password } = req.body;

    // Check if user already exists
    if (await US.getUserByEmail(email)) {
        throw new Error("Email already exists", { cause: 404 });
    }

    // Confirm email
    eventEmitter.emit("sendEmail", { email });

    // Hash password and encrypt phone number
    const hashedPassword = await Hash({
        plainText: password,
        saltRounds: process.env.SALT_ROUNDS,
    });
    const encryptedPhone = Encrypt({
        plainText: phone,
        encryptionKey: process.env.PHONE_ENCRYPTION_KEY,
    });

    // Create user
    const user = await US.createUser({ name, age, email, password: hashedPassword, phone: encryptedPhone, gender });
    // Create JWT token
    const token = generateToken({
        payload: { id: user._id, email: user.email },
        signature: process.env.TOKEN_SECRET_USER,
        options: { jwtid: nanoid(), expiresIn: "1h" },
    });
    if (!token) {
        throw new Error("Cannot create token", { cause: 500 });
    }
    res.status(201).json({ message: "User created successfully", token });
};

// ====================================== LOGIN ======================================
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await US.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    const match = await Compare({
        plainText: password,
        cipherText: user.password,
    });
    if (!match) {
        throw new Error("Wrong password", { cause: 401 });
    }
    const token = generateToken({
        payload: { id: user._id, email: user.email },
        signature: process.env.TOKEN_SECRET_USER,
        options: { jwtid: nanoid(), expiresIn: "1h" },
    });
    res.status(200).json({ message: "Login successful", token });
};

// ====================================== LOGOUT ======================================
export const logout = async (req, res, next) => {
    const revokedToken = revokeToken.create({
        tokenId: req.decoded.jti,
        expiresAt: req.decoded.exp,
    });
    res.status(200).json({ message: "Logout successful" });
};

// ====================================== USER PROFILE ======================================
export const getUserProfile = async (req, res, next) => {
    req.user.phone = Decrypt({
        cipherText: req.user.phone,
        decryptionKey: process.env.PHONE_ENCRYPTION_KEY,
    });
    res.status(200).json({ message: "success", user: req.user });
};

// ====================================== DELETE USER ======================================
export const deleteUser = async (req, res, next) => {
    const user = await US.deleteUser(req.params.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    res.status(200).json({ message: "User deleted successfully" });
};

// ====================================== CONFIRM EMAIL ======================================
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        throw new Error("Token is required", { cause: 400 });
    }
    const decoded = verifyToken({
        token,
        signature: process.env.TOKEN_SECRET_USER,
    });
    if (!decoded) {
        throw new Error("Invalid token", { cause: 400 });
    }
    const user = await US.getUserByEmail(decoded.email);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    user.confirmed = true;
    await user.save();

    res.status(200).json({ message: "Email confirmed successfully" });
};

// ====================================== UPDATE PASSWORD ======================================
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    // Check if old password is correct
    if (
        !(await Compare({
            plainText: oldPassword,
            cipherText: req.user.password,
        }))
    ) {
        throw new Error("Old password is incorrect", { cause: 401 });
    }

    // Check if new password is the same as old password
    if (oldPassword === newPassword) {
        throw new Error("New password cannot be the same as old password", {
            cause: 400,
        });
    }

    // Hash new password
    const hashedPassword = await Hash({ plainText: newPassword });

    // Update user password
    req.user.password = hashedPassword;
    await req.user.save();

    res.status(200).json({ message: "Password updated successfully " });
};

// ====================================== UPDATE USER ======================================
export const updateUser = async (req, res, next) => {
    const { name, email, role, age, phone, gender } = req.body;

    if (name) req.user.name = name;
    if (role) req.user.role = role;
    if (age) req.user.age = age;
    if (gender) req.user.gender = gender;

    if (email) {
        if (await US.getUserByEmail(email)) {
            throw new Error("Email already exists", { cause: 400 });
        }
        req.user.email = email;
    }

    if (phone) {
        req.user.phone = Encrypt({
            plainText: phone,
            encryptionKey: process.env.PHONE_ENCRYPTION_KEY,
        });
    }

    await req.user.save();

    res.status(200).json({ message: "Password updated successfully" });
};

// ====================================== FORGET PASSWORD ======================================
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    const user = await US.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }

    // Generate OTP
    const otp = customAlphabet("0123456789", 6)();

    // Save OTP to user and emit event
    user.otp = await Hash({ plainText: otp });
    eventEmitter.emit("forgetPassword", { email, otp });
    await user.save();

    res.status(200).json({ message: "Success" });
};

// ====================================== RESET PASSWORD ======================================
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    // Check if user exists
    const user = await US.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }

    // Check if otp expired
    const otpExpirationTime = 60 * 3;
    if ((new Date() - user.updatedAt) / 1000 > otpExpirationTime) {
        throw new Error("OTP expired", { cause: 400 });
    }

    // Check if OTP is correct
    if (!(await Compare({ plainText: otp, cipherText: user.otp }))) {
        throw new Error("Invalid OTP", { cause: 400 });
    }

    // Hash new password and save it
    user.password = await Hash({ plainText: newPassword });
    user.otp = "";
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
};