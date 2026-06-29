"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          setUser(null);

          // Don't redirect if already on login/register
          if (
            pathname !== "/login" &&
            pathname !== "/register"
          ) {
            router.replace("/login");
          }
          return;
        }

        const data = await res.json();

        if (!data) {
          setUser(null);

          if (
            pathname !== "/login" &&
            pathname !== "/register"
          ) {
            router.replace("/login");
          }
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);

        if (
          pathname !== "/login" &&
          pathname !== "/register"
        ) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [pathname, router, setLoading, setUser]);

  return <>{children}</>;
}