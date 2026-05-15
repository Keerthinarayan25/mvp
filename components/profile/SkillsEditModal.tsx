"use client";

import { useEffect, useState } from "react";
import SkillTagInput from "../skills/SkillTagInput";
import { useAuth } from "@/store/useAuth";

type Props = {
  currentSkills: string[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function SkillsEditModal({
  currentSkills,
  onClose,
  onSuccess,
}: Props) {

  const { user } = useAuth();

  const [skills, setSkills] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSkills(currentSkills || []);
  }, [currentSkills]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/developer/profile/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ skills, }),
      }
      );

      if (!res.ok) {
        alert("Failed to update skills");
        return;
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    >

      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-8 space-y-6"
      >
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold">
            Edit Skills
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <SkillTagInput
          value={skills}
          onChange={setSkills}
          max={20}
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-green-600 text-white "
          >
            {loading
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}