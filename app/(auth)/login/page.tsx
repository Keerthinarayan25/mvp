"use client";

import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);
    console.log("USER:", data.user);

    if (!res.ok || !data.user) {
      alert(data.error || "Login failed");
      return;
    }

    setUser(data.user);

    if (data.user.role === "developer") {
      // router.refresh();
      router.push("/developer/dashboard");
    } else {
      // router.refresh();
      router.push("/founder/dashboard");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong");
  } finally {
    setLoading(false); 
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="space-y-4 p-8 shadow-lg rounded-lg w-96 bg-white"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}