"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FounderDashboard() {

  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [escrow, setEscrow] = useState<any>(null);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [statsRes, actionsRes, contractsRes, projectsRes, escrowRes] = await Promise.all([
          fetch("/api/dashboard/founder"),
          fetch("/api/dashboard/founder/actions"),
          fetch("/api/dashboard/founder/contracts"),
          fetch("/api/dashboard/founder/projects"),
          fetch("/api/dashboard/founder/escrow"),
        ]);

        const statsData = await statsRes.json();
        const actionsData = await actionsRes.json();
        const contractsData = await contractsRes.json();
        const projectsData = await projectsRes.json();
        const escrowData = await escrowRes.json();

        setStats(statsData);
        setActions(actionsData);
        setContracts(contractsData);
        setProjects(projectsData);
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

    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-bold">
          Founder Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage projects,
          contracts,
          escrow,
          and developers
        </p>

      </div>

      {/* ACTION REQUIRED */}

      <div className="border rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Action Required
        </h2>

        {actions.length === 0 ? (

          <p className="text-gray-500">
            Nothing requires your attention.
          </p>

        ) : (

          <div className="space-y-3">

            {actions.map(
              (action) => (

                <div
                  key={
                    action.contractId
                  }
                  className="border rounded-xl p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {action.projectTitle}
                    </p>

                    <p className="text-sm text-gray-500">

                      {action.type ===
                        "delivery_review"
                        ? "Developer submitted demo"
                        : "Source code ready to unlock"}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/contracts/${action.contractId}`
                      )
                    }
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    Open
                  </button>
                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-5">
        <div className="border rounded-2xl p-5">
          <p className="text-sm text-gray-500">
            Projects Posted
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.projectsPosted ?? 0}
          </h2>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Open Projects
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats?.openProjects ?? 0}
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
            Escrow Funded
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹ {stats?.escrowFunded ?? 0}
          </h2>

        </div>

      </div>

      {/* ACTIVE CONTRACTS */}

      <div className="border rounded-2xl p-6">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold">
            Active Contracts
          </h2>

        </div>

        {contracts.length === 0 ? (

          <p className="text-gray-500">
            No active contracts
          </p>

        ) : (

          <div className="space-y-4">

            {contracts.map(
              (contract) => (

                <div
                  key={contract.contractId}
                  className="border rounded-xl p-5 flex items-center justify-between"
                >

                  <div className="space-y-2">

                    <h3 className="font-semibold text-lg">
                      {contract.projectTitle}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Developer:
                      {" "}
                      {contract.developerName}
                    </p>

                    <div className="flex gap-3 flex-wrap">

                      <span className="px-3 py-1 rounded-full text-xs border">
                        {contract.status}
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs border">
                        Escrow:
                        {" "}
                        {contract.escrowStatus}
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs border">
                        {contract.currency}
                        {" "}
                        {contract.budget}
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

              )
            )}

          </div>

        )}

      </div>

      {/* RECENT PROJECTS */}

      <div className="border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">
            Recent Projects
          </h2>

          <button
            onClick={() => router.push("/founder/projects")}
            className="text-sm text-blue-600"
          >
            View All
          </button>

        </div>

        {projects.length === 0 ? (

          <p className="text-gray-500">
            No projects found
          </p>

        ) : (

          <div className="space-y-4">

            {projects.map(
              (project) => (

                <div
                  key={project.id}
                  className="border rounded-xl p-5 flex justify-between items-center"
                >

                  <div>

                    <h3 className="font-semibold text-lg">
                      {project.title}
                    </h3>

                    <div className="flex gap-3 mt-2 flex-wrap">

                      <span className="px-3 py-1 text-xs border rounded-full">
                        {project.status}
                      </span>

                      <span className="px-3 py-1 text-xs border rounded-full">
                        {project.applicants}
                        {" "}
                        Applicants
                      </span>

                      <span className="px-3 py-1 text-xs border rounded-full">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        router.push(`/founder/projects/${project.id}`)
                      }
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      View Applicants
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/founder/edit/${project.id}`)
                      }
                      className="border px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                  </div>

                </div>

              )
            )}

          </div>
        )}

      </div>


      {/* Escrow */}

      <div className="border rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Escrow Overview
        </h2>

        <div className="grid md:grid-cols-4 gap-5">

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Total Funded
            </p>

            <h3 className="text-2xl font-bold mt-2">
              ₹
              {
                escrow?.totalEscrowFunded ??
                0
              }
            </h3>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Released
            </p>

            <h3 className="text-2xl font-bold mt-2 text-green-600">
              ₹
              {
                escrow?.totalReleased ??
                0
              }
            </h3>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Pending Release
            </p>

            <h3 className="text-2xl font-bold mt-2 text-yellow-600">
              ₹
              {
                escrow?.pendingRelease ??
                0
              }
            </h3>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Completed Contracts
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {
                escrow?.completedContracts ??
                0
              }
            </h3>

          </div>

        </div>

      </div>


    </div>

  );

}