import React, { useState } from "react"
import { Album, ChevronDown, Music2 } from "lucide-react"
import { IconZip } from "@tabler/icons-react"
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"

import { api } from "@/utils/api"
import { formatDateShort, formatTrackTitle } from "@/lib/utils"

import EmptyComponent from "../common/empty"
import LoadingSkeletonComponents from "../common/loading-skeleton"
import BannerTitleComponent from "@/components/common/banner-title"
import { ProfileMeta } from "@/components/common/metadata"
import DownloadTrackComponent from "@/components/common/download"
import { DownloadZipComponent } from "@/components/common/download-zip"
import SearchComponent from "@/components/common/search"
import PaginationNewFixedLimitComponents from "@/components/common/pagination-new-fixed-limit"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PaginationNewComponents from "@/components/common/pagination-new"
import HeaderWithCouponBanner from "../home/coupon"

const MyDownloadsComponents = () => {
  const [defaultLimit] = useState(20)

  const [tab, setTab] = useQueryState(
    "type",
    parseAsString.withDefault("tracks")
  )

  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("desc")
  )

  const [pager, setPager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [search] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const activeTab =
    tab === "albums"
      ? "albums"
      : "tracks"

  const safeSort =
    sort === "asc"
      ? "asc"
      : "desc"

  const skip =
    Number(Number(pager) * limit - limit)

  const paidTracks =
    api.downloads.getPaidTracks.useQuery(
      {
        search,
        skip,
        take: limit,
        sort: safeSort,
      },
      {
        enabled: activeTab === "tracks",
      }
    )

  const paidAlbums =
    api.downloads.getPaidAlbums.useQuery(
      {
        search,
        skip,
        take: limit,
        sort: safeSort,
      },
      {
        enabled: activeTab === "albums",
      }
    )

  const isLoading =
    activeTab === "tracks"
      ? paidTracks.isLoading
      : paidAlbums.isLoading

  const totalItems =
    activeTab === "tracks"
      ? paidTracks.data?.count ?? 0
      : paidAlbums.data?.count ?? 0

  const changeTab = async (
    nextTab: "tracks" | "albums"
  ) => {
    await Promise.all([
      setTab(nextTab),
      setPager(1),
    ])
  }

  const changeSort = async (
    value: string
  ) => {
    await Promise.all([
      setSort(value),
      setPager(1),
    ])
  }

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <ProfileMeta
        title="My Downloads"
        description="Download your purchased tracks and albums"
      />
      <div className="w-full">
        <HeaderWithCouponBanner
          title="My Downloads"
          description="Download your purchased tracks and albums"
        />
      </div>
      {/* FILTERS */}
      <section
        className="
          grid
          w-full
          gap-3
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.02]
          p-3
          md:grid-cols-[1fr_180px]
        "
      >
        <SearchComponent
          className="
            flex
            w-full
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-[#111518]/20
            px-3
            py-2
            text-zinc-300
            transition
            focus-within:border-[#B9FF00]/30
            focus-within:bg-[#111518]/60
          "
          placeholder="Search title, artist..."
        />

        <Select
          value={safeSort}
          onValueChange={changeSort}
        >
          <SelectTrigger
            className="
              h-11
              w-full
              rounded-xl
              border-white/10
              bg-[#111518]/40
              text-xs
              text-zinc-300
            "
          >
            <SelectValue placeholder="Sort downloads" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>

              <SelectItem value="desc">
                Newest first
              </SelectItem>

              <SelectItem value="asc">
                Oldest first
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* DOWNLOADS */}
      <section
        className="
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/2.5
        "
      >
        {/* TAB LIST */}
        <div
          role="tablist"
          aria-label="Download types"
          className="
            flex
            gap-1
            border-b
            border-white/[0.06]
            p-2
          "
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tracks"}
            onClick={() => changeTab("tracks")}
            className={`
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              transition

              ${
                activeTab === "tracks"
                  ? `
                      bg-green-500/10
                      text-green-400
                    `
                  : `
                      text-zinc-600
                      hover:bg-white/[0.025]
                      hover:text-zinc-300
                    `
              }
            `}
          >
            <Music2 className="h-4 w-4" />
            Tracks
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "albums"}
            onClick={() => changeTab("albums")}
            className={`
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              transition

              ${
                activeTab === "albums"
                  ? `
                      bg-cyan-500/10
                      text-cyan-400
                    `
                  : `
                      text-zinc-600
                      hover:bg-white/[0.025]
                      hover:text-zinc-300
                    `
              }
            `}
          >
            <Album className="h-4 w-4" />
            Albums / Multi-packs
          </button>
        </div>

        <div
          role="tabpanel"
          className="p-3"
        >
          {/* LOADING */}
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({
                length: defaultLimit,
              }).map((_, index) => (
                <LoadingSkeletonComponents
                  key={index}
                  className="h-16 w-full rounded-xl"
                />
              ))}
            </div>
          )}

          {/* TRACKS TAB */}
          {!isLoading &&
            activeTab === "tracks" && (
              <div className="flex flex-col">
                {paidTracks.data?.purchases.length ? (
                  paidTracks.data.purchases.map(
                    (purchase, index) => {
                      const track =
                        purchase.track

                      if (!track) {
                        return null
                      }
                        const trackNumber = skip + index + 1

                      return (
                        <div
                          key={`${track.id}-${index}`}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            border-b
                            border-white/[0.05]
                            py-3
                            last:border-b-0
                          "
                        >
                            <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-green-400/20
          text-[10px]
          font-bold
          text-green-400
        "
      >
        {trackNumber}
      </div>

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-green-500/[0.07]
                              text-green-400
                            "
                          >
                            <Music2 className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3
                              className="
                                truncate
                                text-md
                                font-medium
                                text-zinc-300
                              "
                            >
                              {track.artist} -{" "}
                              {formatTrackTitle(
                                track.title,
                                track.is_explicit
                              )}
                            </h3>
                            
                            <p
                              className="
                                mt-1
                                text-[9px]
                                uppercase
                                tracking-wider
                                text-zinc-400
                              "
                            >
                            
                              {purchase.order.checkoutId}
                            </p>
                            <h3 className="text-xs">{formatDateShort(purchase.order.createdAt)}</h3>
                          </div>

                          <DownloadTrackComponent
                            id={track.id}
                          />
                        </div>
                      )
                    }
                  )
                ) : (
                  <EmptyComponent />
                )}
              </div>
            )}

          {/* ALBUMS TAB */}
          {!isLoading &&
            activeTab === "albums" && (
              <div className="flex flex-col gap-3">
                {paidAlbums.data?.purchases.length ? (
                  paidAlbums.data.purchases.map(
                    (purchase, index) => {
                      const album =
                        purchase.album

                      if (!album) {
                        return null
                      }

                      const tracks =
                        album.trackAlbum
                          .map(
                            ({ track }) =>
                              track
                          )
                          .filter(
                            (
                              track
                            ): track is NonNullable<
                              typeof track
                            > => Boolean(track)
                          )
                          .sort((a, b) => {
                                const artistCompare = (a.artist ?? "").localeCompare(
                                    b.artist ?? ""
                                )

                                if (artistCompare !== 0) {
                                    return artistCompare
                                }

                                return (a.title ?? "").localeCompare(
                                    b.title ?? ""
                                )
                            })

                      const trackIds =
                        tracks.map(
                          (track) => track.id
                        )
                        const albumNumber = skip + index + 1
                      return (
                        <article
                          key={`${album.name}-${index}`}
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-cyan-400/10
                          "
                        >
                          {/* ALBUM HEADER */}
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              justify-between
                              gap-3
                              p-4
                            "
                          >
                             <div className="flex min-w-0 items-center gap-3">

                                <div
                                    className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-cyan-400/20
                                    bg-cyan-500/10
                                    text-xs
                                    font-bold
                                    text-cyan-400
                                    "
                                >
                                    {albumNumber}
                                </div>

                                <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-cyan-500/[0.08]
                                    text-cyan-600
                                    "
                                >
                                    <Album className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <h3
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-zinc-200
                                    "
                                    >
                                    {album.name}
                                    </h3>

                                    <p
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        uppercase
                                        tracking-wider
                                        text-cyan-500
                                    "
                                    >
                                    {tracks.length} tracks
                                    </p>
                                    <h3 className="text-xs">{formatDateShort(purchase.order.createdAt)}</h3>

                                </div>
                                </div>
                             </div>

                            {/*
                              Adapt these prop names if your
                              DownloadZipComponent uses a different API.
                            */}
                            
                                <DownloadZipComponent
                                id={`${purchase.order.id}-${index}`}
                                fileName={album.name ?? "album"}
                                trackIds={trackIds}
                                />
                   
                          </div>

                          {/* INDIVIDUAL TRACKS */}
                          <details
                            className="
                              group
                              border-t
                              border-white/[0.05]
                            "
                          >
                            <summary
                              className="
                                flex
                                cursor-pointer
                                list-none
                                items-center
                                justify-between
                                px-4
                                py-3
                                text-[10px]
                                font-medium
                                text-zinc-500
                                transition
                                hover:bg-white/[0.02]
                                hover:text-zinc-300
                                [&::-webkit-details-marker]:hidden
                              "
                            >
                              Download individual tracks

                              <ChevronDown
                                className="
                                  h-4
                                  w-4
                                  transition-transform
                                  group-open:rotate-180
                                "
                              />
                            </summary>

                            <div
                              className="
                                border-t
                                border-white/[0.05]
                                px-4
                              "
                            >
                              {tracks.map(
                                (track) => (
                                  <div
                                    key={track.id}
                                    className="
                                      flex
                                      items-center
                                      gap-3
                                      border-b
                                      border-white/[0.05]
                                      py-3
                                      last:border-b-0
                                    "
                                  >
                                    <Music2
                                      className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-cyan-500
                                      "
                                    />

                                    <h4
                                      className="
                                        min-w-0
                                        flex-1
                                        truncate
                                        text-xs
                                        text-zinc-300
                                      "
                                    >
                                      {track.artist} -{" "}
                                      {formatTrackTitle(
                                        track.title,
                                        track.is_explicit
                                      )}
                                    </h4>

                                    <DownloadTrackComponent
                                      id={track.id}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </details>
                        </article>
                      )
                    }
                  )
                ) : (
                  <EmptyComponent />
                )}
              </div>
            )}
        </div>

        {/* PAGINATION */}
        {!isLoading && totalItems > 0 && (
          <PaginationNewComponents
            totalItems={totalItems}
        />
        )}
      </section>
    </div>
  )
}

export default MyDownloadsComponents