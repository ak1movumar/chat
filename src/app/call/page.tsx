import VideoCallPage from "@/components/page/video-call/VideoCallPage";
import { Suspense } from "react";

const page = () => {
  return;
  <Suspense fallback={<div>Loading...</div>}>
    <VideoCallPage />
  </Suspense>;
};

export default page;
