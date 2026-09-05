"use client"

import Image from "next/image"
import Slider, {
  type CustomArrowProps,
  type Settings,
} from "react-slick"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileAudio2,
  Gauge,
  ShieldCheck,
} from "lucide-react"

const djSoftwares = [
  {
    name: "Serato DJ",
    img: "/images/dj-software/serato_logo.png",
  },
  {
    name: "Rekordbox",
    img: "/images/dj-software/rekordbox_logo.png",
  },
  {
    name: "Traktor",
    img: "/images/dj-software/traktor_logo.png",
  },
  {
    name: "Virtual DJ",
    img: "/images/dj-software/virtualdj_logo.png",
  },
  {
    name: "Engine DJ",
    img: "/images/dj-software/engine-dj.svg",
  },
  {
    name: "djay Pro",
    img: "/images/dj-software/djay_logo.png",
  },
] as const

const compatibilityItems = [
  {
    label: "MP3 & MP4",
    icon: FileAudio2,
  },
  {
    label: "BPM & Key Tagged",
    icon: Gauge,
  },
  {
    label: "DJ Tested",
    icon: ShieldCheck,
  },
] as const

const NextArrow = ({
  onClick,
  className,
}: CustomArrowProps) => (
  <button
    type="button"
    aria-label="Next software"
    onClick={onClick}
    className={`
      ${className ?? ""}
      !absolute
      !-right-2
      !top-1/2
      !z-20
      !flex
      !h-10
      !w-10
      !-translate-y-1/2
      !items-center
      !justify-center
      !rounded-full
      !border
      !border-white/10
      !bg-[#111518]/90
      !text-zinc-400
      !shadow-xl
      !backdrop-blur-md
      !transition-all
      before:!hidden
      hover:!border-[#B9FF00]/30
      hover:!bg-[#B9FF00]
      hover:!text-black
    `}
  >
    <ChevronRightIcon className="h-4 w-4" />
  </button>
)

const PrevArrow = ({
  onClick,
  className,
}: CustomArrowProps) => (
  <button
    type="button"
    aria-label="Previous software"
    onClick={onClick}
    className={`
      ${className ?? ""}
      !absolute
      !-left-2
      !top-1/2
      !z-20
      !flex
      !h-10
      !w-10
      !-translate-y-1/2
      !items-center
      !justify-center
      !rounded-full
      !border
      !border-white/10
      !bg-[#111518]/90
      !text-zinc-400
      !shadow-xl
      !backdrop-blur-md
      !transition-all
      before:!hidden
      hover:!border-[#B9FF00]/30
      hover:!bg-[#B9FF00]
      hover:!text-black
    `}
  >
    <ChevronLeftIcon className="h-4 w-4" />
  </button>
)

const sliderSettings: Settings = {
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  speed: 500,

  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,

  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  pauseOnFocus: true,

  arrows: true,
  dots: false,
  swipe: true,
  swipeToSlide: true,
  draggable: true,

  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
}

type Software = (typeof djSoftwares)[number]

function SoftwareCard({
  software,
  index,
}: {
  software: Software
  index: number
}) {
  return (
    <article
      className="
        group
        relative
        flex
        h-full
        min-h-[180px]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#111518]/50
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#B9FF00]/25
        hover:bg-white/[0.04]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.4)]
        sm:min-h-[195px]
        sm:p-5
      "
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#B9FF00]/[0.07] opacity-0 blur-[45px] transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-700">
          Software
        </span>

        <span className="text-[9px] font-medium tracking-[0.18em] text-zinc-700">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-6">
        <div className="relative h-16 w-full max-w-[170px] sm:h-[72px]">
          <Image
            src={software.img}
            alt={`${software.name} logo`}
            fill
            sizes="170px"
            className="
              object-contain
              opacity-70
              grayscale
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:opacity-100
              group-hover:grayscale-0
            "
          />
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] pt-3 text-center">
        <span className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-white sm:text-sm">
          {software.name}
        </span>
      </div>
    </article>
  )
}

export default function SoftwareCarousel() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] sm:rounded-3xl">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[360px] w-[90%] max-w-[600px] -translate-x-1/2 rounded-full bg-[#B9FF00]/[0.04] blur-[100px]" />

        <div className="absolute bottom-[-180px] right-[-100px] h-72 w-72 rounded-full bg-white/[0.025] blur-[90px]" />
      </div>

      <div className="relative py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10 lg:py-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-0">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-[10px]">
              DJ Compatibility
            </span>
          </div>

          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            Compatible With All Major DJ Software
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
            DJ-ready formats designed to work seamlessly with the tools you
            already use.
          </p>
        </div>

        {/* Mobile: native iOS scrolling */}
        <div
          className="
            mt-8
            overflow-x-auto
            overscroll-x-contain
            px-4
            pb-3
            sm:hidden
            [-webkit-overflow-scrolling:touch]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="flex w-max snap-x snap-mandatory gap-3">
            {djSoftwares.map((software, index) => (
              <div
                key={software.name}
                className="
                  w-[82vw]
                  max-w-[320px]
                  shrink-0
                  snap-center
                  first:ml-0
                  last:mr-4
                "
              >
                <SoftwareCard
                  software={software}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile swipe indicator */}
        <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
          <span className="h-1 w-5 rounded-full bg-[#B9FF00]" />
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="h-1 w-1 rounded-full bg-zinc-700" />

          <span className="ml-2 text-[8px] font-medium uppercase tracking-[0.16em] text-zinc-700">
            Swipe
          </span>
        </div>

        {/* Tablet/Desktop: react-slick */}
        <div
          className="
            relative
            mt-10
            hidden
            px-7
            sm:block
            lg:px-8

            [&_.slick-list]:overflow-hidden
            [&_.slick-slide>div]:h-full
            [&_.slick-track]:flex
            [&_.slick-track]:items-stretch
          "
        >
          <Slider {...sliderSettings}>
            {djSoftwares.map((software, index) => (
              <div
                key={software.name}
                className="h-full px-2 outline-none"
              >
                <SoftwareCard
                  software={software}
                  index={index}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Footer */}
        <div className="mx-4 mt-8 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-6 sm:mx-0 sm:mt-10 sm:grid-cols-3 sm:gap-3">
          {compatibilityItems.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-[#111518]/30 px-3 py-3 text-zinc-500"
              >
                <Icon className="h-3.5 w-3.5 text-[#B9FF00]/70" />

                <span className="text-[9px] font-medium uppercase tracking-[0.14em] sm:text-[10px]">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}