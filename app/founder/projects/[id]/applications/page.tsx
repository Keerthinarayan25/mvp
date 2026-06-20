"use client";

import ApplicationCard from "@/components/Application/ApplicationCard";
import ProjectCard from "@/components/project/ProjectCard";
import { useParams } from "next/navigation";

import { useEffect, useState, } from "react";
import { toast } from "sonner";

type Application = {
  id: number;
  proposalMessage: string;
  proposedPrice: number;
  currency: string;
  deliveryValue: number;
  deliveryUnit: string;
  status: string;
  developer: {
    id: number;
    name: string;
  };
};

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
  applications: Application[];
};

export default function ProjectApplicationPage() {

  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/projects/${id}/applications`
    )
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      });

  }, [id]);

  console.log("PROJECTS in founder page:", project);

  const handleHire = async (
    applicationId: number
  ) => {

    const res = await fetch(
      `/api/applications/${applicationId}/hire`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    toast.success("Developer hired successfully");

    window.location.reload();
  };


  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10">
        Project not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">

      {/* PROJECT */}
      <ProjectCard key={project.id} project={project} />

      {/* APPLICATIONS */}
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">
          Applications
        </h2>

        {project.applications?.length === 0 ? (

          <div className="border rounded-xl p-10 text-center text-gray-500">
            No applications yet.
          </div>

        ) : (

          project.applications?.map(
            (app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onHire={handleHire}
              />
            )
          )
        )}
      </div>
    </div>
  );
}