"use client";

type Props = {
  contractId: number;
  onCancelled: () => void;
};

export default function CancelContractButton({
  contractId,
  onCancelled,
}: Props) {

  const cancelContract = async () => {

    const confirmed = confirm("Are you sure you want to cancel this contract?");

    if (!confirmed) {
      return;
    }

    const res = await fetch(`/api/contracts/${contractId}/cancel`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    onCancelled();
  };

  return (
    <button onClick={cancelContract}    >
      Cancel Contract
    </button>
  );
}