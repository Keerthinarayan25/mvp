import Image from "next/image";
import Link from "next/link";

type Developer = {
  id: number;
  name: string;
  profileImage?: string | null;
  role?: string;
};

type Props = {
  developers: Developer[];
};

export default function DevelopersWorkedSection({
  developers,
}: Props) {

  if (!developers || developers.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          Developers Worked With
        </h2>

        <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
          <p className="text-slate-500">
            No developers hired yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Developers Worked With
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Developers you ve successfully collaborated with
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {developers.map((developer) => (

          <Link
            key={developer.id}
            href={`/profile/developer/${developer.id}`}
            className="flex items-center gap-4 p-4 borderborder-slate-200  rounded-2xl hover:border-blue-300 hover:shadow-md transition-all bg-white"
          >

            <Image
              src={
                developer.profileImage ||
                "/profile.svg"
              }
              alt={developer.name}
              width={60}
              height={60}
              className="w-14 h-14  rounded-full object-cover border border-slate-200"
            />

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {developer.name}
              </h3>

              <p className="text-sm text-slate-500">
                Developer
              </p>
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}