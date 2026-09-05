import { IconPackage } from "@tabler/icons-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"


type Props = {
  description?: string
  title?: string
  className?: string
}


const EmptyComponent = (props: Props) => {
  const title = props.title ?? "No Data Available"

  return (
    <div
      className={cn(
        `
          relative
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.02]
          px-6
          py-20
          sm:py-24
          lg:py-28
        `,
        props.className
      )}
    >
      {/* Ambient Jeff92 & Ayan Sumania glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-52
          w-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#B9FF00]/[0.025]
          blur-[80px]
        "
      />

      <Empty className="relative">
        <EmptyHeader>
          {/* Icon */}
          <EmptyMedia
            variant="icon"
            className="
              mb-2
              h-12
              w-12
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              text-zinc-500
            "
          >
            <IconPackage className="h-5 w-5" />
          </EmptyMedia>

          {/* Small Jeff92 & Ayan Sumania indicator */}
          <div className="mb-1 flex items-center justify-center gap-2">
            <span
              className="
                h-1
                w-1
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_8px_rgba(185,255,0,0.7)]
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Jeff92 & Ayan Sumania
            </span>
          </div>

          {/* Title */}
          <EmptyTitle
            className="
              text-sm
              font-semibold
              tracking-tight
              text-zinc-300
            "
          >
            {title}
          </EmptyTitle>

          {/* Description */}
          {props.description && (
            <EmptyDescription
              className="
                max-w-md
                text-xs
                leading-5
                text-zinc-600
              "
            >
              {props.description}
            </EmptyDescription>
          )}
        </EmptyHeader>
      </Empty>
    </div>
  )
}


export default EmptyComponent