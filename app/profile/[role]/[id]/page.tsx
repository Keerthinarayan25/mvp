"use client";

import AboutCard from "@/components/profile/AboutCard";
import LinksCard from "@/components/profile/LinksCard";
import PortfolioSection from "@/components/profile/PortfolioSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SkillsTags from "@/components/profile/skillsTags";
import ProjectsSection from "@/components/project/ProjectSection";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mapFounderToView, mapDeveloperToView } from "@/lib/profile/mapper";
import EditProfileModal from "@/components/profile/EditProfileModal";



export default function ProfilePage() {

  const params = useParams();
  const role = params.role as string;
  const id = params.id as string;

  const [view, setView] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  console.log("ROLE, ID:", role, id);

  const fetchProfile = async () => {

    try {
      const res = await fetch(`/api/${role}/profile/${id}`);

      if (!res.ok) {
        setView(null);
        console.log("Failed to fetch profile");
      }
      const data = await res.json();
      console.log("API RESPONSE DATA:", data);

      const mappedView =
        role === "developer"
          ? mapDeveloperToView(data)
          : mapFounderToView(data);

      setView(mappedView);
      console.log("MAPPED VIEW:", mappedView);

    } catch (err) {
      console.error("Fetch failed:", err);
      setView(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [role, id]);

  console.log("UPDATED VIEW:", view);


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!view) {
    return (
      <div className="flex flex-col items-center justify-center py-20">

        <h1 className="text-2xl font-semibold">
          Complete your profile
        </h1>

        <p className="text-gray-500 mt-2">
          Your profile is not setup yet.
        </p>

        <button
          onClick={() => setShowEdit(true)}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
        >
          Setup Profile
        </button>

        {showEdit && (
          <EditProfileModal
            role={role}
            onClose={() => setShowEdit(false)}
            onSuccess={() => {
              fetchProfile();
              setShowEdit(false);
            }}
          />
        )}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProfileHeader
          name={view.name}
          image={view.image}
          subtitle={view.subtitle}
          stats={view.stats}
          onEdit={() => setShowEdit(true)}
        />

        <div className="mt-16 space-y-16">
          <section className="border-t border-gray-100 pt-12">
            <AboutCard bio={view.about} />
          </section>

          <section className="border-t border-gray-100 pt-12">
            <h3 className="text-lg font-light tracking-tight text-gray-900 
                    mb-8">
              Socials
            </h3>
            <LinksCard links={view.links} />
          </section>

          {view.sections.map((section: any, i: number) => {
            if (section.type === "skills") {
              return (
                <section key={i} className="border-t border-gray-100 pt-12">
                  <h3 className="text-lg font-light tracking-tight text-gray-900 
                    mb-8">
                    Skills
                  </h3>
                  <SkillsTags skills={section.data} />
                </section>
              );
            }

            if (section.type === "portfolio") {
              return (
                <section key={i} className="border-t border-gray-100 pt-12">
                  <h3 className="text-lg font-light tracking-tight text-gray-900 
                    mb-8">
                    Portfolio
                  </h3>
                  <PortfolioSection portfolio={section.data} />
                </section>
              );
            }

            if (section.type === "projects") {
              return (
                <section key={i} className="border-t border-gray-100 pt-12">
                  <h3 className="text-lg font-light tracking-tight text-gray-900 
                    mb-8">
                    Projects
                  </h3>
                  <ProjectsSection projects={section.data} />
                </section>
              );
            }

            return null;
          })}
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          role={role}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            fetchProfile();
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}