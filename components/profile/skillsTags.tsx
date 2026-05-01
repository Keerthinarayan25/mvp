type Props = {
  skills: string[];
};

export default function SkillsTags({ skills }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 border"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}