import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.verificationToken.upsert({
      where: { email_token: { email, token: otp } },
      update: { token: otp, expires },
      create: { email, token: otp, expires },
    });
    // Fallback cleanup: delete old tokens for this email if we aren't using the compound unique correctly in upsert.
    // Actually, upserting on compound might leave old tokens if we generate a NEW token. Let's delete existing first.
    await prisma.verificationToken.deleteMany({ where: { email } });
    await prisma.verificationToken.create({
      data: { email, token: otp, expires },
    });

    // Send Email
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const mailOptions = {
        from: smtpEmail,
        to: email,
        subject: "Your Account Verification Code",
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);
    } else {
      console.warn("SMTP credentials not configured. Printing OTP to console for development:");
      console.log(`=========================`);
      console.log(`OTP for ${email}: ${otp}`);
      console.log(`=========================`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
