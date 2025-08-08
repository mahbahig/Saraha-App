import nodemailer from "nodemailer";

export const sendEmail = async ({to, subject, text, html}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Mahmoud Bahig" <mahbahig2@gmail.com>',
        to: to || "daxerar432@balincs.com",
        subject: subject || "Confirm your email",
        text: text || "Please confirm your email!",
        html: html || "<b>Hello world?</b>",
    });

    
    if (info.accepted.length > 0) {
        console.log("Email sent successfully:", info.response);
        return true;
    } else {
        console.error("Failed to send email:", info.rejected);
        return false;
    }
}