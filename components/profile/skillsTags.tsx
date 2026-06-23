import { Pencil } from "lucide-react";

type Props = {
  skills: string[];
  onEdit?: () => void;
};

export default function SkillsTags({
  skills,
  onEdit,
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-slate-900 " >
          Skills
        </h2>

        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-slate-100 transition "
          >
            <Pencil
              size={18}
              className="text-slate-500"
            />
          </button>
        )}
      </div>

      {/* Empty State */}
      {skills.length === 0 ? (
        <div className="borderborder-dashed border-slate-300 rounded-xl p-6 text-center ">
          <p className="text-slate-500">
            No skills added yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-full bg-blue-50 text-green-600 border border-blue-100 text-sm font-medium hover:bg-blue-100 transition"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}