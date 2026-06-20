type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const styles: Record<string, string> = {
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200",

    accepted:
      "bg-green-50 text-green-700 border border-green-200",

    rejected:
      "bg-red-50 text-red-700 border border-red-200",

    completed:
      "bg-green-50 text-green-700 border border-green-200",

    active:
      "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`
        px-3 py-1
        rounded-full
        text-xs
        font-semibold
        capitalize
        ${styles[status] ?? "bg-gray-50 text-gray-700 border border-gray-200"}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}