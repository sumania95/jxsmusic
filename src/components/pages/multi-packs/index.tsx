import { useAtom } from "jotai"
import { defaultPageLimit } from "@/state/globalState"
import { api } from "@/utils/api"
import EmptyComponent from "../common/empty"
import LoadingSkeletonComponents from "../common/loading-skeleton"
import BannerTitleComponent from "@/components/common/banner-title"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import PaginationNewComponents from "@/components/common/pagination-new"
import SearchComponent from "@/components/common/search"
import { ProfileMeta } from "@/components/common/metadata"
import MultiPackItemComponent from "../common/multi-pack-data-item"
import DataGenreComponent from "@/components/common/filter-genre"
import DataTagComponent from "@/components/common/filter-tag"
import FilterActiveResetComponents from "@/components/common/filter-active-reset"

const MultiPacksComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  )

  const [defaultLimit] = useAtom(defaultPageLimit)

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [search] = useQueryState("search", {
    defaultValue: "",
  })

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const [genres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const {
    data: album,
    isLoading,
  } = api.album.getAllMain.useQuery({
    search,
    genre: genres,
    tag: tags,
    skip: Number(Number(pager) * limit - limit),
    take: limit,
  })

  const totalItems = Number(album?.count?._count?.id ?? 0)

  return (
    <>
      <ProfileMeta
        title="Multi Packs"
        description="Collection of DJ Music"
      />

      <div className="w-full bg-[#111518] text-zinc-100">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="border-b border-white/5 pb-4">
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
  {/* Ambient glow */}
  <div
    className="
      pointer-events-none
      absolute
      right-[-120px]
      top-[-180px]
      h-[400px]
      w-[400px]
      rounded-full
      bg-[#B9FF00]/[0.035]
      blur-[100px]
    "
  />

  <div className="relative">
    <div className="mb-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
        Jeff92 & Ayan Sumania Library
      </span>
    </div>

    <div className="flex items-end justify-between gap-4">
      <BannerTitleComponent
        title="Multi Packs"
        description="Multi Packs of exclusive albums & remixes"
      />

      <span className="shrink-0 pb-1 text-[9px] font-medium uppercase tracking-widest text-zinc-700">
        {totalItems} Packs
      </span>
    </div>
  </div>
</section>

          {/* ===================================================
              FILTERS
          =================================================== */}
          <div className="mt-4 flex w-full flex-col gap-3">
            {/* Search */}
            <div className="w-full">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-zinc-700" />

                <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-600">
                  Search
                </span>
              </div>

              <SearchComponent
                className="
                  flex
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/10
                  bg-[#111518]/40
                  px-3
                  py-2
                  text-xs
                  text-zinc-400
                  transition-all
                  duration-200
                  focus-within:border-[#B9FF00]/30
                  focus-within:bg-white/[0.03]
                "
                placeholder="Search title, artist...."
              />
            </div>

            {/* Genre + Tag */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />

                  <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-600">
                    Genre
                  </span>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-white/10
                    bg-[#111518]/40
                    transition-all
                    duration-200
                    hover:border-white/15
                  "
                >
                  <DataGenreComponent />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />

                  <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-600">
                    Tag
                  </span>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-white/10
                    bg-[#111518]/40
                    transition-all
                    duration-200
                    hover:border-white/15
                  "
                >
                  <DataTagComponent />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIVE FILTERS
        ===================================================== */}
        <div className="pt-3">
          <FilterActiveResetComponents />
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="mt-4 w-full">
          <div
            className="
              grid
              w-full
              grid-cols-1
              items-start
              gap-3
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {/* =================================================
                LOADING
            ================================================= */}
            {isLoading &&
              itemSkeleton.map((item) => (
                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.025]
                  "
                >
                  <LoadingSkeletonComponents
                    className="
                      h-72
                      w-full
                      rounded-none
                      bg-white/[0.025]
                    "
                  />

                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />

                    <div className="h-2 w-1/2 animate-pulse rounded bg-white/5" />

                    <div className="h-2 w-2/3 animate-pulse rounded bg-white/5" />
                  </div>
                </div>
              ))}

            {/* =================================================
                ALBUMS
            ================================================= */}
            {!isLoading &&
              album?.albums?.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="
                    group
                    relative
                    rounded-xl
                    border
                    border-white/5
                    bg-white/[0.015]
                    transition-all
                    duration-200
                    hover:border-[#B9FF00]/10
                    hover:bg-white/[0.03]
                  "
                >
                  {/* Hover indicator */}
                  <div
                    className="
                      absolute
                      left-0
                      top-4
                      z-10
                      h-5
                      w-0.5
                      rounded-full
                      bg-[#B9FF00]
                      opacity-0
                      transition-opacity
                      duration-200
                      group-hover:opacity-100
                    "
                  />

                  <MultiPackItemComponent
                    index_key={index}
                    {...item}
                  />
                </div>
              ))}
          </div>

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}
          {!isLoading && totalItems === 0 && (
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.015]">
              <EmptyComponent />
            </div>
          )}

          {/* =====================================================
              PAGINATION
          ===================================================== */}
          {!isLoading && totalItems > 0 && (
            <div className="mt-6 flex w-full items-center justify-center border-t border-white/5 pt-5">
              <PaginationNewComponents
                totalItems={totalItems}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MultiPacksComponent