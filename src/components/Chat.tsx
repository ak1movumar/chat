"use client";
import { useEffect, useState } from "react";
import scss from "./chat.module.scss";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { SUPA_KEY, SUPA_URL } from "@/constants/supabase";
import { CiVideoOn } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

interface Imessages {
  message: string;
  id: number;
  room_id: string;
  created_at: string;
}

export interface ChatProps {
  room: string;
  chatName: string;
  chatImage?: string;
}

const SUPA_CLIENT = createClient(SUPA_URL, SUPA_KEY);

export default function Chat({ room, chatName, chatImage }: ChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Imessages[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setMessages([]);
    
    const channel = SUPA_CLIENT.channel(`room-${room}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat-fs",
          filter: `room_id=eq.${room}`,
        },
        (payload) => {
          console.log("Получено сообщение:", payload.new);
          setMessages((prev) => [...prev, payload.new as Imessages]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime статус:", status);
      });

    const initChat = async () => {
      const { data, error } = await SUPA_CLIENT.from("chat-fs")
        .select("*")
        .eq("room_id", room)
        .order("created_at", { ascending: true });

      if (error) console.error("Ошибка:", error);
      if (data) setMessages(data);
    };

    initChat();

    return () => {
      SUPA_CLIENT.removeChannel(channel);
    };
  }, [room]);

  const sendMessage = async () => {
    if (!value.trim()) return;

    const { error } = await SUPA_CLIENT.from("chat-fs").insert({
      message: value,
      room_id: room,
    });

    if (error) console.error("Ошибка отправки:", error);
    setValue("");
  };
  return (
    <div className={scss.wrapper}>
      <header className={scss.header}>
         {chatImage ? (
            <img 
              src={chatImage} 
              alt=""
              width={45}
              height={45}
              style={{ 
                borderRadius: "50%", 
                objectFit: "cover",
                marginRight: "12px"
              }}
            />
          ) : (
            <FaUserCircle 
              size={45} 
              style={{ 
                marginRight: "12px", 
                color: "#999" 
              }}
            />
          )}
        <h2>{chatName || room}</h2>
        <div className={scss.icons}>
          <CiVideoOn size={28} onClick={() => router.push("/call")} />
          <IoIosCall size={28} />
          <FiMoreVertical size={28} />
        </div>
      </header>

      <div className={scss.messagesContainer}>
        {messages.map((item) => (
          <div key={item.id} className={scss.messages}>
            <img src={chatImage} alt="" />
            <h3>{item.message}</h3>
          </div>
        ))}
      </div>

      <div className={scss.inputBox}>
        <input
          type="text"
          placeholder="Введите сообщение"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}
