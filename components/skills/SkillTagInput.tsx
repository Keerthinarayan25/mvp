"use client";

import { X } from "lucide-react";
import { useState } from "react";


type Props = {
  value: string[];
  onChange: (skills: string[]) => void;
  max?: number;
}

export default function SkillTagInput({
  value,
  onChange,
  max = 20,
}: Props) {

  const [input, setInput] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    if (value.includes(trimmed)) return;

    if (value.length >= max) {
      alert(`Maximum ${max} skills allowed`);
    }

    onChange([...value, input]);
    setInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="border rounded-2xl p-4 space-y-3">

      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 
            bg-gray-100 px-3 py-1 rounded-full text-sm"
          >
            <span>{skill}</span>
            <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addSkill(input);
          }
          if (e.key === ",") {
            e.preventDefault();
            addSkill(input);
          }
        }}
        placeholder={"Search Skills"}
        className="w-full outline-none text-sm"
      />

      <p className="text-xs text-gray-500">Maximum {max} skills</p>
    </div>
  );
}