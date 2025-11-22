"use client";
import { useSearchParams } from "next/navigation";
import { v4 as randomID } from "uuid";
import scss from "./videoCallPage.module.scss";
import { useEffect, useRef } from "react";

export default function VideoCallPage() {
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID") || randomID();
  const meetingRef = useRef<HTMLDivElement>(null);
  const zegoRef = useRef<any>(null);

  useEffect(() => {
    const initMeeting = async () => {
      if (!meetingRef.current) return;

      try {
        const { ZegoUIKitPrebuilt } = await import(
          "@zegocloud/zego-uikit-prebuilt"
        );
        
        const appID = Number(process.env.NEXT_PUBLIC_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET;
        
        if (!appID || !serverSecret) {
          console.error("Переменные окружения NEXT_PUBLIC_APP_ID и NEXT_PUBLIC_SERVER_SECRET не настроены");
          return;
        }
        
        const userID = randomID();
        const userName = "Umar05";
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );
        
        const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
        zegoRef.current = zegoInstance;
        
        zegoInstance.joinRoom({
          container: meetingRef.current,
          sharedLinks: [
            {
              name: "umar dev meeting room",
              url: `${window.location.origin}${window.location.pathname}?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
        });
      } catch (error) {
        console.error("Ошибка при инициализации видеозвонка:", error);
      }
    };

    initMeeting();

    return () => {
      if (zegoRef.current) {
        zegoRef.current.destroy();
      }
    };
  }, [roomID]);

  return <div ref={meetingRef} className={scss.VideoCallPage} />;
}