type Props = {
  handoff: {
    sourceCodeUrl: string;
    documentationUrl?: string;
    notes?: string;
    createdAt: string;
  };
};

export default function HandoffCard({
  handoff,
}: Props) {

  return (
    <div className="border rounded-xl p-5 space-y-4">

      <h2 className="font-semibold text-lg">
        Final Handoff
      </h2>

      <a
        href={handoff.sourceCodeUrl}
        target="_blank"
        className="block text-blue-600 underline"
      >
        Download Source Code
      </a>

      {handoff.documentationUrl && (
        <a
          href={handoff.documentationUrl}
          target="_blank"
          className="block text-blue-600 underline"
        >
          Documentation
        </a>
      )}

      {handoff.notes && (
        <p>
          {handoff.notes}
        </p>
      )}

      <p className="text-sm text-gray-500">
        Uploaded:
        {" "}
        {new Date(
          handoff.createdAt
        ).toLocaleString()}
      </p>

    </div>
  );
}