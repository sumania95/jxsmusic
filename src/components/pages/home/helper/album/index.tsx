import React, { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { api } from "@/utils/api"
import { AlbumCard } from "./album-card"
import Link from "next/link"

// ===== CONFIG =====
const CARD_WIDTH = 220
const GAP = 16
const TAKE = 10
// ==================

export default function AlbumsRow() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.album.getAllMainHome.useInfiniteQuery(
    {
      take: TAKE,
      search: "",
      sort: "desc",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const albums =
    data?.pages.flatMap((page) => page.albums) ?? []

  // ===== UPDATE SCROLL STATES =====
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      setCanScrollPrev(el.scrollLeft > 0)

      setCanScrollNext(
        el.scrollLeft + el.clientWidth <
          el.scrollWidth - 5
      )
    }

    update()

    el.addEventListener("scroll", update)
    window.addEventListener("resize", update)

    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [albums.length])

  // ===== SCROLL PREVIOUS =====
  const scrollPrev = () => {
    if (!scrollRef.current) return

    scrollRef.current.scrollBy({
      left: -(CARD_WIDTH + GAP) * TAKE,
      behavior: "smooth",
    })
  }

  // ===== SCROLL NEXT =====
  const scrollNext = async () => {
    if (!scrollRef.current) return

    const el = scrollRef.current
    const before = el.scrollLeft

    if (
      hasNextPage &&
      el.scrollLeft + el.clientWidth >=
        el.scrollWidth - CARD_WIDTH
    ) {
      await fetchNextPage()
    }

    requestAnimationFrame(() => {
      el.scrollTo({
        left: before + (CARD_WIDTH + GAP) * TAKE,
        behavior: "smooth",
      })
    })
  }

  return (
    <section className="w-full">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Curated Collection
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Multi Packs
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            DJ-ready packs from verified editors.
          </p>
        </div>

        {/* =======================================================
            CONTROLS
        ======================================================= */}
        <div className="flex items-center gap-2">
          <Link
            href="/multi-packs"
            className="
              mr-1
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3.5
              py-2
              text-[11px]
              font-medium
              uppercase
              tracking-wider
              text-zinc-400
              transition-all
              hover:border-[#B9FF00]/30
              hover:bg-[#B9FF00]/5
              hover:text-[#B9FF00]
              sm:inline-flex
            "
          >
            See all
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous multi packs"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-zinc-400
              transition-all
              hover:border-white/20
              hover:bg-white/[0.08]
              hover:text-white
              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={
              (!canScrollNext && !hasNextPage) ||
              isFetchingNextPage
            }
            aria-label="Next multi packs"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-zinc-400
              transition-all
              hover:border-[#B9FF00]/30
              hover:bg-[#B9FF00]/10
              hover:text-[#B9FF00]
              disabled:pointer-events-none
              disabled:opacity-30
            "
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =========================================================
          ALBUM ROW
      ========================================================= */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            top-0
            z-10
            w-8
            bg-linear-to-r
            from-black
            to-transparent
          "
        />

        {/* Right fade */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-0
            top-0
            z-10
            w-12
            bg-linear-to-l
            from-black
            to-transparent
          "
        />

        <div
          ref={scrollRef}
          className="
            flex
            gap-4
            overflow-x-auto
            pr-8
            touch-pan-x
            select-none
            scrollbar-hide
          "
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {albums.map((album) => (
            <div
              key={album.id}
              className="
                shrink-0
                transition-transform
                duration-300
                hover:-translate-y-1
              "
              style={{
                width: CARD_WIDTH,
              }}
            >
              <AlbumCard {...album} />
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          MOBILE SEE ALL
      ========================================================= */}
      <div className="mt-5 sm:hidden">
        <Link
          href="/multi-packs"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-medium
            uppercase
            tracking-wider
            text-zinc-500
            transition
            hover:text-[#B9FF00]
          "
        >
          See all multi packs
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  )
}