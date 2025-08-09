import { nanoid } from "nanoid";
import { User } from "../../db/models/user.model.js";
import { generateToken, verifyToken, Hash, Compare, Encrypt, Decrypt, eventEmitter } from "../../utils/index.js";
import revokeToken from "../../db/models/revokeToken.model.js";

// ====================================== SIGNUP ======================================
export const signup = async (req, res, next) => {
    const { name, email, phone, gender, age, password } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
        throw new Error("Email already exists", { cause: 404 });
    }

    // Confirm email
    eventEmitter.emit("sendEmail", {email});

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
    const user = await User.create({
        name,
        age,
        email,
        password: hashedPassword,
        phone: encryptedPhone,
        gender,
    });
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
    const user = await User.findOne({ email });
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
        expiresAt:  req.decoded.exp
    });
    res.status(200).json({ message: "Logout successful" });
};

// ====================================== USER PROFILE ======================================
export const getUserProfile = async (req, res, next) => {
    req.user.phone = Decrypt({cipherText: req.user.phone, decryptionKey: process.env.PHONE_ENCRYPTION_KEY});
    res.status(200).json({ message: "success", user: req.user });
};

// ====================================== UPDATE USER ======================================
export const updateUser = async (req, res, next) => {
    // TODO: Implement user update logic
};

// ====================================== DELETE USER ======================================
export const deleteUser = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
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
    const decoded = verifyToken({token, signature: process.env.TOKEN_SECRET_USER});
    if (!decoded) {
        throw new Error("Invalid token", { cause: 400 });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    user.confirmed = true;
    await user.save();
    console.log(user);

    res.status(200).json({ message: "Email confirmed successfully" });
};
