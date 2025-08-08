import Joi from "joi";
import { Types } from "mongoose"

export const customId = (value, helper) => {
    const data = Types.ObjectId.isValid(value);
    return data ? value : helper.message('Invalid Id');
}

export const generalRules = {
    id: Joi.string().custom(customId),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(20)
}