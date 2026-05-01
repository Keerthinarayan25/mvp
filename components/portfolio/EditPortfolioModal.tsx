"use client";

import { useState } from "react";
import SmartUrlInput from "./SmartUrlInput";

interface Portfolio {
  project: {
    id: number;
    title: string;
    description: string;
    projectLink: string;
    githubLink: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditPortfolioModal({
  project,
  onClose,
  onUpdated,
}: Portfolio) {
  const [form, setForm] = useState({
    title: project.title,
    description: project.description,
    projectLink: project.projectLink,
    githubLink: project.githubLink,
  });

  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const updatedData: Partial<typeof form> = {};

    if (form.title !== project.title && form.title.trim()) {
      updatedData.title = form.title;
    }

    if (
      form.description !== project.description &&
      form.description.trim()
    ) {
      updatedData.description = form.description;
    }

    if (
      form.projectLink !== project.projectLink &&
      form.projectLink.trim()
    ) {
      updatedData.projectLink = form.projectLink;
    }

    if (
      form.githubLink !== project.githubLink &&
      form.githubLink.trim()
    ) {
      updatedData.githubLink = form.githubLink;
    }


    if (Object.keys(updatedData).length === 0) {
      setError("No changes made");
      return;
    }

    const res = await fetch(`/api/portfolio/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      onUpdated();
      onClose();
    } else {
      setError("Update failed");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold">Edit Project</h2>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Project Title"
            value={form.title}
            className="w-full border p-2"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            className="w-full border p-2"
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

          <button className="bg-black text-white w-full p-2 rounded hover:bg-gray-800">
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}