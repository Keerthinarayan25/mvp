import Link from "next/link"
import StatusBadge from "./Statusbadge";

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
  project: Project;
  isOwner?: boolean;
};

export default function ProjectCard({
  project,
  isOwner = false,
}: Props) {

  console.log("Projects in project card:", project);

  return (

    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className=" flex flex-col lg:flex-row justify-between gap-4 ">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 " >
            {project.title}
          </h1>

          <p className=" mt-3 text-slate-600  leading-relaxed  "   >
            {project.description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className=" mt-5  flex flex-wrap  gap-x-8 gap-y-2 text-sm text-slate-600" >
        <span>
          💰 {project.currency} {project.budgetMin} - {project.budgetMax}
        </span>

        <span>
          ⏳ {project.timelineValue} {project.timelineUnit}
        </span>

        <span>
          🚀 {project.experienceLevel}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap  gap-2  "       >
        {(project.techStack ?? []).map((tech) => (
          <span
            key={tech}
            className="  px-3 py-1 rounded-md  bg-slate-100 text-slate-700  text-sm ">
            {tech}
          </span>
        ))}
      </div>

      {/* ACTION */}
      <div className="mt-6">
        <Link
          href={
            isOwner
              ? `/founder/projects/${project.id}/applications`
              : `/projects/${project.id}`
          }
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >

          {isOwner
            ? "Manage Project →"
            : "View Project →"}

        </Link>

      </div>

    </div>
  );

}