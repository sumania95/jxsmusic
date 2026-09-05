"use client";

import CountdownUI from "@/components/common/countdown";
import { useEffect, useState } from "react";

// Manila offset is used only for display purposes
const MANILA_OFFSET = 8 * 60 * 60 * 1000;

export default function CountdownManila() {
  // ✅ Target in UTC
  const targetUTC = new Date(Date.UTC(new Date().getFullYear(), 11, 31, 16, 0, 0));

  const [timeLeft, setTimeLeft] = useState(
    targetUTC.getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetUTC.getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
        🎉 RELEASED
      </div>
    );
  }

  const total = Math.floor(timeLeft / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  // ✅ Pass targetDate prop to display below countdown
  // const targetManila = new Date(targetUTC.getTime() + MANILA_OFFSET);

  return (
    <CountdownUI
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      targetDate={new Date()}
    />
  );
}
