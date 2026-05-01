"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddPortfolioModal from "@/components/portfolio/AddPortfolioModal";
import EditPortfolioModal from "@/components/portfolio/EditPortfolioModal";
import Sidebar from "@/components/profile/Sidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AboutCard from "@/components/profile/AboutCard";
import LinksCard from "@/components/profile/LinksCard";
import PortfolioSection from "@/components/profile/PortfolioSection";
import SkillsTags from "@/components/profile/skillsTags";

interface Portfolio {
  id: number;
  title: string;
  description: string;
  projectLink: string;
  githubLink: string;
}

interface ProfileData {
  user: {
    id: number;
    name: string;
  }
  profile: {
    bio: string;
    skills: string[];
    category: string;
    github: string;
    linkedin: string;
    profileImage: string;
  }
  portfolio: Portfolio[];
  contractCount: number;
}

export default function DeveloperProfilePage() {

  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<ProfileData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {

    try {
      const res = await fetch(`/api/profile?id=${id}`);
      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (

    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

      <Sidebar />

      <div className="lg:col-span-2 space-y-6">

        <ProfileHeader
          name={data.user.name}
          image={data.profile.profileImage}
          bio={data.profile.bio}
          contractCount={data.contractCount}
          skillsCount={data.profile.skills.length}
        />

        <AboutCard bio={data.profile.bio} />

        <LinksCard
          github={data.profile.github}
          linkedin={data.profile.linkedin}
        />

        <PortfolioSection
          portfolio={data.portfolio}
          onDelete={handleDelete}
          onEdit={(project) => setEditProject(project)}
          onAdd={() => setShowModal(true)}
        />

        <SkillsTags skills={data.profile.skills} />


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