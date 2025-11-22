import ChatListPage from "@/components/chatList/ChatListPage";
import scss from "./page.module.scss";
import Chat from "@/components/Chat";
import ChatWindow from "@/components/chatWindow/ChatWindow";

export default function page() {
  return (
    <div className={scss.main}>
        <ChatListPage />
        <Chat/>
    </div>
  );
}
