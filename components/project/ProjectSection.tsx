"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

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

type Props = {
  projects?: Project[];
  canCreate?: boolean;
  isOwner?: boolean;
  onCreated?: () => void;
};

export default function ProjectsSection({
  projects = [],
  canCreate = false,
  isOwner = false,
  onCreated,
}: Props) {

  const [showCreate, setShowCreate] = useState(false);

  return (
  <div>

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>

        <h2 className="text-xl font-semibold text-slate-900">
          Projects
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {isOwner
            ? "Projects you've posted"
            : "Available opportunities"}
        </p>

      </div>

      {canCreate && (
        <Button
          onClick={() => setShowCreate(true)}
          className="rounded-xl"
        >
          + Create Project
        </Button>
      )}
    </div>

    {/* EMPTY */}

    {projects.length === 0 ? (
      <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <p className="text-slate-500">
          No projects available yet.
        </p>
      </div>

    ) : (

      <div className="space-y-5">

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isOwner={isOwner}
          />
        ))}

      </div>

    )}

    {/* CREATE MODAL */}
    {showCreate && (
      <CreateProjectModal
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          onCreated?.();
        }}
      />
    )}

  </div>
);
}