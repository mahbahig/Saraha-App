import jwt from "jsonwebtoken";

export const verifyToken = ({ token, signature = process.env.TOKEN_SECRET_USER }) => {
    return jwt.verify(token, signature);
};