import { useAtom } from "jotai"
import { defaultPageLimit } from "@/state/globalState"
import { api } from "@/utils/api"
import EmptyComponent from "../common/empty"
import LoadingSkeletonComponents from "../common/loading-skeleton"
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
import HeaderWithCouponBanner from "../home/coupon"

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
  const page = Number(pager) || 1;
  const total =
    Number(album?.count._count.id) || 0;

  const start =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );
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
          <HeaderWithCouponBanner
            title="Multi Packs"
            description="Multi Packs of exclusive albums & remixes"
          />
          {/* ===================================================
              FILTERS
          =================================================== */}
          <section className="rounded-2xl border border-white/10 bg-white/2.5 p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              {/* Desktop / tablet filters */}
              <div className="scrollbar-hide flex lg:justify-between w-full gap-2 overflow-x-auto pb-1">
                <div className="flex gap-2 items-center">
                  <div className="shrink-0">
                    <DataGenreComponent />
                  </div>

                  <div className="shrink-0">
                    <DataTagComponent />
                  </div>
                </div>
              </div>

              {/* Mobile search */}
              <div className="w-full">
                <SearchComponent
                  className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#111518]/40 px-3 py-2 text-zinc-300 transition focus-within:border-[#B9FF00]/30 focus-within:bg-[#111518]/60"
                  placeholder="Search title, artist..."
                />
              </div>
              <div className="w-full">
                <h3 className="text-xs text-zinc-400">
                  Showing {start}–{end} of {total}{" "}
                  {total === 1 ? "pack" : "packs"}
                </h3>
              </div>
            </div>
          </section>
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