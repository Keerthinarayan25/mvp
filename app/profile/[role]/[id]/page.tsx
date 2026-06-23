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
import SkillsEditModal from "@/components/profile/SkillsEditModal";
import AddPortfolioModal from "@/components/portfolio/AddPortfolioModal";
import EditPortfolioModal from "@/components/portfolio/EditPortfolioModal";
import DevelopersWorkedSection from "@/components/profile/DeveloperWorkedSection";
import { useAuth } from "@/store/useAuth";


interface Portfolio {
  id: number;
  title: string;
  description: string;
  projectLink: string;
  githubLink: string;
}

export default function ProfilePage() {

  const params = useParams();
  const role = params.role as string;
  const id = params.id as string;
  const { user } = useAuth();

  const [view, setView] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showSkillsEdit, setShowSkillsEdit] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <ProfileHeader
          name={view.name}
          image={view.image}
          subtitle={view.subtitle}
          stats={view.stats}
          onEdit={() => setShowEdit(true)}
        />

        {/* ABOUT + SOCIALS */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* LEFT SIDEBAR */}
          <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Social Links
              </h2>

              <LinksCard links={view.links} />
            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2">

            <div className="bg-white borderborder-slate-200 rounded-2xl p-6 shadow-sm">
              <AboutCard bio={view.about} />
            </div>

          </div>

        </div>

        {/* DYNAMIC SECTIONS */}
        <div className="space-y-6 mt-8">

          {view.sections.map((section: any, i: number) => {

            if (section.type === "skills") {
              return (
                <section
                  key={i}
                  className=" bg-white borderborder-slate-200 rounded-2xl p-6 shadow-sm "
                >
                  <SkillsTags
                    skills={section.data}
                    onEdit={() => setShowSkillsEdit(true)}
                  />
                </section>
              );
            }

            if (section.type === "portfolio") {
              return (
                <section
                  key={i}
                  className="bg- border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <PortfolioSection
                    portfolio={section.data}
                    onAdd={() => setShowAddPortfolio(true)}
                    onEdit={(project) =>
                      setEditingPortfolio(project)
                    }
                    onDelete={async (id) => {
                      const res = await fetch(
                        `/api/portfolio/${id}`,
                        {
                          method: "DELETE",
                        }
                      );

                      if (res.ok) {
                        fetchProfile();
                      }
                    }}
                  />
                </section>
              );
            }

            if (section.type === "projects") {

              const isOwner = view.id === user?.id;

              return (
                <section
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <ProjectsSection
                    projects={section.data}
                    canCreate={
                      role === "founder" &&
                      isOwner
                    }
                    isOwner={isOwner}
                    onCreated={fetchProfile}
                  />
                </section>
              );
            }

            if (section.type === "developers") {
              return (
                <section
                  key={i}
                  className=" bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <DevelopersWorkedSection
                    developers={section.data}
                  />
                </section>
              );
            }

            return null;
          })}
        </div>

        {/* MODALS */}
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

        {showSkillsEdit && (
          <SkillsEditModal
            currentSkills={
              view.sections.find(
                (s: any) => s.type === "skills"
              )?.data || []
            }
            onClose={() => setShowSkillsEdit(false)}
            onSuccess={() => { fetchProfile(); }}
          />
        )}

        {showAddPortfolio && (
          <AddPortfolioModal
            onClose={() => setShowAddPortfolio(false)}
            onSuccess={() => {
              fetchProfile();
              setShowAddPortfolio(false);
            }}
          />
        )}

        {editingPortfolio && (
          <EditPortfolioModal
            project={editingPortfolio}
            onClose={() => setEditingPortfolio(null)}
            onUpdated={() => {
              fetchProfile();
              setEditingPortfolio(null);
            }}
          />
        )}
      </div>
    </div>
  );
}