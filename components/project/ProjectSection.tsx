import { Button } from "../ui/button";
import ProjectCard from "./ProjectCard";



export default function ProjectsSection({ projects = [] }: { projects: any[] }) {


  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-2xl text-gray-900">projects</h2>

        <Button className="px-4 py-2 rounded-lg text-sm font-medium">
          + Create Project
        </Button>

      </div>
      {projects.length == 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 text-base">
            No projects created yet. Start by creating your first project.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects
            ?.filter((p) => p?.id)
            .map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
        </div>
      )}
    </div>
  );
}