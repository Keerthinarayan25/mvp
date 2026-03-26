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

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setproject(data))
  }, [id])

  if (!project) {
    return <div className="p-18">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        {project.title}
      </h1>
      <div className="flex gap-6 text-gray-600">
        <span>💰 Budget: {project.budgetRange}</span>
        <span>⏳ Timeline: {project.timeline}</span>
      </div>

      <div>
        <h2 className="font-semibold">Tech Stack</h2>
        <p>{project.techStack}</p>
      </div>

      <div>
        <h2 className="font-semibold">Project Description</h2>
        <p className="text-gray-700 mt-2">
          {project.description}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          Apply for this project
        </h2>

        <p className="text-gray-500">
          (Proposal form)
        </p>
      </div>
    </div>
  )
}