import jwt from "jsonwebtoken";

export const verifyToken = ({ token, signature }) => {
    return jwt.verify(token, signature);
}