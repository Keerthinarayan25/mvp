import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  image: string;
  bio: string;
  contractCount: number;
  skillsCount: number;
};

export default function ProfileHeader({
  name,
  image,
  bio,
  contractCount,
  skillsCount,
}: Props) {

  const router = useRouter();
  <button onClick={() => router.push("/developer/profile/edit")}>
    Edit Profile
  </button>


  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">

      <div className="flex gap-4 items-center">
        <Image
          src={image}
          className="w-16 h-16 rounded-full object-cover"
          width={50}
          height={50}
          alt="profileImage"
        />

        <div>
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-sm text-gray-500">{bio}</p>

          <div className="flex gap-4 mt-2 text-xs text-gray-600">
            <span>{contractCount} projects</span>
            <span>{skillsCount} skills</span>
          </div>
        </div>
      </div>

      <button className="text-sm px-4 py-2 border rounded-lg">
        Edit
      </button>
    </div>
  );
}