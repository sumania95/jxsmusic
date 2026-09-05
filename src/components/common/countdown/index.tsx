"use client";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetDate: Date;
};

export default function CountdownUI({
  days,
  hours,
  minutes,
  seconds,
  targetDate
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            COUNTDOWN (ASIA / MANILA)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <TimeBlock value={days} label="DAYS" />
            <TimeBlock value={hours} label="HOURS" />
            <TimeBlock value={minutes} label="MINUTES" />
            <TimeBlock value={seconds} label="SECONDS" />
          </div>
          {/* ✅ Target date & time below countdown */}
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            {targetDate.toLocaleString("en-US", {
              timeZone: "Asia/Manila",
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TimeBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-extrabold tabular-nums md:text-7xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs font-semibold tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
