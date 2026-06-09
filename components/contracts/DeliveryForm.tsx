"use client";

import { useState } from "react";

type Props = {
  contractId: number;
  onDelivered: () => void;
};

export default function DeliveryForm({
  contractId,
  onDelivered,
}: Props) {

  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    try {

      const res = await fetch(`/api/contracts/${contractId}/deliveries`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            liveUrl,
            githubUrl,
            notes,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }

      setLiveUrl("");
      setGithubUrl("");
      setNotes("");

      onDelivered();

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-5 space-y-4"
    >

      <h2 className="font-semibold text-lg">
        Submit Delivery
      </h2>

      <input
        required
        value={liveUrl}
        onChange={(e) => setLiveUrl(e.target.value)}
        placeholder="Live URL"
        className="w-full border p-3 rounded"
      />

      <input
        required
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
        placeholder="Github URL"
        className="w-full border p-3 rounded"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Delivery Notes"
        className="w-full border p-3 rounded"
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading
          ? "Submitting..."
          : "Submit Delivery"}
      </button>

    </form>
  );
}