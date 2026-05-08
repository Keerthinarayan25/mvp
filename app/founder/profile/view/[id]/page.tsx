"use client";


import AboutCard from "@/components/profile/AboutCard";
import LinksCard from "@/components/profile/LinksCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProjectsSection from "@/components/project/ProjectSection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function FounderProfilePage() {

  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {

    try {
      const res = await fetch(`/api/founder/profile?id=${id}`);
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <ProfileHeader
        name={data.user.name}
        image={data.founderProfile.profileImage}
        subtitle={data.founderProfile.companyName}
        stats={[
          { label: "projects", value: data.projects.length },
        ]}
      />

      <AboutCard bio={data.founderProfile.bio} />

      <LinksCard
        github={data.founderProfile.website}
        linkedin={data.founderProfile.linkedin}
      />

      <ProjectsSection projects={data.projects} />
    </div>
  )
}