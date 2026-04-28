"use client";

import { useState } from "react";

export default function SkillTagInput({
  value,
  onChange,
  placeholder = "Add skills",
}: {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {

  const [input, setInput] = useState("");

  const addSkill = () => {
    if (!input.trim()) return;

    if (value.includes(input)) return;

    onChange([...value, input]);
    setInput("");
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="border p-2 rounded">

      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill) => (
          <span
            key={skill}
            className="bg-black text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {skill}
            <button onClick={() => removeSkill(skill)}>✕</button>
          </span>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
        placeholder={placeholder}
        className="w-full outline-none"
      />
    </div>
  );
}