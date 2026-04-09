import { useState } from "react";

interface Props {
  project: {
    id: number,
    title: string,
    description: string,
    projectLink: string,
    githubLink: string
  };
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function PortfolioCard({ project, onDelete, onEdit }: Props) {

  const [hovered, setHovered] = useState(false);

  const formatUrl = (url: string) => {
    if (!url.startsWith("http")) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div
      className="relative border rounded-lg p-4 hover:shadow transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute top-2 right-8 flex gap-2">
          <button onClick={() => onEdit(project)}>✏️</button>
          <button onClick={() => onDelete(project.id)}>🗑</button>
        </div>
      )}
      <h3 className="font-semibold text-lg">
        {project.title}
      </h3>
      <p className="text-gray-600 mt-2">
        {project.description}
      </p>

      <div className="flex gap-4 mt-3 text-sm">
        <a
          href={formatUrl(project.projectLink)}
          target="_blank"
          className="text-blue-500">
          Live Project
        </a>

        <a
          href={project.githubLink}
          target="_blank"
          className="text-blue-500">
          GitHub
        </a>
      </div>
    </div>
  )
}