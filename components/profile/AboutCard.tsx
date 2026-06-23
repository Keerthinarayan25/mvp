type Props = {
  bio: string;
};

export default function AboutCard({ bio }: Props) {
  return (
    <div>
      <div >
        <h2 className="text-xl font-semibold text-slate-900">
          About
        </h2>
      </div>

      {bio ? (
        <p className="text-slate-600 leading-7 whitespace-pre-line">
          {bio}
        </p>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">
          <p className="text-slate-500">
            No bio added yet.
          </p>
        </div>
      )}
    </div>
  );
}