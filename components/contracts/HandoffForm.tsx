"use client";

import { useState } from "react";

type Props = {
  contractId: number;
  onUploaded: () => void;
};

export default function HandoffForm({
  contractId,
  onUploaded,
}: Props) {

  const [sourceCodeUrl, setSourceCodeUrl] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch(`/api/contracts/${contractId}/handoff`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sourceCodeUrl,
            documentationUrl,
            notes,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }

      onUploaded();

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border rounded-xl p-5 space-y-4"
    >

      <h2 className="font-semibold text-lg">
        Final Source Code Handoff
      </h2>

      <input
        required
        value={sourceCodeUrl}
        onChange={(e) => setSourceCodeUrl(e.target.value)}
        placeholder="Github / Drive Link"
        className="w-full border p-3 rounded"
      />

      <input
        value={documentationUrl}
        onChange={(e) => setDocumentationUrl(e.target.value)}
        placeholder="Documentation URL"
        className="w-full border p-3 rounded"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        className="w-full border p-3 rounded"
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading
          ? "Uploading..."
          : "Submit Handoff"}
      </button>

    </form>
  );
}