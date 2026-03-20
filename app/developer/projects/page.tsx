"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Project {
  id: number
  title: string
  description: string
  budget: string
  techStack: string
}

export default function DeveloperProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {

    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))

  }, [])

  return (

    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-2xl font-bold mb-6">
        Available Projects
      </h1>

      <div className="space-y-4">

        {projects.map((project) => (

          <div
            key={project.id}
            className="border rounded-lg p-4 hover:shadow-md"
          >

            <h2 className="text-lg font-semibold">
              {project.title}
            </h2>

            <p className="text-gray-600 mt-2 line-clamp-2">
              {project.description}
            </p>

            <div className="flex justify-between items-center mt-4">

              <span className="text-sm text-gray-500">
                Budget: {project.budget}
              </span>

              <span className="text-sm text-gray-500">
                Stack: {project.techStack}
              </span>

            </div>

            <Link
              href={`/developer/projects/${project.id}`}
              className="text-blue-500 mt-3 inline-block"
            >
              View Project →
            </Link>

          </div>

        ))}

      </div>

    </div>

  )

}