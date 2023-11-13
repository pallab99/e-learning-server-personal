const nodemailer = require("nodemailer");
export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "de26ee88ddd141",
    pass: "60d5a83b95f392",
  },
});
