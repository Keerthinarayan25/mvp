"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";


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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);


  const fetchMessages = async () => {
    if (!id) return;
    const res = await fetch(`/api/contracts/${id}`);
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000)
    return () => clearInterval(interval);
  }, [id])

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(user => setCurrentUserId(user.id))
  }, [])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {

    if (!text.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contractId: id,
        messageText: text,
      })
    })

    setText("");
    fetchMessages();
  }


  return (
    <div className="max-w-3xl mx-auto mt-10">

      <h1 className="text-xl font-bold mb-4">
        Contract Workspace
      </h1>

      {/* Messages */}
      <div className="border p-4 h-96 overflow-y-auto bg-gray-100 rounded">

        <div className="flex flex-col gap-2">

          {messages.map(msg => {

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
                      : "bg-white border"}`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold">
                      {msg.senderName}
                    </p>
                  )}

                  <p>
                    {msg.text}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>

              </div>
            )

          })}

          <div ref={bottomRef} />
        </div>

      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") sendMessage();
          }}
          className="border p-2 flex-1 rounded"
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

    </div>

  )
}