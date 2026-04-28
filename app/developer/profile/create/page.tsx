"use client"

import { useRouter } from "next/navigation"
import { DeveloperProfileForm } from "@/types/profile";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import SkillTagInput from "@/component/skills/SkillTagInput";



export default function CreateProfilePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<DeveloperProfileForm>({
    defaultValues: {
      skills: [],
      techStack: [],
      profileImage: "",
    }
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ image: reader.result }),
      });
      const data = await res.json();

      setValue("profileImage", data.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);

  };

  const onSubmit = async (data: DeveloperProfileForm) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      router.push("/developer/profile/view/me")
    } else {
      alert("Failed to create profile");
    }
  };


  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">
        Create Developer Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <textarea
          placeholder="Bio"
          className="w-full border p-2 rounded"
          {...register("bio", { required: true })}
        />
        {errors.bio && <p className="text-red-500">Bio required</p>}

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

        <Controller
          control={control}
          name="techStack"
          render={({ field }) => (
            <SkillTagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Add tech stack"
            />
          )}
        />

        <div>
          <label className="block text-sm mb-1">
            Profile Image
          </label>

          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => 
              e.target.files && handleImageUpload(e.target.files[0])
            }
          />

          {uploading && (
            <p className="text-sm text-gray-500">
              Uploading...
            </p>
          )}
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Save Profile
        </button>

      </form>
    </div>
  )


}