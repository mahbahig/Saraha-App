import CryptoJS from "crypto-js"

export const Decrypt = ({ cipherText, decryptionKey = process.env.PHONE_ENCRYPTION_KEY }) => {
    return CryptoJS.AES.decrypt(cipherText, decryptionKey).toString(
        CryptoJS.enc.Utf8
    );
};