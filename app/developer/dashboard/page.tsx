"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Stats = {
  applicationsSent: number;
  activeContracts: number;
  completedContracts: number;
  earnings: number;
};

type Action = {
  type: "submit_demo" | "upload_source";
  contractId: number;
};

type ActiveContract = {
  contractId: number;
  title: string;
  status: string;
  budget: number;
  currency: string;
};

type Application = {
  id: number;
  projectTitle: string;
  status: string;
  price: number;
  currency: string;
};

export default function DeveloperDashboard() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [contracts, setContracts] = useState<ActiveContract[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [escrow, setEscrow] = useState<any>(null);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [statsRes, actionsRes, contractsRes, applicationsRes, escrowRes] = await Promise.all([
          fetch("/api/dashboard/developer"),
          fetch("/api/dashboard/developer/actions"),
          fetch("/api/dashboard/developer/contracts"),
          fetch("/api/dashboard/developer/applications"),
          fetch("/api/dashboard/developer/escrow")
        ]);

        if (
          !statsRes.ok ||
          !actionsRes.ok ||
          !contractsRes.ok ||
          !applicationsRes.ok ||
          !escrowRes.ok
        ) {
          setLoading(false);
          return;
        }

        const statsData = await statsRes.json();
        const actionsData = await actionsRes.json();
        const contractsData = await contractsRes.json();
        const applicationsData = await applicationsRes.json();
        const escrowData = await escrowRes.json();

        setStats(statsData);
        setActions(actionsData);
        setContracts(contractsData);
        setApplications(applicationsData);
        setEscrow(escrowData);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

    };

    loadDashboard();

  }, []);

  if (loading) {

    return (
      <div className="max-w-7xl mx-auto p-8">
        Loading...
      </div>
    );

  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Developer Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Track contracts, applications and earnings.
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="border rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Applications Sent
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.applicationsSent ?? 0}
          </h2>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Active Contracts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.activeContracts ?? 0}
          </h2>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Completed Contracts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.completedContracts ?? 0}
          </h2>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Earnings
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{stats?.earnings ?? 0}
          </h2>

        </div>

      </div>

      {/* Action Required */}

      <div className="border rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Action Required
        </h2>

        {actions.length === 0 ? (

          <p className="text-gray-500">
            No pending actions.
          </p>

        ) : (

          <div className="space-y-4">

            {actions.map(action => (

              <div
                key={`${action.type}-${action.contractId}`}
                className="border rounded-xl p-5 flex items-center justify-between"
              >

                <div>

                  <h3 className="font-semibold">

                    {action.type === "submit_demo"
                      ? "Submit Live Demo"
                      : "Upload Final Source Code"}

                  </h3>

                  <p className="text-gray-500 text-sm">

                    {action.type === "submit_demo"
                      ? "Escrow funded. Demo is waiting."
                      : "Founder requested final source code."}

                  </p>

                </div>

                <button
                  onClick={() =>
                    router.push(`/contracts/${action.contractId}`)
                  }
                  className="bg-black text-white px-5 py-2 rounded-lg"
                >
                  Open Workspace
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Active Contracts */}

      <div className="border rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold">
            Active Contracts
          </h2>

        </div>

        {contracts.length === 0 ? (

          <p className="text-gray-500">
            No active contracts.
          </p>

        ) : (

          <div className="space-y-4">

            {contracts.map(contract => (

              <div
                key={contract.contractId}
                className="border rounded-xl p-5 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-semibold text-lg">
                    {contract.title}
                  </h3>

                  <div className="flex gap-3 mt-3 flex-wrap">

                    <span className="px-3 py-1 rounded-full border text-xs">
                      {contract.status}
                    </span>

                    <span className="px-3 py-1 rounded-full border text-xs">
                      {contract.currency} {contract.budget}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    router.push(`/contracts/${contract.contractId}`)
                  }
                  className="bg-black text-white px-5 py-2 rounded-lg"
                >
                  Open Workspace
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Recent Applications */}

      <div className="border rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold">
            Recent Applications
          </h2>

          <button
            onClick={() =>
              router.push("/developer/projects")
            }
            className="text-blue-600"
          >
            Browse Projects
          </button>

        </div>

        {applications.length === 0 ? (

          <p className="text-gray-500">
            No applications submitted yet.
          </p>

        ) : (

          <div className="space-y-4">

            {applications.map(application => (

              <div
                key={application.id}
                className="border rounded-xl p-5 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-semibold">
                    {application.projectTitle}
                  </h3>

                  <div className="flex gap-3 mt-3 flex-wrap">

                    <span className="px-3 py-1 rounded-full border text-xs capitalize">
                      {application.status}
                    </span>

                    <span className="px-3 py-1 rounded-full border text-xs">
                      {application.currency} {application.price}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Escrow */}

      <div className="border rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Escrow Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Pending Escrow
            </p>

            <h3 className="text-3xl font-bold mt-2">
              ₹{escrow?.pending ?? 0}
            </h3>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Funded
            </p>

            <h3 className="text-3xl font-bold mt-2 text-blue-600">
              ₹{escrow?.funded ?? 0}
            </h3>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Released
            </p>

            <h3 className="text-3xl font-bold mt-2 text-green-600">
              ₹{escrow?.released ?? 0}
            </h3>

          </div>

        </div>

      </div>

    </div>

  );

}