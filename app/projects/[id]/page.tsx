"use client"

import ProposalForm from "@/components/project/ProposalForm";
import { useAuth } from "@/store/useAuth"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

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
  experienceLevel: string;
  techStack: string[];
};

export default function ProjectDetailPage() {

  const { id } = useParams();
  const { user } = useAuth();
  const [project, setproject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setproject(data);
        setLoading(false);
      })
  }, [id])


  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="p-18">Project Not Found</div>
  }

  const isOwner = user?.id === project.founderId;
  const canApply = user && user.activeRole === "developer" && !isOwner;


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* PROJECT CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" >
          {/* Title */}
          <div>
            <h1 className=" text-2xl sm:text-3xl font-bold text-slate-900 ">
              {project.title}
            </h1>

            <p className=" mt-4 text-slate-600 leading-relaxed " >
              {project.description}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm " >
            <span>
              💰 Budget:
              <span className="font-medium text-green-600 ml-1">
                {project.currency}
                {" "}
                {project.budgetMin}
                -
                {project.budgetMax}
              </span>
            </span>

            <span>
              ⏳ Timeline:
              <span className="font-medium ml-1">
                {project.timelineValue}
                {" "}
                {project.timelineUnit}
              </span>
            </span>

            <span>
              🚀 Experience:
              <span className="font-medium ml-1">
                {project.experienceLevel}
              </span>
            </span>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h2 className=" text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3 " >
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* OWNER */}
        {isOwner && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-medium text-blue-700">
              You created this project.
            </p>

            <p className="text-blue-600 text-sm mt-1">
              You cannot apply to your own project.
            </p>
          </div>
        )}

        {/* WRONG ROLE */}
        {!isOwner &&
          user &&
          user.activeRole !== "developer" && (
            <div className="mt-6  bg-amber-50 border border-amber-200 rounded-xlp-4" >
              <p className="text-amber-700">
                Switch to developer mode to apply.
              </p>
            </div>
          )}

        {/* NOT LOGGED IN */}
        {!user && (
          <div className=" mt-6 bg-slate-100 border border-slate-200 rounded-xl p-4 ">
            <p className="text-slate-700">
              Login as a developer to submit a proposal.
            </p>
          </div>
        )}

        {/* APPLY */}
        {canApply && (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm ">
            <h2 className=" text-xl font-semibold text-slate-900 mb-5" >
              Submit Proposal
            </h2>

            <ProposalForm
              projectId={project.id}
              currency={project.currency}
            />
          </div>
        )}
      </div>
    </div>
  );
}