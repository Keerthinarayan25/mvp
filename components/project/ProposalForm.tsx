"use client";

import { useState } from "react";

type Props = {
  projectId: number;
  currency: string;
};

export default function ProposalForm({
  projectId,
  currency,
}: Props) {

  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryValue, setDeliveryValue] = useState("");
  const [deliveryUnit, setDeliveryUnit] = useState("weeks");
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.SyntheticEvent<HTMLElement> ) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res =
        await fetch("/api/applications", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            projectId,
            proposalMessage: proposal,
            proposedPrice: Number(price),
            currency,
            deliveryValue: Number(deliveryValue),
            deliveryUnit,
          }),
        }
        );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      alert("Proposal Submitted ✅");
      setProposal("");
      setPrice("");
      setDeliveryValue("");

    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* PROPOSAL */}
      <div>
        <label className="font-medium">
          Cover Letter
        </label>
        <textarea
          required
          rows={6}
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full border rounded-xl p-3 mt-2"
          placeholder="Explain why you're the best fit..."
        />
      </div>

      {/* PRICE */}
      <div>

        <label className="font-medium">
          Your Price
        </label>

        <div className="relative mt-2">
        
          <input
            required
            type="number"
            value={price}
            onChange={(e) =>setPrice(e.target.value)}
            className="w-full border rounded-xl pl-16 p-3"
            placeholder={currency}
          />
        </div>
      </div>

      {/* DELIVERY */}
      <div>
        <label className="font-medium">
          Delivery Time
        </label>

        <div className="grid grid-cols-2 gap-3 mt-2">

          <input
            required
            type="number"
            value={deliveryValue}
            onChange={(e) =>setDeliveryValue(e.target.value)}
            className="border rounded-xl p-3"
          />

          <select
            value={deliveryUnit}
            onChange={(e) => setDeliveryUnit(e.target.value)}
            className="border rounded-xl p-3"
          >

            <option value="days">
              Days
            </option>

            <option value="weeks">
              Weeks
            </option>

            <option value="months">
              Months
            </option>
          </select>
        </div>
      </div>

      <button
        disabled={loading}
        className="bg-black text-white px-5 py-3 rounded-xl w-full"
      >
        {loading ? "Submitting..." : "Submit Proposal"}
      </button>
    </form>
  );
}