const nodemailer = require("nodemailer");

module.exports = {
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
