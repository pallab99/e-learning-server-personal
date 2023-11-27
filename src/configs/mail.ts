const nodemailer = require("nodemailer");
export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e2298bdd0d1829",
    pass: "4253d29c8ef5a8",
  },
});
