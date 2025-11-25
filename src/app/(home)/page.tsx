"use client";
import ChatListPage from "@/components/chatList/ChatListPage";
import scss from "./page.module.scss";
import Chat from "@/components/Chat";
import { useState } from "react";

export default function page() {
  const [selectedChat, setSelectedChat] = useState<{
    roomLink: string;
    name: string;
    image: string;
  } | null>(null);

  return (
    <div className={scss.main}>
      <ChatListPage onChatSelect={setSelectedChat} />
      {selectedChat ? (
        <Chat
          room={selectedChat.roomLink}
          chatName={selectedChat.name}
          chatImage={selectedChat.image}
        />
      ) : (
        <div className={scss.emptyState}>
          <h2>Выберите чат для начала общения</h2>
        </div>
      )}
    </div>
  );
}
