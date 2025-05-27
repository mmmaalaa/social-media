import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"SarahaApp" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.rejected.length === 0
   
};

export const subject = {
  activateAccount: "Activate your account",
  resetPassword: "Reset your password",
  emailChange: "Email Change Request",
};
export default sendEmail;
