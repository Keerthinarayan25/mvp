
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { AuthUser } from "@/types/user";
import { useState } from "react";
import EditProfileModal from "../profile/EditProfileModal";


type Props = {
  user: AuthUser;
};

export default function ProfileDropdown({ user }: Props) {

  const router = useRouter();
  const { setUser } = useAuth();
  console.log("USER:", user);

  const [showFounderModal, setShowFounderModal] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  const switchRole = async (role: string) => {
    const res = await fetch("/api/auth/switch-role", {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ role }),
    }
    );

    if (!res.ok) return;

    const updatedUser = await res.json();
    setUser(updatedUser);
    if (role === "developer") {
      router.push("/developer/dashboard");

    } else {
      router.push("/founder/dashboard");
    }
    // router.refresh();
  };


  const handleFounderSuccess = async () => {
    const me = await fetch("/api/auth/me");
    const updatedUser = await me.json();
    setUser(updatedUser);
    setShowFounderModal(false);
    router.refresh();
  }



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            src={user.profileImage || "/profile.svg"}
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
              src={user.profileImage || "/public/profile.svg"}
              alt="profileImage"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />

            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.activeRole}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link
              href={`/profile/${user.activeRole}/${user.id}`}
              className="px-2 py-2 rounded hover:bg-gray-100"
            >
              Your Profile
            </Link>
          </DropdownMenuItem>



          {user.roles.length > 1 && (
            <>
              <DropdownMenuSeparator />

              <p className="px-2 py-1 text-xs text-gray-500">
                Switch Role
              </p>

              {user.roles.includes("developer") && user.activeRole !== "developer" && (
                <DropdownMenuItem
                  onClick={() =>
                    switchRole("developer")
                  }
                >
                  Developer Mode
                </DropdownMenuItem>
              )}

              {user.roles.includes("founder") && user.activeRole !== "founder" && (
                <DropdownMenuItem
                  onClick={() =>
                    switchRole("founder")
                  }
                >
                  Founder Mode
                </DropdownMenuItem>
              )}

            </>
          )}
          <DropdownMenuSeparator />

          {!user.roles.includes("founder") && (

            <DropdownMenuItem onClick={() => setShowFounderModal(true)}>
              Become a Founder
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <Button
            onClick={handleLogout}
            className="w-full text-red-500 focus:text-red-500">
            Log Out
          </Button>

        </DropdownMenuContent>

      </DropdownMenu>

      {showFounderModal && (
        <EditProfileModal
          role="founder"

          onClose={() => setShowFounderModal(false)}
          onSuccess={() => { handleFounderSuccess(); }}
        />
      )}
    </>
  );
}