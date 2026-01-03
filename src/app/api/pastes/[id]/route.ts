import { NextRequest, NextResponse } from "next/server";

type Params = { id: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  // TODO: your KV / DB logic here
  return NextResponse.json({
    id,
    content: "example",
    remaining_views: null,
    expires_at: null,
  });
}
