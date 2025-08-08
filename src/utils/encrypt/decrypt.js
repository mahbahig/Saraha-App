import CryptoJS from "crypto-js"

export const Decrypt = ({ cipherText, decryptionKey }) => {
    return CryptoJS.AES.decrypt(cipherText, decryptionKey).toString(
        CryptoJS.enc.Utf8
    );
};