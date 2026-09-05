"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HorizontalScroll({
  children,
  speed = 20,
}: {
  children: React.ReactNode
  speed?: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startScroll = (direction: "left" | "right") => {
    stopScroll()

    intervalRef.current = setInterval(() => {
      if (!scrollRef.current) return

      scrollRef.current.scrollLeft +=
        direction === "right" ? speed : -speed
    }, 16) // ~60fps
  }

  const stopScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return (
    <div className="relative w-full group">
      {/* Left Arrow */}
      <button
        onMouseDown={() => startScroll("left")}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={() => startScroll("left")}
        onTouchEnd={stopScroll}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2
                   bg-[#111518]/60 hover:bg-[#111518] p-2 rounded-full hidden md:flex"
      >
        <ChevronLeft className="text-white" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
      >
        {children}
      </div>

      {/* Right Arrow */}
      <button
        onMouseDown={() => startScroll("right")}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={() => startScroll("right")}
        onTouchEnd={stopScroll}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2
                   bg-[#111518]/60 hover:bg-[#111518] p-2 rounded-full hidden md:flex"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  )
}
