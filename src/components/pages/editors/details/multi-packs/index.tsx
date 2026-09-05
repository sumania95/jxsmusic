import PaginationNewComponents from "@/components/common/pagination-new"
import SearchComponent from "@/components/common/search"
import EmptyComponent from "@/components/pages/common/empty"
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton"
import MultiPackItemComponent from "@/components/pages/common/multi-pack-data-item"
import { defaultPageLimit } from "@/state/globalState"
import { api } from "@/utils/api"
import { useAtom } from "jotai"
import { parseAsInteger, useQueryState } from "nuqs"
import React from "react"

type Props = {
  id: string
}

const EditorMultiPackComponent = ({ id }: Props) => {
  const itemSkeleton: number[] = Array.from(
    { length: 12 },
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

  const { data: album, isLoading } =
    api.album.getAllMainEditor.useQuery({
      search,
      skip: Number(Number(pager) * limit - limit),
      take: limit,
      editorId: id,
    })

  const totalItems = Number(album?.count._count.id) ?? 0

  return (
    <div className="w-full">
      {/* =====================================================
          SEARCH
      ===================================================== */}
      <div
        className="
          relative
          mb-5
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-white/[0.02]
          p-3
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-120px]
            h-64
            w-64
            rounded-full
            bg-[#B9FF00]/[0.02]
            blur-[80px]
          "
        />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
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
                tracking-[0.18em]
                text-zinc-600
              "
            >
              Search Multi Packs
            </span>
          </div>

          <SearchComponent
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-md
              border
              border-white/10
              bg-[#111518]/30
              p-1.5
              px-2
              text-zinc-300
              placeholder:text-zinc-700
            "
            placeholder="Search title, artist...."
          />
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div
        className="
          mb-3
          flex
          items-end
          justify-between
          gap-3
          border-b
          border-white/5
          pb-3
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_8px_rgba(185,255,0,0.7)]
              "
            />

            <h3
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Multi Packs
            </h3>
          </div>

          <p
            className="
              mt-1
              text-[9px]
              font-medium
              uppercase
              tracking-widest
              text-zinc-700
            "
          >
            Exclusive collections
          </p>
        </div>

        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-widest
            text-zinc-700
          "
        >
          {totalItems} Packs
        </span>
      </div>

      {/* =====================================================
          PACK GRID
      ===================================================== */}
      <div
        className="
          grid
          w-full
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {/* Loading */}
        {isLoading &&
          itemSkeleton.map((_, index) => (
            <LoadingSkeletonComponents
              key={index}
              className="
                aspect-square
                w-full
                rounded-xl
                border
                border-white/5
                bg-white/[0.02]
              "
            />
          ))}

        {/* Packs */}
        {!isLoading &&
          album?.albums.map((item, index) => (
            <MultiPackItemComponent
              {...item}
              index_key={index}
              key={item.id}
            />
          ))}
      </div>

      {/* =====================================================
          EMPTY
      ===================================================== */}
      {!isLoading && totalItems === 0 && (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-white/5
            bg-white/[0.015]
            py-8
          "
        >
          <EmptyComponent />
        </div>
      )}

      {/* =====================================================
          PAGINATION
      ===================================================== */}
      {totalItems > 0 && (
        <div className="mt-6">
          <PaginationNewComponents
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  )
}

export default EditorMultiPackComponent