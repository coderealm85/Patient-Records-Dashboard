import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: (session.user as any)?.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const appointment = await prisma.appointment.create({
      data: {
        patient: data.patient,
        service: data.service,
        date: data.date,
        time: data.time,
        status: data.status || 'Scheduled',
        userId: (session.user as any)?.id
      }
    });
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
