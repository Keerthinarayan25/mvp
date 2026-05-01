interface Portfolio {
  id: number;
  title: string;
  description: string;
  projectLink: string;
  githubLink: string;
}

export default function PortfolioSection({
  portfolio,
  onDelete,
  onEdit,
  onAdd,
}: {
  portfolio: Portfolio[];
  onDelete: (id: number) => void;
  onEdit: (project: Portfolio) => void;
  onAdd: () => void;
}) {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Portfolio</h2>

        <button
          onClick={onAdd}
          className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-90"
        >
          + Add Project
        </button>
      </div>

      {/* EMPTY STATE */}
      {portfolio.length === 0 ? (
        <p className="text-sm text-gray-500">
          No projects added yet.
        </p>
      ) : (

        /* GRID */
        <div className="grid md:grid-cols-2 gap-4">

          {portfolio.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm p-5 flex flex-col justify-between transition hover:shadow-md hover:-translate-y-1 relative group"
            >

              {/* DELETE / EDIT ACTIONS */}
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">

                <button
                  onClick={() => onEdit(project)}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(project.id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Delete
                </button>

              </div>

              {/* CONTENT */}
              <div>
                <h3 className="text-md font-semibold mb-2">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* LINKS */}
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
          ))}

        </div>
      )}

    </div>
  );
}