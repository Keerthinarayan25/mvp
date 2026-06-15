"use client"

import { useEffect, useState } from "react"
import ProjectCard from "@/components/project/ProjectCard"

type Project = {
  id: number;
  founderId: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  timelineValue: number;
  timelineUnit: string;
  techStack: string[];
  experienceLevel: string;
  status: string;
};

export default function ProjectsPage() {

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