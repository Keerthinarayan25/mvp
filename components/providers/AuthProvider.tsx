"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";

export default function AuthProvider({ children }:
  { children: React.ReactNode; }) {

  const { user, setUser, } = useAuth();

  useEffect(() => {
    if (user) return;

    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {

        if (!data.error) {
          setUser(data);
        }

      });

  }, [user, setUser]);

  return <>{children}</>;
}