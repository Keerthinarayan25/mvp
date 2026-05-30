"use client";

import Link from "next/link";

type Application = {
  id: number;
  proposalMessage: string;
  proposedPrice: number;
  currency: string;
  deliveryValue: number;
  deliveryUnit: string;
  status: string;
  developer: {
    id: number;
    name: string;
  };
};

type Props = {
  application: Application;
  onHire: (id: number) => void;
};

export default function ApplicationCard({
  application,
  onHire,
}: Props) {


  
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {application.developer.name}
          </h3>

          <p className="text-sm text-gray-500 capitalize">
            {application.status}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {application.currency} {application.proposedPrice}
          </p>

          <p className="text-sm text-gray-500">
            {application.deliveryValue}
            {" "}
            {application.deliveryUnit}
          </p>
        </div>

      </div>

      {/* Proposal */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">
          Proposal
        </h4>

        <p className="text-gray-700">
          {application.proposalMessage}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">

        <Link
          href={`/profile/developer/${application.developer.id}`}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          View Profile
        </Link>

        {application.status === "pending" && (
          <button
            onClick={() => onHire(application.id)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Hire Developer
          </button>
        )}

      </div>
    </div>
  );
}