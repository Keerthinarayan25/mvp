"use client";

type Props = {
  contractId: number;
  onRefresh: () => void;
};

export default function ApproveButtons({
  contractId,
  onRefresh,
}: Props) {

  const approve =
    async () => {

      const res = await fetch(`/api/contracts/${contractId}/approve`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        onRefresh();
      }
    };

  return (
    <div className="border rounded-xl p-5">

      <h3 className="font-semibold mb-3">
        Work Review
      </h3>

      <p className="text-gray-600 mb-4">
        Approve the work if you are
        satisfied with the latest
        delivery.
      </p>

      <button
        onClick={approve}
        className="bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        Approve Work
      </button>

    </div>
  );
}