const transporter = require("../config/nodemailer");

const sendEmailPassword = async (email, password) => {
  return new Promise((resolve, reject) => {
    const options = {
      from: `USER MANAGEMENT SYSTEM <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "Password for Login",
      text: `Your Password is  ${password}`,
      html: `Your Password is <b>${password}</b>`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return reject({
          message: `An error occurred while sending, ${err.message}`,
        });
      }
      return resolve({ message: "email sent successfully" });
    });
  });
};

const sendResetLink = (email, token) => {
  return new Promise((resolve, reject) => {
    const resetUrl = `${process.env.CLIENT_HOST}/reset-password?token=${token}`;

    const options = {
      from: `USER MANAGEMENT SYSTEM <${process.env.USER_EMAIL}>`,
      to: email,
      subject: "Reset Password Link",
      text: `Click this link to reset your password: ${resetUrl}`,
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error(err);
        return reject({
          message: `An error occurred while sending email: ${err.message}`,
        });
      }
      return resolve({ message: "Reset link sent successfully" });
    });
  });
};

module.exports = { sendEmailPassword, sendResetLink };
