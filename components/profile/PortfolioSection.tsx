import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
interface Portfolio {
  id: number;
  title: string;
  description: string;
  projectLink: string;
  githubLink: string;
}

type Props = {
  portfolio: Portfolio[];
  onDelete?: (id: number) => void;
  onEdit?: (project: Portfolio) => void;
  onAdd?: () => void;
};

export default function PortfolioSection({
  portfolio,
  onDelete,
  onEdit,
  onAdd,
}: Props) {

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className=" text-xl font-semibold text-slate-900" >
            Portfolio
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Showcase your best work
          </p>
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm ont-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Project
          </button>
        )}
      </div>

      {/* EMPTY */}
      {portfolio.length === 0 ? (
        <div
          className=" border border-dashed border-slate-300 rounded-xl p-10 text-center"
        >
          <p className="text-slate-500">
            No projects added yet.
          </p>
        </div>
      ) : (
        <div className=" grid md:grid-cols-2 gap-5 " >
          {portfolio.map((project) => (
            <div
              key={project.id}
              className=" border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200   transition-all "
            >
              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mb-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(project)}
                    className=" p-2 rounded-lg hover:bg-slate-100 "
                  >
                    <Pencil
                      size={16}
                      className="text-slate-600"
                    />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(project.id)}
                    className=" p-2 rounded-lg hover:bg-red-50 "
                  >
                    <Trash2
                      size={16}
                      className="text-red-600"
                    />
                  </button>
                )}
              </div>

              {/* CONTENT */}
              <div>
                <h3 className=" text-lg font-semibold text-slate-900 ">
                  {project.title}
                </h3>

                <p className=" mt-3 text-slate-600 text-sm leading-relaxed line-clamp-4 " >
                  {project.description}
                </p>
              </div>

              {/* LINKS */}
              <div className="flex gap-3 mt-6">
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3   py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                  >
                    <ExternalLink size={15} />
                    Live Demo
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
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