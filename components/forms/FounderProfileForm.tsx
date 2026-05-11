"use client";

import { useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onSuccess: () => void;
};

export default function FounderProfileForm({
  onSuccess,
}: Props) {

  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const[hasProfile, sethasProfile ] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (!user) return;
    const load = async () => {

      const res = await fetch(`/api/founder/profile/${user.id}`);

      const data = await res.json();
      if(data.founderProfile){
        sethasProfile(true);
      }else{
        sethasProfile(false);
      }

      reset({
        bio: data.founderProfile?.bio || "",
        companyName: data.founderProfile?.companyName || "",
        companyDescription: data.founderProfile?.companyDescription || "",
        website: data.founderProfile?.website || "",
        linkedIn: data.founderProfile?.linkedin || "",
        profileImage: data.founderProfile?.profileImage || "",
      });
    };

    load();
  }, [user, reset]);

  const onSubmit = async (formData: any) => {
    if (!user) return;

    const method = hasProfile ? "PATCH" : "POST";
    const endPoint = hasProfile ? `/api/founder/profile/${user.id}` : "/api/founder/profile";

    const res = await fetch(endPoint,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      const me =await fetch("/api/auth/me");
      const updatedUser = await me.json();
      setUser(updatedUser);
      onSuccess();
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    reset((prev: any) => ({
      ...prev,
      profileImage: data.url,
    }));

    setUploading(false);
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {

            if (!e.target.files?.[0]) return;

            handleImageUpload(
              e.target.files[0]
            );
          }}
        />

        {uploading && (
          <p className="text-sm text-gray-500">
            Uploading...
          </p>
        )}
      </div>

      <textarea
        {...register("bio")}
        maxLength={200}
        placeholder="Bio"
        className="w-full border p-2 rounded"
      />

      <input
        {...register("companyName")}
        maxLength={200}
        placeholder="Company Name"
        className="w-full border p-2 rounded"
      />

      <input
        {...register("companyDescription")}
        maxLength={200}
        placeholder="Comapny Description"
        className="w-full border p-2 rounded"
      />

      <input
        {...register("website")}
        maxLength={200}
        placeholder="website Link  www.example.com"
        className="w-full border p-2 rounded"
      />

      <input
        {...register("linkedIn")}
        maxLength={200}
        placeholder="LinkedIn"
        className="w-full border p-2 rounded"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}