import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/useAuth";

type Props = {
  onSuccess: () => void;
}
export default function DeveloperProfileForm({
  onSuccess,
}: Props) {

  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();



  useEffect(() => {

    if (!user) return;
    const load = async () => {
      const res = await fetch(`/api/developer/profile/${user.id}`);

      const data = await res.json();

      reset({
        bio: data.profile.bio,
        github: data.profile.github,
        linkedin: data.profile.linkedin,
        profileImage: data.profile?.profileImage || "",
      });
    };

    load();
  }, [user, reset]);

  const onSubmit = async (formData: any) => {
    if (!user) return;
    const res = await fetch(`/api/developer/profile/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const me = await fetch("/api/auth/me");
      const updatedUser = await me.json();
      console.log("UPDATED USER:",updatedUser);
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
        placeholder="Bio 200 Character"
        className="w-full border p-2 rounded"
      />
      <input
        {...register("github")}
        placeholder="Github"
        maxLength={200}
        className="w-full borderp-2 rounded"
      />

      <input
        {...register("linkedin")}
        placeholder="LinkedIn"
        maxLength={200}
        className="w-full borderp-2 rounded"
      />

      <Button> Save </Button>



    </form>
  )
}