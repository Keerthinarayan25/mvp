"use client"

import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/store/useAuth";



export default function Navbar() {

  const { user, loading } = useAuth();


  if (loading) return null;

  return (
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

        {user?.activeRole === "developer" && (
          <>
            <Link href="/developer/contracts">My Work</Link>
            <Link href="/developer/dashboard">Dashboard</Link>
            <Link href="/projects">Projects</Link>
          </>
        )}

        {user?.activeRole === "founder" && (
          <>
            <Link href="/founder/contracts">Contracts</Link>
            <Link href="/founder/dashboard">Dashboard</Link>
            <Link href="/founder/projects">My Projects</Link>
          </>
        )}

        {user && (
          <ProfileDropdown user={user} />
        )}
      </div>
    </nav>
  )
}