"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";


export default function CreateprojectPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    bugetRange: "",
    timeline: "",
    techStack: "",
  })

  const handleSubmit = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/founder/dashboard")
    }

  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Create New Project
      </h1>

      <form
        onSubmit={ handleSubmit }
        className="space-y-4"
      >
        <input
          placeholder="Project Title"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <textarea
          placeholder="Project Description"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Budget"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, bugetRange: e.target.value })
          } 
        />

        <input
          placeholder="Timeline"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, timeline: e.target.value })
          } 
        />

        <input
          placeholder="Tech Stack"
          className="w-full border p-2"
          onChange={(e) =>
            setForm({ ...form, techStack: e.target.value })
          } 
        />

        <button className="bg-black text-white px-4 py-2">
          Post Project
        </button>

      </form>
    </div>
  )
}