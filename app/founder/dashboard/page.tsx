"use client";

import { User } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function FounderDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Founder Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/founder/projects/create"
          className="border p-4 rounded hover:shadow"
        >
          Post New Project
        </Link>

        <Link
          href="/founder/projects"
          className="border p-4 rounded hover:shadow"
        >
          View My Project
        </Link>
      </div>
    </div>
  )
}