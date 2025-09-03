import Joi from "joi";
import { generalRules } from "../../utils/generalRules/generalRules.js";

export const createMessageSchema = {
    body: Joi.object({
        content: Joi.string().min(1).max(500).required(),
        userId: generalRules.id.required()
    }).required(),
};