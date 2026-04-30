import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOTP = async (to: string, otp: string, type: "signup" | "forgot") => {
  const subject = type === "signup" ? "Verify your account" : "Reset your password";
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Healthcare Dashboard</h2>
      <p>Your OTP code is:</p>
      <h1 style="color: #01F0D0; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Healthcare Dashboard" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
