"use client"

import { useRouter } from "next/navigation"
import { DeveloperProfileForm } from "@/types/profile";
import { useForm } from "react-hook-form";

export default function CreateProfilePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DeveloperProfileForm>();

  const onSubmit = async (data: DeveloperProfileForm) => {
    const res = await fetch("/app/api/developer/profile",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if(res.ok){
      router.push("/developer/profile/view")
    }
  }


  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Create Developer Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <textarea
          placeholder="Bio"
          className="w-full border p-2"
          {...register("bio", { required: true })}
        />
        {errors.bio && <p className="text-red-500">Bio required</p>}

        <input
          placeholder="Skills (comma separated)"
          className="w-full border p-2"
          {...register("skills")}
        />

        <input
          placeholder="Tech Stack"
          className="w-full border p-2"
          {...register("techStack")}
        />

        <input
          placeholder="Portfolio Links"
          className="w-full border p-2"
          {...register("portfolioLinks")}
        />

        <input
          placeholder="Pricing Model"
          className="w-full border p-2"
          {...register("pricingModel")}
        />

        <input
          placeholder="Availability"
          className="w-full border p-2"
          {...register("availability")}
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Save Profile
        </button>


      </form>
    </div>
  )


}