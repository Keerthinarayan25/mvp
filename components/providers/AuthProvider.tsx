"use client";

import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";



export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { setUser, setLoading} = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try{
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data);
      }finally{
        setLoading(false);
      }
    };
    loadUser();
  },[]);

  return <>{children}</>
}