"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


interface Project{
  id:number,
  title:string,
  description: string,
  budgetRange: string,
  status: string
}


export default function FounderProjectsPage(){

  const[projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects/?mine=true")
    .then(res => res.json())
    .then(data => setProjects(data))
  },[]);

  return(

    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">
        My Projects
      </h1>

      {projects.length === 0 && (
        <p className="text-2xl text-gray-500">
          No Projects Posted Yet !
        </p>
      )}
      {projects.map((project) => (
        <div
        key={project.id}
        className="border p-4 rounded-2xl space-y-6"
        >
          <h2 className="text-lg font-semibold">
            {project.title}
          </h2>

          <p className="text-gray-800">
            {project.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              💰 {project.budgetRange}
            </span>

            <span className="text-sm">
              Status: {project.status}
            </span>
          </div>

          <Link
          href={`/founder/projects/${project.id}/applications`}
          className="text-blue-500 text-sm"
          >
          View Applications 
          </Link>

        </div>
      ))}
    </div>
  )
}