import kv from "@/lib/kv";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) notFound();

  const now = Date.now();
  if (paste.expires_at && now >= paste.expires_at) notFound();
  if (paste.max_views !== null && paste.views >= paste.max_views) notFound();

  return (
    <main style={{ padding: 20 }}>
      <h1>Paste</h1>
      <pre>{paste.content}</pre>
    </main>
  );
}
