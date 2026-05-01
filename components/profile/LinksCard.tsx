type Props = {
  github: string;
  linkedin: string;
};

export default function LinksCard({ github, linkedin }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex gap-4">

      {github && (
        <a
          href={github}
          target="_blank"
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          GitHub
        </a>
      )}

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          LinkedIn
        </a>
      )}

    </div>
  );
}