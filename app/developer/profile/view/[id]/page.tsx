"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


// interface DeveloperProfile {
//   id: number;
//   userId: number;

//   bio: string | null;
//   skills: string | null;
//   techStack: string | null;
//   portfolioLinks: string | null;

//   pricingModel: string | null;
//   availability: string | null;
//   category: string | null;

//   education: string | null;
//   languages: string | null;

//   github: string | null;
//   linkedin: string | null;

//   profileImage: string | null;
// }

export default function DeveloperProfilePage() {

  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/profile?id=${id}`)
      .then(res => res.json())
      .then(setData)
  }, [id])

  if (!data) return <div>No developer profile found...</div>


  return (
    <div>
      <div>
        <Image
          src={data.profile?.profileImage || "/keerthi narayan M.jpg"}
          alt="profile image"
        />

        <div>
          <h1>
            {data.user.name}
          </h1>

          <p>
            {data.profile?.category}
          </p>
        </div>
      </div>

      <div>
        <span>Projects Done: {data.contractCount}</span>
        <span>Skills: {data.profile?.skills}</span>
      </div>

      <div>
        <h2>About</h2>
        <p>{data.profile?.bio}</p>
      </div>

      <div>
        <a href={data.profile?.github}>GitHub</a>
        <a href={data.profile?.linkedin}>LinkedIn</a>
      </div>

      <div>
        <h2>Portfolio</h2>
        {data.Portfolio.map((p:any) => (
          <div
            key={p.id}
          >
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <a href={p.projectLink}>Live</a>

          </div>
        ))}
      </div>
    </div>
  )

}