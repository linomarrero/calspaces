import { NextResponse } from "next/server";
import { getWaitlistCountServer, joinWaitlistServer } from "@/lib/supabase-server";

export async function GET() {
  const count = await getWaitlistCountServer();
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Email is required." },
      { status: 400 }
    );
  }

  const result = await joinWaitlistServer(email);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.error === "Already on the list." ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
