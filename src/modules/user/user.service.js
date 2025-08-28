import { customAlphabet, nanoid } from "nanoid";
import revokeToken from "../../db/models/revokeToken.model.js";
import { User } from "../../db/models/user.model.js";
import { Compare, Decrypt, Encrypt, eventEmitter, generateToken, Hash, verifyToken } from "../../utils/index.js";

// ====================================== SIGNUP ======================================
export const signup = async ({ name, age, email, password, phone, gender }) => {
    // Check if user already exists
    if (await getUserByEmail({ email })) {
        throw new Error("Email already exists", { cause: 400 });
    }

    // Confirm email
    eventEmitter.emit("confirmEmail", { email });

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
    const user = await User.create({ name, age, email, password: hashedPassword, phone: encryptedPhone, gender });

    // Create JWT token
    const token = generateToken({
        payload: { id: user._id, email: user.email },
        signature: process.env.TOKEN_SECRET_USER,
        options: { jwtid: nanoid(), expiresIn: "1h" },
    });
    if (!token) {
        throw new Error("Cannot create token", { cause: 500 });
    }
    return token;
};

// ====================================== CONFIRM EMAIL ======================================
export const confirmEmail = async ({ token }) => {
    // Check if token is provided
    if (!token) {
        throw new Error("Token is required", { cause: 400 });
    }

    // Verify token
    const decoded = verifyToken({ token });
    if (!decoded) {
        throw new Error("Invalid token", { cause: 400 });
    }
    console.log(decoded);
    

    // Find user and confirm email
    const user = await getUserByEmail({ email: decoded.email });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    user.confirmed = true;
    await user.save();
};

// ====================================== LOGIN ======================================
export const login = async ({ email, password }) => {
    const user = await getUserByEmail({ email });

    // Check if user exists
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }

    // Check if password is correct
    const match = await Compare({
        plainText: password,
        cipherText: user.password,
    });
    if (!match) {
        throw new Error("Wrong password", { cause: 401 });
    }

    // Create JWT token
    const token = generateToken({
        payload: { id: user._id, email: user.email },
        signature: process.env.TOKEN_SECRET_USER,
        options: { jwtid: nanoid(), expiresIn: "1h" },
    });
    return token;
};

// ====================================== LOGOUT ======================================
export const logout = async ({ token }) => {
    const revokedToken = await revokeToken.create({
        tokenId: token.jti,
        expiresAt: token.exp,
    });
};

// ====================================== GET PROFILE ======================================
export const getProfile = async ({ user }) => {
    user.phone = Decrypt({ cipherText: user.phone});
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        phone: user.phone,
    }
    return userData;
};

// ====================================== UPDATE PASSWORD ======================================
export const updatePassword = async ({ user, oldPassword, newPassword }) => {
    // Check if old password is correct
    if (!(await Compare({ plainText: oldPassword, cipherText: user.password }))) {
        throw new Error("Old password is incorrect", { cause: 401 });
    }

    // Check if new password is the same as old password
    if (oldPassword === newPassword) {
        throw new Error("New password cannot be the same as old password", { cause: 400 });
    }

    // Hash new password
    const hashedPassword = await Hash({ plainText: newPassword });

    // Update user password
    user.password = hashedPassword;
    await user.save();
};

// ====================================== UPDATE USER ======================================
export const updateUser = async ({ user, name, email, role, age, phone, gender }) => {
    // Update user fields
    if (name) user.name = name;
    if (role) user.role = role;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (phone) user.phone = Encrypt({ plainText: phone });
    if (email) {
        if (await getUserByEmail({ email })) {
            throw new Error("Email already exists", { cause: 400 });
        }
        user.email = email;
    }

    // Save updated user
    await user.save();
};

// ====================================== FORGET PASSWORD ======================================
export const forgetPassword = async ({ email }) => {
    // Check if user exists
    const user = await getUserByEmail({ email });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }

    // Generate OTP
    const otp = customAlphabet("0123456789", 6)();

    // Save OTP to user and emit event
    user.otp = await Hash({ plainText: otp });
    eventEmitter.emit("forgetPassword", { email, otp });
    await user.save();
};

// ====================================== RESET PASSWORD ======================================
export const resetPassword = async ({ email, otp, newPassword }) => {
    // Check if user exists
    const user = await getUserByEmail({ email });
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
};

// ====================================== GET USER BY EMAIL ======================================
export const getUserByEmail = async ({ email }) => {
    const user = await User.findOne({ email });
    return user;
};