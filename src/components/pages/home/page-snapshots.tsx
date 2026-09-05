import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Layers3,
  ListMusic,
  Music2,
  Users2,
  type LucideIcon,
} from "lucide-react"

type PageSnapshot = {
  eyebrow: string
  title: string
  description: string
  benefits: string[]
  cta: string
  href: string
  image: string
  imagePosition: string
  icon: LucideIcon
}

const pageSnapshots: PageSnapshot[] = [
  {
    eyebrow: "Build Your Set",
    title: "Find your next club weapon",
    description:
      "Explore fresh DJ edits, remixes, transitions, and performance-ready tracks created for clubs, radio, and livestreams.",
    benefits: [
      "Filter releases by genre, BPM, and musical key",
      "Preview every edit before purchasing",
      "Download your tracks immediately",
    ],
    cta: "Browse tracks",
    href: "/tracks",
    image: "/images/jeff92-ayan-brand-logo.svg",
    imagePosition: "object-[50%_18%]",
    icon: Music2,
  },
  {
    eyebrow: "Curated Collections",
    title: "Build your library faster with packs",
    description:
      "Discover multi-track releases curated around an editor, genre, theme, or performance style.",
    benefits: [
      "Get related tracks in one collection",
      "Maintain a consistent sound throughout your set",
      "Spend less time searching for compatible edits",
    ],
    cta: "Explore packs",
    href: "/multi-packs",
    image: "/images/jeff92-ayan-brand-logo.svg",
    imagePosition: "object-[50%_22%]",
    icon: Layers3,
  },
  {
    eyebrow: "Top DJ Tracks",
    title: "Discover what DJs are playing now",
    description:
      "Browse Jeff92 & Ayan Sumania’s ranked track lists and quickly find the edits receiving the most attention from DJs.",
    benefits: [
      "Explore trending edits and remixes",
      "See the most downloaded and previewed tracks",
      "Find the newest releases in one place",
    ],
    cta: "Explore charts",
    href: "/charts",
    image: "/images/jeff92-ayan-brand-logo.svg",
    imagePosition: "object-[50%_18%]",
    icon: ListMusic,
  },
  {
    eyebrow: "Verified Creators",
    title: "Discover the editors behind the sound",
    description:
      "Meet verified remixers from around the world and explore the individual catalogs shaping Jeff92 & Ayan Sumania.",
    benefits: [
      "Browse releases from verified DJ editors",
      "Find creators that match your performance style",
      "Discover exclusive edits and remixes",
    ],
    cta: "Meet the editors",
    href: "/editors",
    image: "/images/jeff92-ayan-brand-logo.svg",
    imagePosition: "object-[50%_20%]",
    icon: Users2,
  },
]

const HomepagePageSnapshots = () => {
  return (
    <div className="border-t border-white/10">
      {pageSnapshots.map((item, index) => {
        const Icon = item.icon
        const imageFirst = index % 2 === 1

        return (
          <section
            key={item.href}
            className={`
              relative overflow-hidden py-16 sm:py-20 lg:py-24
              ${index > 0 ? "border-t border-white/10" : ""}
            `}
          >
            {/* Section ambient glow */}
            <div
              className={`
                pointer-events-none absolute top-1/2 h-96 w-96
                -translate-y-1/2 rounded-full bg-[#B9FF00]/[0.035]
                blur-[110px]
                ${imageFirst ? "-left-36" : "-right-36"}
              `}
            />

            <div className="relative grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-10">
              {/* Text content */}
              <div
                className={
                  imageFirst
                    ? "lg:order-2 lg:pl-8"
                    : "lg:pr-8"
                }
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B9FF00]/20 bg-[#B9FF00]/10 text-[#B9FF00]">
                    <Icon className="h-4 w-4" />
                  </span>

                  <div>
                    <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                      0{index + 1}
                    </span>

                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B9FF00]">
                      {item.eyebrow}
                    </span>
                  </div>
                </div>

                <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {item.title}
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
                  {item.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {item.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm text-zinc-400"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.45)]" />

                      <span className="leading-6">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={item.href}
                  className="
                    group
                    mt-8
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#B9FF00]
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-black
                    transition
                    hover:shadow-[0_0_30px_rgba(185,255,0,0.15)]
                  "
                >
                  {item.cta}

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Modern cropped snapshot */}
              <Link
                href={item.href}
                aria-label={item.cta}
                className={`
                  group
                  relative
                  block
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/10
                  bg-zinc-950
                  p-2
                  shadow-[0_30px_80px_rgba(0,0,0,0.45)]
                  transition
                  duration-500
                  hover:-translate-y-1
                  hover:border-[#B9FF00]/25
                  ${imageFirst ? "lg:order-1" : ""}
                `}
              >
                {/* Outer yellow glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#B9FF00]/10 blur-[80px]" />

                {/* Browser window */}
                <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#111518]">
                  {/* Browser toolbar */}
                  <div className="relative z-20 flex h-11 items-center border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur-xl">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                      <span className="h-2 w-2 rounded-full bg-[#B9FF00]" />
                    </div>

                    {/* Address bar */}
                    <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.025]">
                      <span className="h-1 w-12 rounded-full bg-zinc-800" />
                    </div>

                    <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-700">
                      Jeff92 & Ayan Sumania
                    </span>
                  </div>

                  {/* Cropped image viewport */}
                  <div className="relative h-[310px] overflow-hidden sm:h-[390px] lg:h-[430px]">
                    <Image
                      src={item.image}
                      alt={`${item.eyebrow} page preview`}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className={`
                        scale-[1.2]
                        object-cover
                        opacity-90
                        transition
                        duration-700
                        ease-out
                        group-hover:scale-[1.25]
                        group-hover:opacity-100
                        ${item.imagePosition}
                      `}
                    />

                    {/* Image overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/10" />

                    {/* Grid texture */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-[0.06]
                        [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)]
                        [background-size:40px_40px]
                      "
                    />

                    {/* Lower glow */}
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#B9FF00]/10 blur-[70px]" />

                    {/* Image label */}
                    <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-[#111518]/70 px-3 py-2 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.8)]" />

                      <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-300">
                        {item.eyebrow}
                      </span>
                    </div>

                    {/* Floating content */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <div className="max-w-[75%] rounded-2xl border border-white/10 bg-[#111518]/75 p-4 shadow-2xl backdrop-blur-xl">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#B9FF00]">
                          Jeff92 & Ayan Sumania
                        </span>

                        <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-5 text-white sm:text-base">
                          {item.title}
                        </p>
                      </div>

                      <span
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#B9FF00]/20
                          bg-[#B9FF00]
                          text-black
                          shadow-[0_0_25px_rgba(185,255,0,0.15)]
                          transition
                          duration-300
                          group-hover:scale-110
                        "
                      >
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative bottom highlight */}
                <div className="mx-auto mt-2 h-px w-1/3 bg-gradient-to-r from-transparent via-[#B9FF00]/40 to-transparent" />
              </Link>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default HomepagePageSnapshots
