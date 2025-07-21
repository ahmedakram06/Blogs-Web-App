import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { socket } from "../config/socket";
import { setOnlineUsers } from "../store/slices/onlineUsersSlice";
import type { ChatMessage, User } from "../types";

export default function Chat() {
  //State and Hooks
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const onlineUsers = useAppSelector((state) => state.onlineUsers);

  //Local States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen to socket events (backend communication)
  useEffect(() => {
    if (user) {
      socket.on("receiveMessage", (payload) => {
        setMessages((prev) => [...prev, payload]); //show in UI
      });

      socket.on("online-users", (users: User[]) => {
        dispatch(setOnlineUsers(users));
      });

      // Send presence to server
      socket.emit("joinRoom", {
        userId: user.id,
        userName: user.name,
        roomName: `global-${user.id}`, // Unique room for tracking online users
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.off("online-users");
    };
  }, [user, dispatch]);

  const handleUserSelect = (targetUser: User) => {
    setSelectedUser(targetUser);
    const privateRoom = [user?.id, targetUser.id].sort().join("-");
    setRoomName(privateRoom);
    setMessages([]);

    socket.emit("joinRoom", {
      userId: user?.id,
      userName: user?.name,
      roomName: privateRoom,
    });
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !roomName) return;

    const payload = {
      roomName,
      senderId: user?.id,
      receiverId: selectedUser.id,
      message,
      timeSent: Date.now(),
    };

    socket.emit("sendMessage", payload); // sent to server
    setMessage("");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Messenger</h2>

      <div className="flex gap-4">
        {/* Sidebar: Online Users */}
        <div className="w-1/3 border-r pr-4">
          <h3 className="font-semibold mb-2">Online Users</h3>
          <div className="space-y-2">
            {onlineUsers
              .filter((u) => u.id !== user?.id)
              .map((u) => (
                <div
                  key={u.id}
                  className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
                    selectedUser?.id === u.id ? "bg-blue-200 font-bold" : ""
                  }`}
                  onClick={() => handleUserSelect(u)}
                >
                  {u.name}
                </div>
              ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-2/3">
          {selectedUser ? (
            <>
              <h3 className="text-lg font-medium mb-2">
                Chat with {selectedUser.name}
              </h3>

              <div
                ref={chatContainerRef}
                className="h-64 overflow-y-auto border p-3 rounded mb-4 bg-gray-50"
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>
                      {msg.senderId === user?.id ? "You" : selectedUser.name}:
                    </strong>{" "}
                    {msg.message}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border p-2 rounded"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-600 italic">
              Select a user to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
