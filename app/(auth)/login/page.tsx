"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";



export default function LoginPage(){
  const router = useRouter();
  const [form, setForm] = useState({
    email:"",
    password:""
  });

  const handleLogin = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    const userRes = await fetch("/api/auth/me");
    const user = await userRes.json();
    console.log("Login details:",user);
    if (user.role === "developer") {
      router.push("/developer/dashboard");
    } else {
      router.push("/founder/dashboard");
    }

  }

  return(
    <div className="felx h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="space-y-4 p-8 shadow-lg rounded-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input 
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) => 
            setForm({...form,email:e.target.value})
          }
        />

        <input 
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({...form, password:e.target.value})
          }
        />

        <button 
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>

      </form>
    </div>
  )
}