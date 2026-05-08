import Link from "next/link"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    budgetRange: string
    techStack: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {

  return (

    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-white group">

      <h2 className="text-lg font-semibold text-gray-900">
        {project.title}
      </h2>

      <p className="text-gray-600 mt-3 line-clamp-2 text-sm">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-3 mt-5">

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
          💰 {project.budgetRange}
        </span>

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-600  text-xs font-medium rounded-full">
          ⚙️ {project.techStack}
        </span>

      </div>

      <Link
        href={`/developer/projects/${project.id}`}
        className="text-blue-600 hover:text-blue-800 font-medium mt-4 inline-flex items-center gap-1 group/link transition"
      >
        View Project →
      </Link>

    </div>

  )

}