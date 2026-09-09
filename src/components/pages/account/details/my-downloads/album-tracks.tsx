import { Album, ChevronDown, Music2 } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

import { api } from "@/utils/api"
import { formatDateShort, formatTrackTitle } from "@/lib/utils"
import DownloadTrackComponent from "@/components/common/download"
import { DownloadZipComponent } from "@/components/common/download-zip"
import PaginationNewComponents from "@/components/common/pagination-new"
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton"
import EmptyComponent from "@/components/pages/common/empty"

import { DownloadsSearchFilter } from "./downloads-search-filter"

export const AlbumTracks = () => {
  const defaultLimit = 20

  const [search] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )

  const [sort] = useQueryState(
    "sort",
    parseAsString.withDefault("desc")
  )

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const safeSort: "asc" | "desc" = sort === "asc" ? "asc" : "desc"
  const skip = Number(pager) * limit - limit

  const paidAlbums = api.downloads.getPaidAlbums.useQuery({
    search,
    skip,
    take: limit,
    sort: safeSort,
  })

  const purchases = paidAlbums.data?.purchases ?? []

  return (
    <>
      <div className="flex flex-col gap-3">
        <DownloadsSearchFilter />
        {paidAlbums.isLoading &&
          <div className="flex flex-col gap-2">
            {Array.from({ length: defaultLimit }).map((_, index) => (
              <LoadingSkeletonComponents
                key={index}
                className="h-16 w-full rounded-xl"
              />
            ))}
          </div>
        }
        {!purchases.length &&
          <EmptyComponent />
        }
        {purchases.map((purchase, index) => {
          const album = purchase.album

          if (!album) {
            return null
          }

          const tracks = album.trackAlbum
            .map(({ track }) => track)
            .filter(
              (track): track is NonNullable<typeof track> => Boolean(track)
            )
            .sort(
              (a, b) =>
                (a.artist ?? "").localeCompare(b.artist ?? "") ||
                (a.title ?? "").localeCompare(b.title ?? "")
            )

          const trackIds = tracks.map(({ id }) => id)

          return (
            <article
              key={`${album.name}-${index}`}
              className="overflow-hidden rounded-2xl border border-cyan-400/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-xs font-bold text-cyan-400">
                    {skip + index + 1}
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/[0.08] text-cyan-600">
                      <Album className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-zinc-200">
                        {album.name}
                      </h3>

                      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-cyan-500">
                        {tracks.length} tracks
                      </p>

                      <h3 className="text-xs">
                        {formatDateShort(purchase.order.createdAt)}
                      </h3>
                    </div>
                  </div>
                </div>

                <DownloadZipComponent
                  id={`${purchase.order.id}-${index}`}
                  fileName={album.name ?? "album"}
                  trackIds={trackIds}
                  source="pack"
                />
              </div>

              <details className="group border-t border-white/[0.05]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[10px] font-medium text-zinc-500 transition hover:bg-white/[0.02] hover:text-zinc-300 [&::-webkit-details-marker]:hidden">
                  Download individual tracks
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>

                <div className="border-t border-white/[0.05] px-4">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 border-b border-white/[0.05] py-3 last:border-b-0"
                    >
                      <Music2 className="h-4 w-4 shrink-0 text-cyan-500" />

                      <h4 className="min-w-0 flex-1 truncate text-xs text-zinc-300">
                        {track.artist} -{" "}
                        {formatTrackTitle(track.title, track.is_explicit)}
                      </h4>

                      <DownloadTrackComponent id={track.id} />
                    </div>
                  ))}
                </div>
              </details>
            </article>
          )
        })}
      </div>

      {(paidAlbums.data?.count ?? 0) > 0 && (
        <PaginationNewComponents totalItems={paidAlbums.data?.count ?? 0} />
      )}
    </>
  )
}