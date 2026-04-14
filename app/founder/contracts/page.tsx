"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// interface ContractType{
//   contractId: number,
//   developerId: number,
//   developerName: string,
//   projectTitle: string,
// }


export default function FounderContractsPage() {

  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/contracts")
      .then(res => res.json())
      .then(setContracts)
  }, [])
  console.log("Contracts data1:", contracts);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">

      <h1 className="text-2xl font-bold">
        Ongoing Projects
      </h1>

      {contracts.map((c) => (
        <div
          key={c.contractId}
          className="border p-4 rounded"
        >

          <h2 className="font-semibold">
            {c.projectTitle}
          </h2>

          <p className="text-sm text-gray-600">
            Developer: {c.developerName}
          </p>

          <p className="text-sm text-gray-600">
            Status: {c.status}
          </p>

          <Link
            href={`/contracts/${c.contractId}`}
            className="text-blue-500 text-sm"
          >
            Open Workspace  →
          </Link>
        </div>
      ))}


    </div>


  )


}