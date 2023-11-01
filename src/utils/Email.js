const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const sendEmail = async (content, subject, emailReceiver) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SERVER,
            pass: process.env.PASSWORD_EMAIL_SERVER,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_SERVER,
        to: emailReceiver,
        subject: subject,
        html: `<p>${content}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
};

module.exports = sendEmail;
