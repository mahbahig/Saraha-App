import bcrypt from "bcrypt";

export const Hash = async ({ plainText, saltRounds = 10 }) => {
    if (!plainText || typeof plainText !== "string") {
        throw new Error("Plaintext must be a non-empty string");
    }
    if (!Number.isInteger(saltRounds) || saltRounds < 4 || saltRounds > 31) {
        saltRounds = parseInt(saltRounds);
    }
    try {
        return await bcrypt.hash(plainText, saltRounds);
    } catch (error) {
        throw new Error(`Hashing failed: ${error.message}`);
    }
};
