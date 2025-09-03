import Joi from "joi";
import { userGender, userRole } from "../../db/models/user.model.js";
import { generalRules } from "../../utils/generalRules/generalRules.js";

export const signupSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(15).required(),
        email: generalRules.email.required(),
        role: Joi.string().valid(userRole.user, userRole.admin),
        age: Joi.number().min(18).max(60).required(),
        password: generalRules.password.required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
        phone: Joi.string(),
        gender: Joi.string().valid(userGender.male, userGender.female).required(),
    }).required()
};
export const loginSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).required()
};
export const gmailLoginSchema = {
    body: Joi.object({
        idToken: Joi.string().required()
    }),
};
export const updatePasswordSchema = {
    body: Joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
    }),
};
export const forgetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required()
    }),
};
export const resetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        otp: Joi.string().length(6).required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
    }),
};
export const updateUserSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(15),
        email: generalRules.email,
        role: Joi.string().valid(userRole.user, userRole.admin),
        age: Joi.number().min(18).max(60),
        phone: Joi.string(),
        gender: Joi.string().valid(userGender.male, userGender.female),
    }),
};
export const changeProfilePictureSchema = {
    file: generalRules.file.required()
};