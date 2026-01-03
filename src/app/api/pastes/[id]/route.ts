import kv from "@/lib/kv";
import { NextResponse } from "next/server";
import { getNow } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = getNow(req);

  if (paste.expires_at && now >= paste.expires_at)
    return NextResponse.json({ error: "Expired" }, { status: 404 });

  if (paste.max_views !== null && paste.views >= paste.max_views)
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });

  paste.views += 1;
  await kv.set(key, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
