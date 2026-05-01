
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { User } from 'lucide-react';


export default function ProfileDropdown({ user }: { user: any }) {

  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/auth/logout",{
      method: "POST"
    });

    setUser(null);
    router.push("/login");
    router.refresh();
  }



  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Image
          src={user.profileImage || <User />}
          alt="profileImage"
          width={36}
          height={36}
          className="rounded-full object-cover cursor-pointer border"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl p-2"
      >

        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <Image
            src={user.profileImage}
            alt="profileImage"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />

          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link
            href={`/${user.role}/profile/view/${user.id}`}
            className="px-2 py-2 rounded hover:bg-gray-100"
          >
            Your Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator/>

        <Button 
        onClick={handleLogout}
        className="w-full text-red-500 focus:text-red-500">
          Log Out
        </Button>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}