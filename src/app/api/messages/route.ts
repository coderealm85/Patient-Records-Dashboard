import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Realistic patient replies per person
const AUTO_REPLIES: Record<string, string[]> = {
  'Emily Williams': [
    "Thank you, Doctor! I'll follow the advice.",
    "When should I schedule my next check-up?",
    "I've been feeling much better lately.",
    "Should I continue with the medication?",
    "I'll make sure to rest as you suggested.",
  ],
  'Ryan Johnson': [
    "Got it, thanks Dr. Simmons.",
    "Can I come in earlier this week?",
    "I had some pain last night, is that normal?",
    "My insurance should cover this, right?",
    "I'll bring my previous lab results.",
  ],
  'Jessica Taylor': [
    "I sent the lab results over.",
    "Is there anything else I should watch for?",
    "Thank you for the quick response, Doctor!",
    "Should I reduce my physical activity?",
    "I'll call the pharmacy right away.",
  ],
  'Brandon Mitchell': [
    "Thanks for the advice, doctor.",
    "I've been taking the medication on time.",
    "The symptoms seem to be improving.",
    "Should I avoid any foods?",
    "I'll be there for the follow-up appointment.",
  ],
};

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const messages = await prisma.message.findMany({
      where: { userId: (session.user as any)?.id },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content, receiver } = await req.json();
    const userId = (session.user as any)?.id;

    // Save the doctor's outgoing message
    const message = await prisma.message.create({
      data: {
        content,
        receiver,
        sender: "Dr. Jose Simmons",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        userId,
      }
    });

    // Schedule an auto-reply from the patient after 1.5–3 seconds
    const replies = AUTO_REPLIES[receiver] ?? ["Thanks, Doctor!"];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const delay = 1500 + Math.random() * 1500;

    setTimeout(async () => {
      try {
        await prisma.message.create({
          data: {
            content: replyText,
            receiver: "Dr. Jose Simmons",
            sender: receiver,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            userId,
          }
        });
      } catch (e) {
        console.error("Auto-reply failed:", e);
      }
    }, delay);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
