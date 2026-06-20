"use client";

import Link from "next/link";
import StatusBadge from "../project/Statusbadge";

type Props = {
  application: any;
  onHire: (id: number) => void;
};

export default function ApplicationCard({ application, onHire, }: Props) {

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {application.developer.name}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Submitted a proposal
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      {/* Metrics */}
      <div className="mt-5 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-slate-500 tracking-wide">
            Proposed Budget
          </p>

          <p className="font-semibold text-slate-900 ">
            {application.currency} {application.proposedPrice}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500  tracking-wide">
            Delivery Time
          </p>

          <p className="font-semibold text-slate-900">
            {application.deliveryValue} {application.deliveryUnit}
          </p>
        </div>
      </div>

      {/* Proposal */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Proposal
        </h4>

        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {application.proposalMessage}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/profile/developer/${application.developer.id}`}
          className=" px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium  hover:bg-slate-50 transition  "
        >
          View Profile
        </Link>

        {application.status === "pending" && (
          <button
            onClick={() => onHire(application.id)}
            className="px-4 py-2 rounded-lg bg-blue-600  text-white font-medium hover:bg-blue-700 transition "
          >
            Hire Developer
          </button>
        )}

        {application.status === "accepted" && (
          <span
            className="px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium "
          >
            ✓ Hired
          </span>
        )}
      </div>
    </div>
  );
}