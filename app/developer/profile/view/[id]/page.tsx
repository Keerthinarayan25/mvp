"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortfolioCard from "@/component/portfolio/PortfolioCard";
import AddPortfolioModal from "@/component/portfolio/AddPortfolioModal";
import Image from "next/image";
import EditPortfolioModal from "@/component/portfolio/EditPortfolioModal";

interface Portfolio {
  id: number
  title: string
  description: string
  projectLink: string
  githubLink: string
}

interface ProfileData {
  user: {
    id: number
    name: string
  }
  profile: {
    bio: string
    skills: string
    category: string
    github: string
    linkedin: string
    profileImage: string
  }
  portfolio: Portfolio[]
  contractCount: number
}

export default function DeveloperProfilePage() {

  const { id } = useParams()

  const [data, setData] = useState<ProfileData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Portfolio | null>(null);

  const fetchProfile = async () => {
    const res = await fetch(`/api/profile?id=${id}`);
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/portfolio/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setData((prev) =>
        prev
          ? {
            ...prev,
            portfolio: prev.portfolio.filter((p) => p.id !== id),
          }
          : prev
      );
    } else {
      alert("Failed to delete");
    }
  };


  if (!data) {
    return <div className="p-10">Loading...</div>
  }

  return (

    <div className="max-w-4xl mx-auto mt-10 space-y-8">


      <div className="flex items-center gap-4">

        <Image
          src={data.profile?.profileImage || "/keerthinarayan M.jpg"}
          alt="profile"
          width={64}
          height={64}
          className="rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {data.user.name}
          </h1>

          <p className="text-gray-500">
            {data.profile?.category}
          </p>
        </div>

      </div>


      <div className="flex gap-6 text-sm text-gray-600">

        <span>💼 Projects Completed: {data.contractCount}</span>

        <span>🛠 Skills: {data.profile?.skills}</span>

      </div>


      <div>
        <h2 className="font-semibold text-lg mb-1">About</h2>
        <p className="text-gray-700">
          {data.profile?.bio}
        </p>
      </div>


      <div className="flex gap-4 text-sm">

        {data.profile?.github && (
          <a
            href={data.profile.github}
            target="_blank"
            className="text-blue-500"
          >
            GitHub
          </a>
        )}

        {data.profile?.linkedin && (
          <a
            href={data.profile.linkedin}
            target="_blank"
            className="text-blue-500"
          >
            LinkedIn
          </a>
        )}

      </div>


      <div className="space-y-4">

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            Portfolio
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-3 py-2 rounded"
          >
            + Add Project
          </button>

        </div>

        {data.portfolio.length === 0 ? (
          <p className="text-gray-500">
            No portfolio projects yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {data.portfolio.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onEdit={(project) => setEditProject(project)}
              />
            ))}

          </div>
        )}

      </div>

      {showModal && (
        <AddPortfolioModal
          onClose={() => {
            setShowModal(false)
            fetchProfile()
          }}
        />
      )}

      {editProject && (
        <EditPortfolioModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onUpdated={fetchProfile}
        />
      )}

    </div>
  )
}