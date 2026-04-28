import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, gender, dateOfBirth, otp } = await req.json();

    if (!email || !password || !firstName || !lastName || !gender || !dateOfBirth || !otp) {
      return NextResponse.json({ error: "Missing required fields or OTP" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Verify OTP
    const verificationRecord = await prisma.verificationToken.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: "No OTP requested for this email" }, { status: 400 });
    }

    if (verificationRecord.token !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (verificationRecord.expires < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        gender,
        dateOfBirth
      },
    });

    // Delete used OTP
    await prisma.verificationToken.deleteMany({ where: { email } });

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
