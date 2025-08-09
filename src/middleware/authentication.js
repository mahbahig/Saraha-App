import revokeToken from '../db/models/revokeToken.model.js';
import { User } from '../db/models/user.model.js';
import { verifyToken } from '../utils/token/verifyToken.js';

export const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    // Check if token is provided
    if (!authorization) {
        throw new Error("Token not found", {cause: 401})
    }    

    // Split the token into prefix and token
    const [prefix, token] = authorization.split(' ') || [];
    if (!prefix || !token) {
        throw new Error("Invalid token format", { cause: 401 });
    }   
    let signature = '';
    if (prefix == 'bearer' || prefix == 'Bearer') {
        signature = process.env.TOKEN_SECRET_USER;
    } else if (prefix == 'admin' || prefix == 'Admin') {
        signature = process.env.TOKEN_SECRET_ADMIN;
    } else {
        throw new Error("Invalid token prefix", { cause: 401 });
    }

    // Verify token
    const decoded = verifyToken({ token, signature });
    if (!decoded) {
        throw new Error("Invalid token", { cause: 401 });
    }
    req.decoded = decoded;

    // Check if token is revoked
    const revokedToken = await revokeToken.findOne({ tokenId: decoded.jti });
    if (revokedToken) {
        throw new Error("Token has been revoked, please login again", { cause: 401 });
    }
    // Check user existence and attach user to request
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    req.user = user;
    next();
}