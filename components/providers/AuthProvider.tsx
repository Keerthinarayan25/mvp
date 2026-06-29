"use client";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";

export default function AuthProvider({ children }:
  { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        if (data.error) {
          setUser(null);
          return;
        }
        
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);

      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [setUser, setLoading]);

  return <>{children}</>
}