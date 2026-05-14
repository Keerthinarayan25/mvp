"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


interface Project {
  id: number,
  title: string,
  description: string,
  budgetRange: string,
  status: string
}


export default function FounderProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects?mine=true",
          { cache: "no-store" },
        );

        if (!res.ok) return;

        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.log("ERROR IN FOUNDER PROJECT PAGE:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          My Projects
        </h1>

        <Link
          href="/founder/projects/create"
          className="bg-black text-white px-2 py-2 rounded-lg"
        >
          Create Project
        </Link>

      </div>
      {projects.length === 0 && (
        <p className="text-gray-500">
          No Projects Posted Yet !
        </p>
      )}
      {projects.map((project) => (
        <div
          key={project.id}
          className="border p-5 rounded-xl space-y-6"
        >
          <h2 className="text-lg font-semibold">
            {project.title}
          </h2>

          <p className="text-gray-800 mt-2">
            {project.description}
          </p>

          <div className="flex justify-between items-center text-sm">
            <span className="text-sm text-gray-500">
              💰 {project.budgetRange}
            </span>

            <span className="text-sm">
              Status: {" "} {project.status}
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