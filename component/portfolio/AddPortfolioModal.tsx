"use client"

interface Props {
  onClose: () => void;
}
import { useState } from "react"

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
      !form.projectLink.trim() ||
      !form.githubLink.trim()
    ) {
      setError("All Fields are required");
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

          <input
            placeholder="Live Project URL"
            className="w-full border p-2"
            value={form.projectLink}
            onChange={(e) =>
              setForm({ ...form, projectLink: e.target.value })
            }
          />

          <input
            placeholder="GitHub URL"
            className="w-full border p-2"
            value={form.githubLink}
            onChange={(e) =>
              setForm({ ...form, githubLink: e.target.value })
            }
          />

          <button className="bg-black text-white px-4 py-2 w-full">
            Add Project
          </button>

        </form>
      </div>

    </div>

  )

}