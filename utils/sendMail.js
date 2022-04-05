const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

module.exports = {
  sendMail: (email, subject, htmlTemplate) => {
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
};
