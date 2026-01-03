"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const payload: any = {
      content,
    };

    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Pastebin Lite</h1>

      <label>Paste Content</label>
      <textarea
        rows={6}
        style={{ width: "100%", marginBottom: "10px" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label>TTL (seconds, optional)</label>
      <input
        type="number"
        style={{ width: "100%", marginBottom: "10px" }}
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
        min={1}
      />

      <label>Max Views (optional)</label>
      <input
        type="number"
        style={{ width: "100%", marginBottom: "10px" }}
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        min={1}
      />

      <button onClick={createPaste} disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {resultUrl && (
        <p style={{ marginTop: "10px" }}>
          Paste URL:{" "}
          <a href={resultUrl} target="_blank">
            {resultUrl}
          </a>
        </p>
      )}
    </main>
  );
}
