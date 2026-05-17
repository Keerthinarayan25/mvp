"use client";

import { useState } from "react";
import SkillTagInput from "../skills/SkillTagInput";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateProjectModal({
  onClose,
  onCreated,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
    timelineValue: "",
    timelineUnit: "weeks",
    experienceLevel: "intermediate",
    techStack: [] as string[],
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLElement>) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "/api/projects",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...form,

            budgetMin:
              Number(form.budgetMin),

            budgetMax:
              Number(form.budgetMax),

            timelineValue:
              Number(form.timelineValue),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create project");
      }
      onCreated();
      onClose();
    } catch {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >

      <div
        className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-5"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Create Project
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TITLE */}
          <input
            required
            placeholder="Project Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          {/* DESCRIPTION */}
          <textarea
            required
            rows={5}
            placeholder="Describe your project..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          {/* BUDGET */}
          <div className="grid grid-cols-3 gap-3">

            <input
              required
              type="number"
              placeholder="Min Budget"
              value={form.budgetMin}
              onChange={(e) =>
                setForm({
                  ...form,
                  budgetMin:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              required
              type="number"
              placeholder="Max Budget"
              value={form.budgetMax}
              onChange={(e) =>
                setForm({
                  ...form,
                  budgetMax:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <select
              value={form.currency}
              onChange={(e) =>
                setForm({
                  ...form,
                  currency:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              <option value="USD">
                USD
              </option>

              <option value="INR">
                INR
              </option>

              <option value="EUR">
                EUR
              </option>

            </select>

          </div>

          {/* TIMELINE */}
          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              placeholder="Timeline"
              value={form.timelineValue}
              onChange={(e) =>
                setForm({
                  ...form,
                  timelineValue:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <select
              value={form.timelineUnit}
              onChange={(e) =>
                setForm({
                  ...form,
                  timelineUnit:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >

              <option value="days">
                Days
              </option>

              <option value="weeks">
                Weeks
              </option>

              <option value="months">
                Months
              </option>

            </select>

          </div>

          {/* EXPERIENCE */}
          <select
            value={form.experienceLevel}
            onChange={(e) =>
              setForm({
                ...form,
                experienceLevel:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          >

            <option value="entry">
              Entry Level
            </option>

            <option value="intermediate">
              Intermediate
            </option>

            <option value="expert">
              Expert
            </option>

          </select>

          {/* TECH STACK */}
          <div className="space-y-2">

            <p className="text-sm font-medium">
              Required Skills
            </p>

            <SkillTagInput
              value={form.techStack}
              onChange={(skills) =>
                setForm({
                  ...form,
                  techStack: skills,
                })
              }
              max={20}
            />

          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >

            {loading
              ? "Creating..."
              : "Create Project"}

          </button>
        </form>
      </div>
    </div>
  );
}