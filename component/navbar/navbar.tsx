"use client"

import { User } from "@/types/user"
import Link from "next/link";
import { useEffect, useState } from "react"



export default function Navbar(){

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
    .then(res => res.json())
    .then(data => setUser(data))
  },[]);

  console.log("User data is :",user?.role)

  return(
    <nav className="border-b p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">
        MVP DEV
      </h1>

      <div className="flex gap-4">
        {!user && (
          <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          </>
        )}

        {user?.role === "developer" && (
          <>
          <Link href="/developer/dashboard">Dashboard</Link>
          <Link href="/developer/projects">Projects</Link>
          <Link href={`/developer/profile/view/${user.id}`}>Profile</Link>
          </>
        )}

        {user?.role === "founder" && (
          <>
          <Link href="/founder/dashboard">Dashboard</Link>
          <Link href="/founder/projects">My Projects</Link>
          <Link href="/founder/profile/create">Profile</Link>
          </>
        )}
      </div>
    </nav>
  )
}