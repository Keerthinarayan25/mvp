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
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Developers Worked With
        </h2>

        <p className="text-sm text-gray-500">
          No developers hired yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Developers Worked With
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {developers.map((developer) => (

          <Link
            key={developer.id}
            href={`/profile/developer/${developer.id}`}
            className="border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition"
          >

            <Image
              src={
                developer.profileImage ||
                "/profile.svg"
              }
              alt="developer"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />

            <div>
              <h3 className="font-medium">
                {developer.name}
              </h3>

              <p className="text-sm text-gray-500">
                Developer
              </p>
            </div>

          </Link>

        ))}

      </div>
    </div>
  );
}