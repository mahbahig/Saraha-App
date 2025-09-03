import * as US from "./user.service.js";

// ====================================== SIGNUP ======================================
export const signup = async (req, res, next) => {
    const { name, email, phone, gender, age, password } = req.body;

    const token = await US.signup({ name, email, phone, gender, age, password });

    res.status(201).json({ success: true, message: "User created successfully", token });
};

// ====================================== CONFIRM EMAIL ======================================
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;

    await US.confirmEmail({ token });

    res.status(200).json({ success: true, message: "Email confirmed successfully" });
};

// ====================================== LOGIN ======================================
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const token = await US.login({ email, password });

    res.status(200).json({ success: true, message: "Login successful", token });
};

// ====================================== GMAIL LOGIN ======================================
export const gmailLogin = async (req, res, next) => {
    const { idToken } = req.body;

    const token = await US.gmailLogin({ idToken });

    res.status(200).json({ success: true, message: "Login successful", token });
};

// ====================================== LOGOUT ======================================
export const logout = async (req, res, next) => {
    await US.logout({ token: req.decoded });

    res.status(200).json({ success: true, message: "Logout successful" });
};

// ====================================== GET PROFILE ======================================
export const getProfile = async (req, res, next) => {
    const user = await US.getProfile({ user: req.user });

    res.status(200).json({ success: true, user });
};

// ====================================== UPDATE PASSWORD ======================================
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    await US.updatePassword({ user: req.user, oldPassword, newPassword });

    res.status(200).json({ success: true, message: "Password updated successfully " });
};

// ====================================== UPDATE USER ======================================
export const updateUser = async (req, res, next) => {
    const { name, email, role, age, phone, gender } = req.body;

    await US.updateUser({ user: req.user, name, email, role, age, phone, gender });

    res.status(200).json({ success: true, message: "User updated successfully" });
};

// ====================================== FORGET PASSWORD ======================================
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    await US.forgetPassword({ email });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
};

// ====================================== RESET PASSWORD ======================================
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    await US.resetPassword({ email, otp, newPassword });

    res.status(200).json({ success: true, message: "Password updated successfully" });
};

// ====================================== CHANGE PROFILE PICTURE ======================================
export const changeProfilePicture = async (req, res, next) => {
    await US.changeProfilePicture({ user: req.user, file: req.file });

    res.status(200).json({ success: true, message: "Profile picture updated successfully" });
};