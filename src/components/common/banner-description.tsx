import React from 'react'


type Props = {
  description: string
}


const BannerDescriptionComponent = (props: Props) => {
  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.025]
        px-5
        py-4
        sm:px-6
      "
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          right-[-80px]
          top-[-100px]
          h-[220px]
          w-[220px]
          rounded-full
          bg-[#B9FF00]/[0.035]
          blur-[80px]
        "
      />


      <div className="relative flex items-start gap-3">
        {/* Yellow accent */}
        <div
          className="
            mt-2
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            bg-[#B9FF00]
            shadow-[0_0_10px_rgba(185,255,0,0.7)]
          "
        />


        {/* Description */}
        <div
          className="
            w-full
            text-sm
            font-medium
            leading-relaxed
            text-zinc-700
            dark:text-zinc-300
            md:text-base
          "
        >
          {props.description}
        </div>
      </div>
    </div>
  )
}


export default BannerDescriptionComponent