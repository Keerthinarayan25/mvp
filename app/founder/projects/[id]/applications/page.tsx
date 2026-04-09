"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";


interface Application {
  applicationId: number,
  proposalMessage: string,
  proposedPrice: number,
  deliveryTime: string,
  developerId: string,
  developerName: string,
  profileImage: string | null,
  status?: string
}

export default function ApplicationsPage() {

  const { id } = useParams();

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${id}/applications`)
      .then(res => res.json())
      .then(data => {
        console.log("API RESPONSE:", data);
        setApplications(data)
      })
  }, [id])

  const handleAccept = async (applicationId: number) => {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "POST"
    })

    if (res.ok) {
      setApplications(prev =>
        prev.map(app => ({
          ...app,
          status: app.applicationId === applicationId
            ? "Accepted"
            : "Rejected"
        }))
      )
    } else {
      alert("Failed to accept");
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Applicants
      </h1>

      {applications.map((app) => (
        <div
          key={app.applicationId}
          className="border p-4 rounded-lg space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={"/keerthinarayan M.jpg"}
                width={50}
                height={50}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">
                  {app.developerName}
                </p>

                <Link
                  href={`/developer/profile/${app.developerId}`}
                  className="text-blue-500 text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>

            <span className="font-semibold">
              $ {app.proposedPrice}
            </span>
          </div>

          <p className="text-gray-700">
            {app.proposalMessage}
          </p>

          <p className="text-sm text-gray-500">
            Delivery:{app.deliveryTime}
          </p>

          <div className="flex gap-3">

            {app.status === "Accepted" ? (
              <span className="text-green-600 font-semibold">
                Developer Selected
              </span>
            ) : app.status === "Rejected" ? (
              <span className="text-gray-400">
                Rejected
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleAccept(app.applicationId)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAccept(app.applicationId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </>
            )}

          </div>

        </div>
      ))}

    </div>
  )

}