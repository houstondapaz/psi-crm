import { db } from "@/prisma/db";
import { notifyAlertsByEmail } from "@/services/alert-service";
import { NextResponse } from "next/server";

async function sendEmail(input: { to: string; subject: string; body: string }) {
  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "alertas@example.com",
        to: input.to,
        subject: input.subject,
        text: input.body,
      }),
    });
    return;
  }

  console.log("[email stub]", input);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? "dev-cron-secret"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.orm.User.all();
  let totalSent = 0;

  for (const user of users) {
    const sent = await notifyAlertsByEmail(
      { practiceId: user.practiceId, userId: user.id },
      sendEmail,
    );
    totalSent += sent.length;
  }

  return NextResponse.json({ sent: totalSent });
}
