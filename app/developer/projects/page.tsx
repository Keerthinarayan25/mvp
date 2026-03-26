"use client"

import { useEffect, useState } from "react"
import ProjectCard from "@/component/project/ProjectCard"

interface Project {
  id: number
  title: string
  description: string
  budgetRange: string
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
          <ProjectCard key={project.id} project={project} />
        ))}

      </div>

    </div>

  )

}