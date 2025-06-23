"use client";

import { useEffect, useState } from "react";

interface Message {
  id: number;
  sender_name: string;
  sender_profile_image: string;
  content: string;
  sent_at: string;
}

interface QuoteChatSectionProps {
  quoteId: string;
}

export default function QuoteChatSection({ quoteId }: QuoteChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setToken(accessToken);

    if (!accessToken) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/quotes/${quoteId}/messages/`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [quoteId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !token) return;

    try {
      const res = await fetch(
        `http://localhost:8000/quotes/${quoteId}/messages/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
        {Array.isArray(messages) &&
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              <img
                src={msg.sender_profile_image || "/placeholder.svg"}
                className="w-8 h-8 rounded-full"
                alt="sender"
              />
              <div>
                <p className="text-sm font-semibold">{msg.sender_name}</p>
                <p className="text-sm mt-1">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.sent_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-2 pt-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
