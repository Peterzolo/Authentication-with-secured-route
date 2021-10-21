const nodeMailer = require("nodemailer");
const nodemailerMailgun = require("nodemailer-mailgun-transport");

const sendEmail = (options) => {
  const mailTransporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,

    auth: {
      api_keys: "6cd70547d17d8ca467146192009ae1b1-2bf328a5-8eb92c7f",
      domain: "sandbox5ae36bcd82844bac9d67ebb27bf711f4.mailgun.org?",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  //const mailOptions = {
  //  from: process.env.EMAIL_FROM,
  //  to: "info@boostar101.com",
  //  subject: "",
  //  text: "",
  //};

  mailTransporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
