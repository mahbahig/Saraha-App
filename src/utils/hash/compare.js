import bcrypt from "bcrypt"

export const Compare = async ({ plainText, cipherText }) => {
    return await bcrypt.compare(plainText, cipherText);
}