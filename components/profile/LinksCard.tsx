

export default function LinksCard({ links }: { links: any[] }) {

  if (!links?.length) {
    return (
      <p className="text-sm text-slate-500">
        No links added yet.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
        >
          <span className="font-medium">
            {link.label}
          </span>

          <span className="text-slate-400">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}