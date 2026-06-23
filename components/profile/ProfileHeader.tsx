import Image from "next/image";
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



  return (
    <div className=" bg-white border  border-slate-200 rounded-3xl p-6 md:p-8  shadow-sm">
      <div className=" flex flex-col lg:flex-row lg:items-center lg:justify-between  gap-6">
        {/* LEFT */}
        <div className="flex items-start gap-5">
          <Image
            src={image || "/profile.svg"}
            alt={name}
            width={120}
            height={120}
            className="w-24  h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-slate-100"
          />

          <div>
            <h1 className=" text-2xl md:text-3xl font-bold text-slate-900">
              {name}
            </h1>

            {subtitle && (
              <p className=" text-slate-500 mt-1 text-sm md:text-base">
                {subtitle}
              </p>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 ">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className=" px-4 py-2 rounded-xl  bg-slate-50 border  border-slate-200 "
                  >
                    <div className="font-bold text-slate-900">
                      {s.value}
                    </div>

                    <div className=" text-xs text-slate-500"                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row gap-3"        >
          <Button
            onClick={onEdit}
            className=" rounded-xl px-6 "
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}