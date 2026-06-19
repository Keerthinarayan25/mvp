"use client";

type Props = {
  contractId: number;
  onUnlocked: () => void;
};

export default function UnlockSourceCodeButton({
  contractId,
  onUnlocked,
}: Props) {

  const handleUnlock = async () => {

    const confirmed = confirm(
      "Unlocking source code will release escrow and complete the contract."
    );

    if (!confirmed) {
      return;
    }

    const res = await fetch(`/api/contracts/${contractId}/unlock-source`,
      {
        method: "POST",
      }
    );

    if (res.ok) {

      alert("Escrow released and source code unlocked.");

      onUnlocked();

    } else {

      const data = await res.json();

      alert(data.error || "Failed");

    }

  };

  return (
    <button
      onClick={handleUnlock}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      Unlock Source Code
      <br />
      Release Escrow
    </button>
  );
}