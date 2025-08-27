import CryptoJS from "crypto-js";

export const Encrypt = ({ plainText, encryptionKey = process.env.PHONE_ENCRYPTION_KEY }) => {
    return CryptoJS.AES.encrypt(plainText, encryptionKey).toString();
};