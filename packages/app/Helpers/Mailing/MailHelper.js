const nodemailer = require("nodemailer");
const welcomeMailTemplate = require("./MailTemplates/WelcomeTemplate")
const config = require("./config.json")

// main function that handles sending welcome mail
async function sendWelcomeMail(firstname, to) {
  let transporter = nodemailer.createTransport(config.transportOptions);

  let info = await transporter.sendMail({
    from: config.from,
    to,
    subject: "Welcome to Bukket!!",
    html: welcomeMailTemplate(firstname),
  });
}

module.exports = {
  // takes input parameters of firstname of the user, user email id
  sendWelcomeMail
}

