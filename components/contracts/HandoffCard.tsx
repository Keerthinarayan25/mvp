type Props = {
  handoff: {
    sourceCodeUrl: string;
    documentationUrl?: string;
    notes?: string;
    unlocked: boolean;
    createdAt: string;
  };
};

export default function HandoffCard({
  handoff,
}: Props) {

  if (!handoff.unlocked) {
    return (
      <div className="border rounded-xl p-5">

        <h2 className="font-semibold">
          Final Source Uploaded
        </h2>

        <p className="text-gray-500 mt-2">
          Source code is locked.
        </p>

        <p className="text-sm text-orange-600 mt-2">
          Release escrow to unlock source code.
        </p>

      </div>
    );
  }

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
        Source Code
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
      Escrow Released ✅
      Contract Completed ✅

    </div>
  );
}