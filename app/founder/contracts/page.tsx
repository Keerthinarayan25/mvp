"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Contract = {
  id: number;
  projectId: number;
  projectTitle: string;
  developerId: number;
  developerName: string;
  founderId: number;
  founderName: string;
  agreedprice: number | null;
  currency: string | null;
  deliveryValue: number | null;
  deliveryUnit: string | null;
  status: string;
  deadline: string | null;
  createdAt: string;
};


export default function FounderContractsPage() {

  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch("/api/contracts")
      .then(res => res.json())
      .then(setContracts)
  }, [])
  console.log("Contracts data in founder page:", contracts);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Active Contracts
      </h1>

      <div className="space-y-4">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4"
          >
            <h2 className="font-semibold text-lg">
              {c.projectTitle}
            </h2>

            <p className="text-gray-600">
              Developer: {c.developerName}
            </p>

            <p>
              Budget: {c.agreedprice} {c.currency}
            </p>

            <p>
              Timeline: {c.deliveryValue} {c.deliveryUnit}
            </p>

            <p>
              Status: {c.status}
            </p>

            <Link
              href={`/contracts/${c.id}`}
              className="text-blue-500"
            >
              Open Workspace →
            </Link>
          </div>
        ))}
      </div>
    </div>

  )

}