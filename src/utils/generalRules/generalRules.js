import Joi from "joi";
import { Types } from "mongoose"

export const customId = (value, helper) => {
    const data = Types.ObjectId.isValid(value);
    return data ? value : helper.message('Invalid Id');
}

export const generalRules = {
    id: Joi.string().custom(customId),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(20),
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().required(),
    }),
};