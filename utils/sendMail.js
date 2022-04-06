const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

module.exports = {
  sendMail2: (email, subject, htmlTemplate) => {
    const mailgunAuth = {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
    };

    const transporter = nodemailer.createTransport(
      mailgunTransport(mailgunAuth)
    );

    const mailOptions = {
      from: "recyclotronics@gmail.com",
      to: email,
      subject: subject,
      html: htmlTemplate,
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(">>>>>>>>>", error);
      } else {
        console.log("Successfully sent email.");
      }
    });
  },
  sendMail: (email, subject, htmlTemplate) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Recyclotronics Team",
      to: email,
      subject: subject,
      html: htmlTemplate,
    };

    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(">>>>>>>>>", error);
      } else {
        console.log("Successfully sent email.");
      }
    });
  },
};
