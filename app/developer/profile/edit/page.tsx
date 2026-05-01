"use client"

import { useRouter } from "next/navigation"
import { DeveloperProfileForm } from "@/types/profile";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import SkillTagInput from "@/components/skills/SkillTagInput";



export default function CreateProfilePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
  } = useForm<DeveloperProfileForm>({
    defaultValues: {
      bio: "",
      skills: [],
      github: "",
      linkedin: "",
      profileImage: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/auth/me");
      const user = await res.json();

      const profileRes = await fetch(`/api/profile?id=${user.id}`);
      const data = await profileRes.json();

      if (data.profile) {
        setValue("bio", data.profile.bio || "");
        setValue("skills", data.profile.skills || "");
        setValue("github", data.profile.github || "");
        setValue("linkedin", data.profile.linkedin || "");
        setValue("profileImage", data.profile.profileImage || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, [setValue]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });


    if (!res.ok) {
      console.error(await res.text());
      setUploading(false);
      return;
    }

    const data = await res.json();

    setValue("profileImage", data.url);
    setUploading(false);
  };

  const onSubmit = async (data: DeveloperProfileForm) => {
    const userRes = await fetch("/api/auth/me");
    const user = await userRes.json();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      router.push(`/developer/profile/view/${user.id}`);
    } else {
      alert("Failed to create profile");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">

      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* BIO */}
        <textarea
          placeholder="Bio"
          className="w-full border p-2 rounded"
          {...register("bio")}
        />

        {/* SKILLS */}
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <SkillTagInput
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* GITHUB */}
        <input
          placeholder="GitHub"
          className="w-full border p-2 rounded"
          {...register("github")}
        />

        {/* LINKEDIN */}
        <input
          placeholder="LinkedIn"
          className="w-full border p-2 rounded"
          {...register("linkedin")}
        />

        {/* IMAGE */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              handleImageUpload(e.target.files[0])
            }
          />
          {uploading && <p>Uploading...</p>}
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Save Changes
        </button>

      </form>
    </div>
  )


}