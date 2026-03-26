"use client";

import { User } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function DeveloperDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <h1 className="text-2xl font-bold">
        Developer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/developer/projects"
        className="border p-4 rounded hover:shadow"
        >
          Browse Projects
        </Link>
        <Link
          href="/developer/profile/view"
          className="border p-4 rounded hover:shadow"
        >
          View Profile
        </Link>
        <Link
        href="/developer/profile/create"
        className="border p-4 rounded hover:shadow"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );

}