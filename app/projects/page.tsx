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

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse space-y-4">

          <div className="h-8 w-60 bg-slate-200 rounded" />

          <div className="h-40 bg-slate-200 rounded-2xl" />

          <div className="h-40 bg-slate-200 rounded-2xl" />

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900 ">
            Available Projects
          </h1>

          <p className="text-slate-500 mt-2">
            Discover projects posted by founders and start building.
          </p>

        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className=" bg-white border   border-dashed border-slate-300 rounded-2xl p-12 text-center "
          >
            <h3 className=" text-lg font-semibold text-slate-700" >
              No projects available
            </h3>

            <p className="text-slate-500 mt-2">
              Check back later for new opportunities.
            </p>
          </div>
        ) : (

          <div className="space-y-5">

            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}

          </div>

        )}
      </div>
    </div>
  );

}