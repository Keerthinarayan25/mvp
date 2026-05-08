

export default function LinksCard({ links }: { links: any[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex gap-4">

      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          className="px-4 py-2 border rounded-lg text-sm"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}