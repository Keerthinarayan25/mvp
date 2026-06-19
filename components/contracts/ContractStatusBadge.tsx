type Props = {
  status:
  | "active"
  | "awaiting_handoff"
  | "completed"
  | "cancelled";
};

export default function ContractStatusBadge({
  status,
}: Props) {

  const styles: Record<string, string> = {
    pending_funding: "bg-yellow-100 text-yellow-700",

    active: "bg-blue-100 text-blue-700",

    awaiting_handoff: "bg-yellow-100 text-yellow-700",

    completed: "bg-green-100 text-green-700",

    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-medium
        ${styles[status] ?? "bg-gray-100 text-gray-700"}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );

}