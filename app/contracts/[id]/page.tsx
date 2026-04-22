"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";


interface Message {
  id: number;
  text: string;
  senderName: string;
  senderId: number;
  createdAt: string
}

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);


  const fetchMessages = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/contracts/${id}`);

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


  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    }, 3000)
    return () => clearInterval(interval);
  }, [fetchMessages])

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

      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contractId: id,
          messageText: text,
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

  return (
    <div className="max-w-3xl mx-auto mt-10 flex flex-col h-[80vh] border rounded-lg shadow">

      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">
          Contract Workspace #{id}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">

        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <p>
            No Message Yet
          </p>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg
                    ${isMe
                      ? "bg-black text-white"
                      : "bg-white border"
                    }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold">
                      {msg.senderName}
                    </p>
                  )}

                  <p>
                    {msg.text}
                  </p>
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {formatTime(msg.createdAt)}
                  </p>
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
          className={`px-4 rounded ${text.trim()
            ? "bg-black text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Send
        </button>

      </div>

    </div >

  )
}