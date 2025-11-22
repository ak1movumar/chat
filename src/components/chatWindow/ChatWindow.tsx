"use client"
import scss from "./chatWindow.module.scss";
import { useParams } from "next/navigation";
import { CiVideoOn } from "react-icons/ci";
import { useState } from "react";

export default function ChatWindow() {
  const { id } = useParams();
  const [value, setValue] = useState("");

  return (
    <div className={scss.wrapper}>
      <header className={scss.header}>

        <h2>Chat #{id}</h2>
        <CiVideoOn size={28} />
      </header>

      <div className={scss.messages}>
        <div className={scss.otherMsg}>Салам!</div>
        <div className={scss.myMsg}>Привет 👋</div>
      </div>

      <div className={scss.inputBox}>
        <input 
          type="text" 
          placeholder="Message..."
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button>Send</button>
      </div>
    </div>
  );
}
