import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"


type Props = {
  className?: string
}


const LoadingSkeletonComponents = ({
  className,
}: Props) => {
  return (
    <Skeleton
      className={cn(
        `
          rounded-xl
          bg-white/[0.05]
          animate-pulse
        `,
        className
      )}
    />
  )
}


export default LoadingSkeletonComponents