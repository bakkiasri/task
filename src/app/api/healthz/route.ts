import kv from "@/lib/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if KV is configured (skip KV in local dev)
    if (!process.env.KV_REST_API_URL) {
      console.log("KV not configured, skipping real KV test.");
      return NextResponse.json({ ok: true });
    }

    // Real KV check for production / Vercel
    try {
      await kv.set("healthz-check", "ok");
      const value = await kv.get("healthz-check");

      if (value !== "ok") throw new Error("KV not reachable");
    } catch (err) {
      console.error("KV operation failed:", err);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
