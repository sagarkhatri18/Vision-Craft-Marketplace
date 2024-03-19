const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (mailData, id, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // generate email body using Mailgen
    const MailGenerator = new mailgen({
      theme: "default",
      product: {
        name: process.env.APP_NAME,
        link: `${process.env.BASE_URL}/login`,
      },
    });

    // body of the email
    const email = {
      body: {
        name: mailData.name,
        intro:
          "Welcome to Vision Craft Marketplace! We’re very excited to have you on board.",
        action: {
          instructions: "Please click below button to activate your account",
          button: {
            text: "Confirm your account",
            link: `${process.env.BASE_URL}/account/verify/${id}/${token}`,
          },
        },
      },
    };

    const emailBody = MailGenerator.generate(email);

    await transporter.sendMail({
      from: process.env.MAIL_EMAIL_FROM,
      to: mailData.mail,
      subject: mailData.subject,
      html: emailBody,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

const sendPasswordResetEmail = async (mailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // generate email body using Mailgen
    const MailGenerator = new mailgen({
      theme: "default",
      product: {
        name: process.env.APP_NAME,
        link: `${process.env.BASE_URL}/login`,
      },
    });

    // body of the email
    const email = {
      body: {
        name: mailData.name,
        intro:
          "Welcome to Vision Craft Marketplace! We’re very excited to have you on board.",
        action: {
          instructions: "Please click below button to reset your password",
          button: {
            text: "Reset Password",
            link: `${mailData.baseURL}/password/reset/${mailData.userId}/${mailData.token}`,
          },
        },
        outro: `If you're having trouble clicking the "Reset Password" button, copy and paste the following link into your web browser: ${mailData.baseURL}/password/reset/${mailData.userId}/${mailData.token}`,
      },
    };

    const emailBody = MailGenerator.generate(email);

    await transporter.sendMail({
      from: process.env.MAIL_EMAIL_FROM,
      to: mailData.mail,
      subject: mailData.subject,
      html: emailBody,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = { sendEmail, sendPasswordResetEmail };
