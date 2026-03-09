"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";


export default function DeveloperDashboard(){
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
    .then(res => res.json())
    .then(data => setUser(data));
  }, []);

  if(!user) return <div>Loading...</div>;

  return(
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <p className="mt-4 text-gray-600">
        This is your developer Dashboard.
      </p>
    </div>
  );

}