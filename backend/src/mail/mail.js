const nodemailer = require('nodemailer');
const mailTemplate = require('./mailTemplate.js');

// Create the transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Function to send an email
async function sendEmail(mailOptions) {
    try {
        let info = await transporter.sendMail(mailOptions);
        // console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

// Function to send verification email
async function verificationEmail(email, verificationToken) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your Email",
        html: mailTemplate.VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken)
    };

    await sendEmail(mailOptions);
}

// Function to send verification success email
async function verificationSuccessEmail(name, email) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your account has been verified",
        html: mailTemplate.VERIFICATION_SUCCESS_EMAIL_TEMPLATE.replace('{userName}', name)
    };

    await sendEmail(mailOptions);
}

// Function to send Password Reset email
async function passwordResetEmail(email, resetToken) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Reset your Password",
        html: mailTemplate.PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', `https://chathubx.onrender.com/reset-password/${resetToken}`)
    };

    await sendEmail(mailOptions);
}

// Function to send Password Reset Success email
async function passwordResetSuccessEmail(email, name) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset Successful",
        html: mailTemplate.PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{userName}', name)
    };

    await sendEmail(mailOptions);
}

module.exports = { verificationEmail, verificationSuccessEmail, passwordResetEmail, passwordResetSuccessEmail };
