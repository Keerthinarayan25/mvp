"use client";

import { useEffect, useState } from "react";

import ProjectsSection from "@/components/project/ProjectSection";

import CreateProjectModal from "@/components/project/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

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

export default function FounderProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?mine=true", {
        cache: "no-store",
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setProjects(data);

    } catch (error) {
      console.log("ERROR IN FOUNDER PROJECT PAGE:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.activeRole !== "founder") {
      router.push("/projects");
      return;
    }
    fetchProjects();
  }, [user,router]);


  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            My Projects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage projects and hire developers
          </p>

        </div>

        {user?.activeRole !== "developer" && (
          <Button
            onClick={() => setShowCreate(true)}
            className="text-white rounded-xl hover:opacity-90 transition"
          >
            + Create Project
          </Button>
        )
        }

      </div>

      {/* PROJECTS */}
      <ProjectsSection
        projects={projects}
        isOwner={true}
      />
      {/* CREATE MODAL */}
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchProjects();
          }}
        />
      )}

    </div>
  );
}