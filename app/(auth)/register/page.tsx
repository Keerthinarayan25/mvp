"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": " application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      alert("Registration Failed");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-8 shadow-lg rounded-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
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

        <select
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="developer">Developer</option>
          <option value="founder">Founder</option>
        </select>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Register
        </button>

      </form>

    </div>
  );


}