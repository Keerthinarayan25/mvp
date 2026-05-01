type Props = {
  project: {
    title: string;
    description: string;
    projectLink: string;
    githubLink: string;
  };
};

export default function PortfolioCard({ project }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col justify-between transition hover:shadow-md hover:-translate-y-1">
      
      <div>
        <h3 className="text-md font-semibold mb-2">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3">
          {project.description}
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        {project.projectLink && (
          <a
            href={project.projectLink}
            target="_blank"
            className="flex-1 text-center text-sm px-3 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Live
          </a>
        )}

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            className="flex-1 text-center text-sm px-3 py-2 rounded-lg border hover:bg-gray-100"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}