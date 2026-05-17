"use client"

import { useAuth } from "@/store/useAuth"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Project = {
  id: number;
  founderId: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  timelineValue: number;
  timelineUnit: string;
  experienceLevel: string;
  techStack: string[];
};

export default function ProjectDetailPage() {

  const { id } = useParams();
  const { user } = useAuth();
  const [project, setproject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryValue, setDeliveryValue] = useState("");
  const [deliveryUnit, setDeliveryUnit] = useState("weeks");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setproject(data);
        setLoading(false);
      })
  }, [id])


  if (loading) {
    return <div className="p-18">Loading...</div>
  }

  if (!project) {
    return <div className="p-18">Project Not Found</div>
  }

  const isOwner = user?.id === project.founderId;
  const canApply = user && user.activeRole === "developer" && !isOwner;

  const handleApply = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault()

    try {
      setSubmitting(true);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          proposalMessage: proposal,
          proposedPrice: Number(price),
          currency: project.currency,
          deliveryValue: Number(deliveryValue),
          deliveryUnit,
        }),
      })

      const data = await res.json();

      if (res.ok) {
        alert("Proposal submitted ✅")
      } else {
        alert(data.error || "Failed to apply");
        return;
      }

      setProposal("");
      setPrice("");
      setDeliveryValue("");
      setDeliveryUnit("weeks");


    } catch (error) {
      alert("Something went wrong");
      console.log("ERROR in /projects/[id]:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {/* TITLE */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">
          {project.title}
        </h1>

        <p className="text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* PROJECT DETAILS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Budget
          </p>

          <p className="font-semibold">
            {project.currency}
            {" "}
            {project.budgetMin}
            {" - "}
            {project.budgetMax}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Timeline
          </p>

          <p className="font-semibold">
            {project.timelineValue}
            {" "}
            {project.timelineUnit}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Experience
          </p>
          <p className="font-semibold capitalize">
            {project.experienceLevel}
          </p>
        </div>
      </div>

      {/* TECH STACK */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">
          Required Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {project.techStack?.map(
            (skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-gray-100 border text-sm"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      {/* OWNER */}
      {isOwner && (
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="font-medium">
            You created this project.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            You cannot apply to your own project.
          </p>
        </div>
      )}

      {/* WRONG ROLE */}
      {!isOwner &&
        user &&
        user.activeRole !==
        "developer" && (
          <div className="border rounded-xl p-5 bg-yellow-50">
            <p className="font-medium">
              Switch to developer mode to apply.
            </p>
          </div>
        )}

      {/* APPLY */}
      {canApply && (
        <div className="border-t pt-8 space-y-4">
          <h2 className="text-2xl font-semibold">
            Submit Proposal
          </h2>

          <form
            onSubmit={handleApply}
            className="space-y-4"
          >
            <textarea
              required
              value={proposal}
              placeholder="Write proposal..."
              className="w-full border rounded-lg p-3"
              onChange={(e) =>
                setProposal(
                  e.target.value
                )
              }
            />
            <input
              required
              type="number"
              value={price}
              placeholder="Your Price"
              className="w-full border rounded-lg p-3"
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
            />
            <div className="flex gap-3">

              <input
                required
                type="number"
                value={deliveryValue}
                placeholder="Delivery Time"
                className="flex-1 border rounded-lg p-3"
                onChange={(e) =>
                  setDeliveryValue(
                    e.target.value
                  )
                }
              />

              <select
                value={deliveryUnit}
                onChange={(e) =>
                  setDeliveryUnit(
                    e.target.value
                  )
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

            <button
              disabled={submitting}
              className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >

              {submitting
                ? "Submitting..."
                : "Submit Proposal"}

            </button>

          </form>

        </div>

      )}

      {!user && (

        <div className="border rounded-xl p-5 bg-gray-50">

          <p>
            Login as developer to apply.
          </p>

        </div>

      )}

    </div>
  );
}