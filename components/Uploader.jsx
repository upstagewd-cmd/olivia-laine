"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Uploader({ projectId }) {
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  const upload = async (file) => {
    setStatus("uploading");
    setError("");
    try {
      const contentType = file.type || "application/octet-stream";
      const type = contentType.startsWith("video") ? "video" : "image";

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
        body: JSON.stringify({ projectId, r2Key: key, type, caption }),
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

  return (
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
        accept="image/*,video/*"
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
        {status === "uploading" ? "Uploading…" : "Choose a photo or video"}
      </button>
      <div className="mt-2 text-xs text-stone">or drag a file onto this box</div>
      {error && <div className="mt-2 text-xs text-red-700">{error}</div>}
    </div>
  );
}
