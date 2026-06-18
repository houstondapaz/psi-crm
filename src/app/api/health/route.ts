import { db } from "@/prisma/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.orm.Practice.all();

    return Response.json({
      ok: true,
      database: "reachable",
    });
  } catch {
    return Response.json(
      {
        ok: false,
        database: "unreachable",
      },
      { status: 503 },
    );
  }
}
