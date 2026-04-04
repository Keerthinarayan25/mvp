// "use client"

// import { useEffect, useState } from "react"

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<any>(null);

//   useEffect(() => {
//     fetch("/app/api/developer/profile")
//       .then(res => res.json())
//       .then(data => setProfile(data))
//   }, [])

//   if (!profile) return <div>Loading...</div>

//   return (
//     <div className="max-w-xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">
//         Developer Profile
//       </h1>
//       <p><b>Bio:</b> {profile.bio}</p>
//       <p><b>Skills:</b> {profile.skills}</p>
//       <p><b>Tech Stack:</b> {profile.techStack}</p>
//       <p><b>Portfolio:</b> {profile.portfolioLinks}</p>
//       <p><b>Pricing:</b> {profile.pricingModel}</p>
//       <p><b>Availability:</b> {profile.availability}</p>

//     </div>
//   )
// }