"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ui/ChatWidget"), {
  ssr: false,
});

export default function ChatWidgetLoader() {
  return <ChatWidget />;
}
