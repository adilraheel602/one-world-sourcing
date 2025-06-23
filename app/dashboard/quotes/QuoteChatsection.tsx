// "use client";

// import { useEffect, useState, ChangeEvent } from "react";

// interface Message {
//   id: number;
//   sender_name: string;
//   sender_profile_image: string;
//   content: string;
//   sent_at: string;
// }

// interface QuoteChatSectionProps {
//   quoteId: string;
// }

// export default function QuoteChatSection({ quoteId }: QuoteChatSectionProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     setToken(accessToken);
//     if (!accessToken) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(
//           `https://1wsbackend-production.up.railway.app/quotes/${quoteId}/messages/`,
//           {
//             headers: {
//               Authorization: `JWT ${accessToken}`,
//             },
//           }
//         );

//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setMessages(data);
//         } else {
//           setMessages([]);
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [quoteId]);

//   const handleSend = async () => {
//     if ((!newMessage.trim() && !selectedFile) || !token) return;

//     const formData = new FormData();
//     formData.append("content", newMessage);
//     if (selectedFile) {
//       formData.append("file", selectedFile);
//     }

//     try {
//       const res = await fetch(
//         `https://1wsbackend-production.up.railway.app/quotes/${quoteId}/messages/`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `JWT ${token}`,
//           },
//           body: formData,
//         }
//       );

//       const msg = await res.json();
//       setMessages((prev) => [...prev, msg]);
//       setNewMessage("");
//       setSelectedFile(null);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
//         {messages.map((msg) => (
//           <div key={msg.id} className="flex items-start gap-2">
//             <img
//               src={msg.sender_profile_image || "/placeholder.svg"}
//               className="w-8 h-8 rounded-full"
//               alt="sender"
//             />
//             <div>
//               <p className="text-sm font-semibold">{msg.sender_name}</p>
//               <p className="text-sm mt-1">{msg.content}</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {new Date(msg.sent_at).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-4">
//         <input
//           type="text"
//           className="flex-1 border border-gray-300 px-3 py-2 rounded-md w-full"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="border border-gray-300 px-2 py-1 rounded-md"
//         />
//         <button
//           className="bg-black text-white px-4 py-2 rounded-md"
//           onClick={handleSend}
//         >
//           Send
//         </button>
//       </div>

//       {selectedFile && (
//         <p className="text-sm text-gray-600">
//           Selected file: {selectedFile.name}
//         </p>
//       )}
//     </div>
//   );
// }

export const fetchQuoteMessages = async (quoteId: string, token: string) => {
  const res = await fetch(
    `https://1wsbackend-production.up.railway.app/quotes/${quoteId}/messages/`,
    {
      headers: { Authorization: `JWT ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};
