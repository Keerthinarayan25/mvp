"use client"

import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation"
import { useState } from "react";


export default function CreateprojectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetRange: "",
    timeline: "",
    techStack: "",
  });

  if (user?.activeRole !== "founder") {
    return (
      <div className="p-10">
        Access Denied
      </div>
    );
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Failed to create project");
        return;
      }
      const created = await res.json();
      router.push("/founder/projects");
    } catch (error) {
      console.log("ERROR IN CREATE:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          placeholder="Project Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <textarea
          placeholder="Project Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Budget"
          className="w-full border p-2"
          value={form.budgetRange}
          onChange={(e) =>
            setForm({ ...form, budgetRange: e.target.value })
          }
        />

        <input
          placeholder="Timeline"
          className="w-full border p-2"
          value={form.timeline}
          onChange={(e) =>
            setForm({ ...form, timeline: e.target.value })
          }
        />

        <input
          placeholder="Tech Stack"
          className="w-full border p-2"
          value={form.techStack}
          onChange={(e) =>
            setForm({ ...form, techStack: e.target.value })
          }
        />

        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Post Project"}
        </button>

      </form>
    </div>
  )
}