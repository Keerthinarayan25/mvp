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

    <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Projects
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {isOwner
              ? "Projects you've posted"
              : "Available opportunities"}
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => setShowCreate(true)}
            className="rounded-lg"
          >
            + Create Project
          </Button>
        )}
      </div>

      {/* EMPTY */}

      {projects.length === 0 ? (
        <div className="border rounded-2xl py-14 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">
            No projects available yet.
          </p>
        </div>

      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

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