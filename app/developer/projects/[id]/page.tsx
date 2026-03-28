"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Project {
  id: number
  title: string
  description: string
  budgetRange: string
  timeline: string
  techStack: string
}

export default function ProjectDetailPage() {

  const { id } = useParams();
  const [project, setproject] = useState<Project | null>(null);

  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setproject(data))
  }, [id])

  const handleApply = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault()

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        projectId: Number(id),
        proposalMessage: proposal,
        proposedPrice: price,
        deliveryTime: delivery,
      }),
    })

    if (res.ok) {
      alert("Proposal submitted ✅")
    } else {
      alert("Failed to apply")
    }
  }

  if (!project) {
    return <div className="p-18">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        {project.title}
      </h1>

      <h2 className="font-semibold">Project Description</h2>
      <p className="text-gray-700 mt-2">
        {project.description}
      </p>
      <div className="flex gap-6 text-gray-600">
        <span>💰 Budget: {project.budgetRange}</span>
        <span>⏳ Timeline: {project.timeline}</span>
      </div>

      <div>
        <h2 className="font-semibold">Tech Stack</h2>
        <p>{project.techStack}</p>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">
          Submit proposal
        </h2>

        <form onSubmit={handleApply} className="space-y-4">

          <textarea
            placeholder="write your proposal (cover letter)"
            className="w-full border p-2"
            onChange={(e) => setProposal(e.target.value)}
          />

          <textarea
            placeholder="Your Price (e.g. $2500"
            className="w-full border p-2"
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Delivery Time (e.g. 21 Days"
            className="w-full border p-2"
            onChange={(e) => setDelivery(e.target.value)}
          />

          <button className="bg-black text-white px-4 py-2">
            Submit Proposal
          </button>

        </form>
      </div>
    </div>
  )
}