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

    <div className="border rounded-lg p-4 hover:shadow-md transition">

      <h2 className="text-lg font-semibold">
        {project.title}
      </h2>

      <p className="text-gray-600 mt-2 line-clamp-2">
        {project.description}
      </p>

      <div className="flex justify-between items-center mt-4">

        <span className="text-sm text-gray-500">
          💰 {project.budgetRange}
        </span>

        <span className="text-sm text-gray-500">
          ⚙️ {project.techStack}
        </span>

      </div>

      <Link
        href={`/developer/projects/${project.id}`}
        className="text-blue-500 mt-3 inline-block"
      >
        View Project →
      </Link>

    </div>

  )

}