import Link from "next/link"

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

  return (

    <div className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">

      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">

          <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.title}
          </h2>

          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
            {project.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {project.description}
        </p>

      </div>

      {/* META */}
      <div className="mt-5 flex flex-wrap gap-2">
        {/* BUDGET */}
        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
          💰 {" "}
          {project.currency}
          {" "}
          {project.budgetMin}
          -
          {project.budgetMax}
        </span>

        {/* TIMELINE */}
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">

          ⏳
          {" "}
          {project.timelineValue}
          {" "}
          {project.timelineUnit}
        </span>

        {/* EXPERIENCE */}

        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium capitalize">

          🚀
          {" "}
          {project.experienceLevel}
        </span>

      </div>

      {/* SKILLS */}

      <div className="flex flex-wrap gap-2 mt-4">
        {project.techStack?.slice(0, 4).map((skill, i) => (

          <span
            key={i}
            className="px-2 py-1 rounded-md border text-xs bg-gray-50"
          >
            {skill}
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