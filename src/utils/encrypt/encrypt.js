import CryptoJS from "crypto-js";

export const Encrypt = ({ plainText, encryptionKey }) => {
    return CryptoJS.AES.encrypt(plainText, encryptionKey).toString();
};