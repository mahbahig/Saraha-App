import { User } from "../../db/models/user.model.js";

export async function getAllUsers() {
    const users = await User.find();
    return users;
}

export async function getUserById(id) {
    const user = await User.findById(id);
    return user;
}

export async function getUserByEmail(email) {
    const user = await User.findOne({ email, confirmed: true });
    return user;
}

export async function createUser(data) {
    const user = await User.create({ ...data });
    return user;
}

export async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}
