"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function typeFromContentType(contentType) {
  if (contentType.startsWith("image")) return "image";
  if (contentType.startsWith("video")) return "video";
  return "file";
}

export default function Uploader({ projectId }) {
  const [mode, setMode] = useState("upload"); // "upload" | "link"
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  const upload = async (file) => {
    setStatus("uploading");
    setError("");
    try {
      const contentType = file.type || "application/octet-stream";
      const type = typeFromContentType(contentType);

      const presignRes = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, filename: file.name, contentType }),
      });
      if (!presignRes.ok) throw new Error("Could not get an upload URL");
      const { url, key } = await presignRes.json();

      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      const mediaRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          r2Key: key,
          type,
          caption,
          originalFilename: file.name,
        }),
      });
      if (!mediaRes.ok) throw new Error("Could not save the media record");

      setCaption("");
      setStatus("idle");
      router.refresh();
    } catch (e) {
      setStatus("error");
      setError(e.message || "Something went wrong");
    }
  };

  const submitLink = async (e) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    setStatus("uploading");
    setError("");
    try {
      const mediaRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          type: "link",
          linkUrl: linkUrl.trim(),
          caption,
        }),
      });
      if (!mediaRes.ok) throw new Error("Could not save the link");

      setCaption("");
      setLinkUrl("");
      setStatus("idle");
      router.refresh();
    } catch (e) {
      setStatus("error");
      setError(e.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="mb-3 flex gap-4 text-xs">
        <button
          onClick={() => setMode("upload")}
          className={mode === "upload" ? "text-gold underline" : "text-stone"}
        >
          Upload a file
        </button>
        <button
          onClick={() => setMode("link")}
          className={mode === "link" ? "text-gold underline" : "text-stone"}
        >
          Add a link
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className="border border-dashed border-line p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) upload(file);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          <input
            type="text"
            placeholder="Caption for the next upload (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mb-3 w-full border border-line bg-transparent p-2 text-sm text-ink"
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="border border-gold px-4 py-2 text-sm text-gold disabled:opacity-50"
          >
            {status === "uploading" ? "Uploading…" : "Choose a file"}
          </button>
          <div className="mt-2 text-xs text-stone">
            or drag anything onto this box — photos, video, PDFs, lookbooks, contracts
          </div>
        </div>
      ) : (
        <form onSubmit={submitLink} className="border border-dashed border-line p-6">
          <input
            type="url"
            required
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="mb-3 w-full border border-line bg-transparent p-2 text-sm text-ink"
          />
          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mb-3 w-full border border-line bg-transparent p-2 text-sm text-ink"
          />
          <button
            type="submit"
            disabled={status === "uploading"}
            className="border border-gold px-4 py-2 text-sm text-gold disabled:opacity-50"
          >
            {status === "uploading" ? "Saving…" : "Add link"}
          </button>
        </form>
      )}

      {error && <div className="mt-2 text-xs text-red-700">{error}</div>}
    </div>
  );
}
