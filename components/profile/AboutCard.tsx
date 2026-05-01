export default function AboutCard({ bio }: { bio: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="font-semibold mb-2">About</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        {bio || "No bio added"}
      </p>
    </div>
  );
}