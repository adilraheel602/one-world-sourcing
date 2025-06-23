//dashboard/messages/page.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Users,
  FileText,
  MessageSquare,
  Inbox,
  Archive,
  Trash2,
  Edit,
  X,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/auth/users/me/", {
          headers: { Authorization: `JWT ${token}` },
        })
        .then((res) => {
          setCurrentUser(res.data);
        });
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);

    if (storedToken) {
      axios
        .get("http://127.0.0.1:8000/api/messages/inbox/", {
          headers: {
            Authorization: `JWT ${storedToken}`,
          },
        })
        .then((res) => {
          setConversations(res.data);
          if (res.data.length > 0) {
            setActiveConversation(res.data[0]);
            fetchMessages(res.data[0].id, storedToken);
          }
        })
        .catch((err) => console.error("Inbox fetch error:", err));
    }
  }, []);

  const fetchMessages = (conversationId: number, token: string | null) => {
    if (!token) return;
    axios
      .get(`http://127.0.0.1:8000/api/messages/${conversationId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      
      .then((res) => {
        setActiveConversation((prev: any) => ({ ...prev, messages: res.data }));
      })
      .catch((err) => console.error("Message fetch error:", err));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("JWT token missing.");
      return;
    }

    try {
      const response = await fetch(
  `http://127.0.0.1:8000/api/messages/send/`, // ✅ Use your Django send_message view
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      conversation_id: activeConversation.id,
      content: newMessage,
    }),
  }
);


      setNewMessage("");
      setAttachments([]); // if using attachments later
      fetchMessages(activeConversation.id, token); // 🔄 refresh after sending
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message.");
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchTerm === "" ||
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.last_message?.content
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || conv.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <FileText className="h-4 w-4" />;
      case "supplier":
        return <Users className="h-4 w-4" />;
      case "order":
        return <Package className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "excel":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "image":
        return (
          <Image
            src={"/placeholder.svg"}
            alt="Attachment"
            width={40}
            height={40}
            className="object-cover"
          />
        );
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">
            View and manage all your communications
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-180px)]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="p-2 border-b border-gray-200">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" onClick={() => setFilter("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="quote" onClick={() => setFilter("quote")}>
                    Quotes
                  </TabsTrigger>
                  <TabsTrigger
                    value="supplier"
                    onClick={() => setFilter("supplier")}
                  >
                    Suppliers
                  </TabsTrigger>
                  <TabsTrigger value="order" onClick={() => setFilter("order")}>
                    Orders
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredConversations.map((conv) => (
                  <li
                    key={conv.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      activeConversation?.id === conv.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      setActiveConversation(conv);
                      fetchMessages(conv.id, token);
                    }}
                  >
                    <div className="flex items-start p-4">
                      <div className="relative mr-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={"/placeholder.svg"}
                            alt={conv.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium truncate">
                            {conv.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(conv.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {getTypeIcon(conv.type)}
                          <span className="ml-1 capitalize">{conv.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conv.last_message?.content || "(No messages yet)"}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Message content */}
          <div className="w-2/3 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">
                {activeConversation?.name}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation?.messages?.map((msg: any) => {
                const isCurrentUser = msg.sender.id === currentUser?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-4 shadow-sm ${
                        isCurrentUser
                          ? "bg-black text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                      }`}
                    >
                      <div className="flex items-center mb-1 text-sm font-medium">
                        {msg.sender.full_name || msg.sender.email}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <div className="mt-2 text-right text-xs opacity-70">
                        {new Date(msg.sent_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] pr-10 resize-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0"
                    onClick={() =>
                      document.getElementById("attachment-upload")?.click()
                    }
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    id="attachment-upload"
                    className="hidden"
                    multiple
                    onChange={(e) =>
                      setAttachments(Array.from(e.target.files || []))
                    }
                  />
                </div>
                <Button type="submit" className="ml-2 h-10">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Package(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
