import bcrypt from "bcrypt";

export const Hash = async ({ plainText, saltRounds = 10 }) => {
    try {
        return await bcrypt.hash(plainText, Number(saltRounds));
    } catch (error) {
        throw new Error(`Hashing failed: ${error.message}`);
    }
};
