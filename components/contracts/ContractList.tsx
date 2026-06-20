"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ContractStatusBadge from "@/components/contracts/ContractStatusBadge";

type Contract = {
  id: number;
  projectId: number;
  projectTitle: string;
  description: string | null;
  techStack: string[] | string;
  developerId: number;
  developerName: string;
  founderId: number;
  founderName: string;
  agreedprice: number | null;
  currency: string | null;
  deliveryValue: number | null;
  deliveryUnit: string | null;

  status:
    | "pending_funding"
    | "active"
    | "awaiting_handoff"
    | "completed"
    | "cancelled";
  deadline: string | null;
  createdAt: string;
};

export default function ContractList() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetch("/api/contracts")
      .then((res) => res.json())
      .then(setContracts);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Work</h1>

        <p className="text-slate-500 mb-8">
          Active contracts and project workspaces
        </p>

        <div className="space-y-4">
          {contracts.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition "
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div>
                    <Link
                      href={`/contracts/${c.id}`}
                      className="text-xl sm:text-2xl font-semibold text-slate-900 hover:text-blue-600 transition break-words "
                    >
                      {c.projectTitle}
                    </Link>

                    {c.description && (
                      <p className="  mt-3 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 ">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                    <span>
                      Founder:
                      <span className="font-medium ml-1 text-slate-800">
                        {c.founderName}
                      </span>
                    </span>

                    <span>
                      Budget:
                      <span className="font-medium ml-1 text-green-600">
                        {c.currency} {c.agreedprice}
                      </span>
                    </span>

                    <span>
                      Timeline:
                      <span className="font-medium ml-1">
                        {c.deliveryValue} {c.deliveryUnit}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {Array.isArray(c.techStack)
                      ? c.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="
                              px-3 py-1 rounded-md bg-slate-100 text-slate-700  text-xs sm:text-sm "
                          >
                            {tech}
                          </span>
                        ))
                      : typeof c.techStack === "string" &&
                        c.techStack.split(",").map((tech) => (
                          <span
                            key={tech}
                            className="
                                px-3
                                py-1
                                rounded-md
                                bg-slate-100
                                text-slate-700
                                text-sm
                              "
                          >
                            {tech.trim()}
                          </span>
                        ))}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col  justify-between  items-center  lg:items-end  gap-4  w-full  lg:w-auto pt-2">
                  <ContractStatusBadge status={c.status} />

                  <Link
                    href={`/contracts/${c.id}`}
                    className="bg-blue-600 text-white  px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap "
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contracts.length === 0 && (
          <div
            className="
              bg-white
              border
              border-dashed
              border-slate-300
              rounded-xl
              p-12
              text-center
            "
          >
            <h3 className="text-lg font-semibold text-slate-700">
              No contracts yet
            </h3>

            <p className="text-slate-500 mt-2">
              Accepted projects will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
