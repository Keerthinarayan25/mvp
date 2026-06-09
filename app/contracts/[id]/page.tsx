"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import DeliveryCard from "@/components/contracts/DeliveryCard";
import DeliveryForm from "@/components/contracts/DeliveryForm";
import ApproveButtons from "@/components/contracts/ApproveButtons";
import ContractStatusBadge from "@/components/contracts/ContractStatusBadge";
import { useAuth } from "@/store/useAuth";
import HandoffForm from "@/components/contracts/HandoffForm";
import HandoffCard from "@/components/contracts/HandoffCard";
import CancelContractButton from "@/components/contracts/CancelContractButton";


interface Message {
  id: number;
  text: string;
  senderName: string;
  senderId: number;
  createdAt: string
}

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [delivery, setDelivery] = useState<any[]>([]);
  const [handoff, setHandoff] = useState<any>(null);


  const fetchMessages = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/contracts/${id}/messages`);

      if (!res.ok) return;
      const data: Message[] = await res.json();

      setMessages((prev) => {
        if (prev.length === data.length && prev[prev.length - 1]?.id === data[data.length - 1]?.id) {
          return prev;
        }
        return data;
      });
      setLoading(false);
    } catch {

    }
  }, [id]);

  const fetchContract = useCallback(async () => {
    const res = await fetch(`/api/contracts/${id}`);

    if (!res.ok) return;

    const data = await res.json();

    setContract(data);
  }, [id]);

  const fetchDelivery = useCallback(async () => {
    const res =
      await fetch(
        `/api/contracts/${id}/deliveries`
      );

    if (!res.ok) return;

    const data = await res.json();

    setDelivery(data ?? []);
  }, [id]);

  const fetchHandoff = useCallback(async () => {

    const res = await fetch(`/api/contracts/${id}/handoff`);

    const data = await res.json();

    setHandoff(data);
  }, [id]);

  useEffect(() => {

    fetchContract();
    fetchDelivery();
    fetchMessages();
    fetchHandoff();

    const interval = setInterval(() => {

      if (document.visibilityState === "visible") {
        fetchMessages();
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [
    fetchContract,
    fetchDelivery,
    fetchMessages,
    fetchHandoff
  ]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(user => setCurrentUserId(user.id))
      .catch(() => { });
  }, [])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);

    const tempMessage: Message = {
      id: Date.now(),
      text: trimmed,
      senderId: currentUserId || 0,
      senderName: "You",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {

      await fetch(`/api/contracts/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contractId: id,
          messageText: trimmed,
        }),
      });

      fetchMessages();
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  console.log("USER", user);

  console.log("CONTRACT", contract);

  console.log("DELIVERY", delivery);

  return (
    <div className="max-w-5xl mx-auto mt-10 border rounded-xl shadow bg-white overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center gap-3">
        <h1 className="text-xl font-semibold">Contract Workspace #{id}</h1>
        {contract && <ContractStatusBadge status={contract.contract.status} />}
      </div>

      {/* Two columns */}
      <div className="flex h-[600px]">

        {/* LEFT — Chat */}
        <div className="flex flex-col flex-1 border-r">

          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
            {loading ? (
              <p>Loading...</p>
            ) : messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${isMe ? "bg-black text-white" : "bg-white border"}`}>
                      {!isMe && <p className="text-xs font-semibold">{msg.senderName}</p>}
                      <p>{msg.text}</p>
                      <p className="text-[10px] mt-1 opacity-70 text-right">{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type message..."
            />
            <button
              disabled={!text.trim()}
              onClick={sendMessage}
              className={`px-4 rounded ${text.trim() ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Send
            </button>
          </div>

        </div>

        {/* RIGHT — Contract Info & Actions */}
        <div className="w-[380px] flex flex-col overflow-y-auto p-4 space-y-4">

          {contract ? (
            <>
              <h1 className="text-2xl font-bold">{contract.project.title}</h1>
              <p className="text-gray-600">{contract.project.description}</p>

              <div className="flex gap-4 text-sm">
                <span>Budget: {contract.contract.currency} {contract.contract.agreedprice}</span>
                <span>Delivery: {contract.contract.deliveryValue} {contract.contract.deliveryUnit}</span>
              </div>

              <ContractStatusBadge status={contract.contract.status} />

              {user?.activeRole === "developer" &&
                contract?.contract?.status === "active" &&
                contract?.contract?.developerId === user?.id && (
                  <DeliveryForm contractId={contract.contract.id} onDelivered={() => fetchDelivery()} />
                )}

              {user?.activeRole === "developer" &&
                contract?.contract?.status === "awaiting_handoff" &&
                contract?.contract?.developerId === user?.id &&
                !handoff && (
                  <HandoffForm contractId={contract.contract.id} onUploaded={() => fetchHandoff()} />
                )}

              <div className="space-y-4">
                {delivery.map((d: any) => <DeliveryCard key={d.id} delivery={d} />)}
              </div>

              {handoff && <HandoffCard handoff={handoff} />}

              {user?.activeRole === "founder" &&
                contract?.contract?.status === "active" &&
                contract.contract.founderId === user?.id &&
                delivery.length > 0 && (

                  <ApproveButtons
                    contractId={contract.contract.id}
                    onRefresh={() => fetchContract()} />
                )}

              {user?.activeRole === "founder" &&
                contract?.contract?.status === "active" &&
                contract?.contract?.founderId === user?.id && (

                  <CancelContractButton
                    contractId={contract.contract.id} onCancelled={() => fetchContract()} />
                )}

              {user?.activeRole === "founder" &&
                contract?.contract?.status === "awaiting_handoff" &&
                handoff && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/contracts/${contract.contract.id}/complete`, { method: "POST" });
                      fetchContract();
                    }}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    Confirm Handoff
                  </button>
                )}
            </>
          ) : (
            <p className="text-gray-400 text-sm">Loading contract...</p>
          )}

        </div>
      </div>
    </div>
  );
}