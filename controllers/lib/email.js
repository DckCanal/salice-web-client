const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter

  // Gmail is not a good idea, because of its filters... you will be soon marked as a spammer
  // If you want to use it, activate in your Gmail account "less secure app" option
  const transporter = nodemailer.createTransport({
    //service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Marco De Canal <marco.decanal@saliceserver.it>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //   html:
  };

  // 3) Send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
