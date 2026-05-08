import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  name: string;
  image: string;
  subtitle?: string; 
  stats?: {
    label: string;
    value: number;
  }[];

  onEdit?: () => void;
};

export default function ProfileHeader({
  name,
  image,
  subtitle,
  stats = [],
  onEdit,
}: Props) {

  const router = useRouter();
  const params = useParams();
  const role = params.role;


  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">

      <div className="flex gap-4 items-center">
        <Image
          src={image || "/public/profile.svg"}
          className="w-16 h-16 rounded-full object-cover"
          width={50}
          height={50}
          alt="profileImage"
        />

        <div>
          <h1 className="text-lg font-semibold">{name}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}

          {stats.length > 0 && (
            <div className="flex gap-4 mt-2 text-xs text-gray-600">
              {stats.map((s, i) => (
                <span key={i}>
                  <strong>{s.value}</strong> {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button onClick={onEdit}>
        Edit Profile
      </Button>
    </div>
  );
}