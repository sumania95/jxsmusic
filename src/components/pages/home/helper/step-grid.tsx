import {
  SearchIcon,
  HeadphonesIcon,
  CreditCardIcon,
  ZapIcon,
} from "lucide-react"

export default function StepsGrid() {
  const steps = [
    {
      id: 1,
      title: "Browse",
      description: "Filter by BPM, key, genre, or editor",
      icon: <SearchIcon className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Preview",
      description: "Hear the edit before you buy",
      icon: <HeadphonesIcon className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Buy or use credits",
      description: "185 non-expiring credits for $200",
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Instant Access",
      description: "Download & play immediately",
      icon: <ZapIcon className="h-5 w-5" />,
    },
  ]

  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#B9FF00]/20
            hover:bg-white/[0.05]
          "
        >
          {/* Subtle hover glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-16
              h-32
              w-32
              rounded-full
              bg-[#B9FF00]/[0.06]
              blur-3xl
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          <div className="relative">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#B9FF00]/20
                  bg-[#B9FF00]/10
                  text-[#B9FF00]
                  transition
                  group-hover:border-[#B9FF00]/40
                  group-hover:bg-[#B9FF00]/15
                "
              >
                {step.icon}
              </div>

              <span className="text-xs font-medium tracking-widest text-zinc-700">
                0{step.id}
              </span>
            </div>

            {/* Content */}
            <div className="mt-7">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {step.description}
              </p>
            </div>

            {/* Bottom indicator */}
            <div className="mt-6 h-px w-full bg-white/5">
              <div
                className="
                  h-px
                  w-0
                  bg-[#B9FF00]
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
