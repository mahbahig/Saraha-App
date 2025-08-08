import { EventEmitter } from "node:events";
import { sendEmail } from "../../services/sendEmail.js";
import { generateToken } from "../token/generateToken.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;
    const confirmToken = generateToken({
        payload: { email },
        signature: process.env.TOKEN_SECRET_USER,
        options: { expiresIn: 60 * 3 },
    });
    const link = `${process.env.BASE_URL}/users/confirmEmail/${confirmToken}`;
    const isSent = await sendEmail({
        to: email,
        subject: "Confirm your email",
        html: `<button style="width: 100%; padding: 0px 10px; background-color: blue;"><a href="${link}">Confirm Email<a/></button>`,
    });
});
