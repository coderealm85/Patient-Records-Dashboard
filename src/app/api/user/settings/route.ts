import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        firstName: true,
        lastName: true,
        gender: true,
        dateOfBirth: true,
        email: true,
        name: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, gender, dateOfBirth, image } = await req.json();

    let imagePath = undefined;

    if (image && image.startsWith('data:image/')) {
      const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `profile-${session.user.id || Date.now()}-${Date.now()}.${extension}`;
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, buffer);
        imagePath = `/uploads/${filename}`;
      }
    }

    const dataToUpdate: any = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      gender,
      dateOfBirth
    };

    if (imagePath) {
      dataToUpdate.image = imagePath;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prisma cascades deletes if set up, or you can delete user
    // In schema.prisma, we might need to delete related data manually if not set up with Cascade.
    // Let's delete the user. The schema might have onDelete: Cascade or we just delete the user.
    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
