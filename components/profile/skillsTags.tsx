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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Skills
        </h3>

        {onEdit && (
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">

        {skills.map((skill) => (
          <span
            key={skill}
            className="px-4 py-2 rounded-lgbg-gray-100 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}