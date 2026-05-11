"use client"

import { useAuth } from "@/store/useAuth"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Project {
  id: number;
  founderId:number;
  title: string;
  description: string;
  budgetRange: string;
  timeline: string;
  techStack: string;
}

export default function ProjectDetailPage() {

  const { id } = useParams();
  const { user } = useAuth();
  const [project, setproject] = useState<Project | null>(null);

  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => { setproject(data) })
  }, [id])

  const handleApply = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault()

    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          projectId: Number(id),
          proposalMessage: proposal,
          proposedPrice: price,
          deliveryTime: delivery,
        }),
      })

      const data = await res.json();

      if (res.ok) {
        alert("Proposal submitted ✅")
      } else {
        alert(
          data.error ||
          "Failed to apply"
        );

        return;
      }

      setProposal("");
      setPrice("");
      setDelivery("");


    } catch (error) {
      alert("Something went wrong");
      console.log("ERROR in /projects/[id]:",error);

    }finally{
      setLoading(false);
    }

  };


  if (!project) {
    return <div className="p-18">Loading...</div>
  }

  const isOwner = user?.id === project.founderId;

  const canApply = user && user.activeRole === "developer" && !isOwner;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        {project.title}
      </h1>

      <h2 className="font-semibold">Project Description</h2>
      <p className="text-gray-700 mt-2">
        {project.description}
      </p>
      <div className="flex gap-6 text-gray-600">
      <span>
          💰 Budget:
          {" "}
          {project.budgetRange}
        </span>

        <span>
          ⏳ Timeline:
          {" "}
          {project.timeline}
        </span>
      </div>

      <div>
        <h2 className="font-semibold">Tech Stack</h2>
        <p>{project.techStack}</p>
      </div>

      {isOwner && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-medium">You Created this Project.</p>
        </div>
      )}

      {!isOwner &&
        user &&
        user.activeRole !==
          "developer" && (

        <div className="border rounded-lg p-4 bg-yellow-50">

          <p className="font-medium">
            Switch to developer mode
            to apply for projects.
          </p>

        </div>
      )}

       {canApply && (

        <div className="border-t pt-6">

          <h2 className="text-xl font-semibold mb-4">
            Submit Proposal
          </h2>

          <form
            onSubmit={handleApply}
            className="space-y-4"
          >

            <textarea
              value={proposal}

              placeholder="Write your proposal"

              className="w-full border p-3 rounded-lg"

              onChange={(e) =>
                setProposal(
                  e.target.value
                )
              }
            />

            <input
              value={price}

              placeholder="Your Price"

              className="w-full border p-3 rounded-lg"

              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
            />

            <input
              value={delivery}

              placeholder="Delivery Time"

              className="w-full border p-3 rounded-lg"

              onChange={(e) =>
                setDelivery(
                  e.target.value
                )
              }
            />

            <button
              disabled={loading}

              className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : "Submit Proposal"}
            </button>

          </form>
        </div>
      )}

      {!user && (

        <div className="border rounded-lg p-4 bg-gray-50">

          <p>
            Login as developer
            to apply.
          </p>

        </div>
      )}

    </div>
  )
}