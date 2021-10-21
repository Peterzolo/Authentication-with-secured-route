const nodeMailer = require("nodemailer");

const nodemailerMailgun = require("nodemailer-mailgun-transport");

const mailService = (options) => {
  const auth = {
    auth: {
      api_keys: process.env.MAILGUN_KEYS,
      domain: process.env.DOMAIN_KEY,
    },
  };

  let transporter = nodemailer.createTransport(nodemailerMailgun(auth));

  //const mailOptions = {
  //  from: process.env.EMAIL_FROM,
  //  to: process.env.EMAIL_TO,
  //  subject: "",
  //  text: "",
  //};

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("message sent", data);
    }
  });
};

module.exports = mailService;
