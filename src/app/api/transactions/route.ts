import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: (session.user as any)?.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const transaction = await prisma.transaction.create({
      data: {
        invoiceId: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        patient: data.patient,
        service: data.service,
        date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: data.amount,
        status: data.status || 'Pending',
        method: data.method || 'Credit Card',
        userId: (session.user as any)?.id
      }
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
