require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function test() {
  try {
    await transporter.sendMail({
      from: `"Healthcare Dashboard" <${process.env.SMTP_EMAIL}>`,
      to: "cordxas80@gmail.com",
      subject: "Test",
      html: "<h1>Test</h1>"
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
  }
}

test();
