"use client"

import { useState } from "react"
import SmartUrlInput from "./SmartUrlInput";
interface Props {
  onClose: () => void;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function AddPortfolioModal({ onClose }: Props) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectLink: "",
    githubLink: "",
  })
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !isValidUrl(form.projectLink)||
      !isValidUrl(form.githubLink)
    ) {
      setError("Please enter valid URLs and fill all fields");
      return;
    }

    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      onClose();
    } else {
      setError("Failed to Add Projects");
    }
  };

  return (

    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg w-96 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold">
          Add Project
        </h2>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            placeholder="Project Title"
            className="w-full border p-2"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <SmartUrlInput
            label="Live Project URL"
            value={form.projectLink}
            onChange={(val) => setForm({ ...form, projectLink: val })}
            placeholder="example.com"
          />

          <SmartUrlInput
            label="GitHub URL"
            value={form.githubLink}
            onChange={(val) => setForm({ ...form, githubLink: val })}
            placeholder="github.com/username/repo"
          />

          <button className="bg-black text-white px-4 py-2 w-full">
            Add Project
          </button>

        </form>
      </div>

    </div>

  )

}