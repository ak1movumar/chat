"use client";
import { useEffect, useState } from "react";
import scss from "./chat.module.scss";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { SUPA_KEY, SUPA_URL } from "@/constants/supabase";
import { CiVideoOn } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";

interface Imessages {
  message: string;
  id: number;
  room_id: string;
  created_at: string;
}

// ✅ Клиент создаётся один раз
const SUPA_CLIENT = createClient(SUPA_URL, SUPA_KEY);

export default function Chat() {
  const router = useRouter();
  const { room } = useParams();
  const [messages, setMessages] = useState<Imessages[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    // ✅ Уникальное имя канала для каждой комнаты
    const channel = SUPA_CLIENT.channel(`room-${room}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat-fs",
          filter: `room_id=eq.${room}`, // ✅ Правильный синтаксис
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
      const { data, error } = await SUPA_CLIENT
        .from("chat-fs")
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
    setValue(""); // ✅ Очищаем input
  };

  return (
    <div className={scss.wrapper}>
      <header className={scss.header}>
        <h2>{room}</h2>
        <div className={scss.icons}>
          <CiVideoOn size={28} onClick={() => router.push("/call")} />
          <IoIosCall size={28} />
          <FiMoreVertical size={28} />
        </div>
      </header>
      
      {messages.map((item) => (
        <div key={item.id} className={scss.messages}>
          <h3>{item.message}</h3>
        </div>
      ))}
      
      <div className={scss.inputBox}>
        <input
          type="text"
          placeholder="Введите сообщение"
          value={value} // ✅ Контролируемый input
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}