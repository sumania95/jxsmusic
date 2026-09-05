import FilterActiveResetComponents from "@/components/common/filter-active-reset"
import DataBPMComponent from "@/components/common/filter-bpm"
import FilterFileTypeComponent from "@/components/common/filter-file"
import DataGenreComponent from "@/components/common/filter-genre"
import DataKeyComponent from "@/components/common/filter-key"
import DataTagComponent from "@/components/common/filter-tag"
import PaginationNewComponents from "@/components/common/pagination-new"
import SearchComponent from "@/components/common/search"
import TrackItemComponent from "@/components/pages/common/data-item"
import EmptyComponent from "@/components/pages/common/empty"
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton"
import TrackListHeader from "@/components/pages/common/track-header"
import { buildPlaylist } from "@/constant/helperPlaylist"
import { defaultPageLimit, filterState } from "@/state/globalState"
import { api } from "@/utils/api"
import { useAtom } from "jotai"
import { useSession } from "next-auth/react"
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs"
import React from "react"

interface Props {
  editor: {
    id: string
    image: string | null
    username: string | null
    is_video_uploader: boolean
    link_facebook: string | null
    link_instagram: string | null
    link_mixclound: string | null
    link_soundcloud: string | null
    link_spotify: string | null
    link_twitch: string | null
    link_twitter: string | null
    link_youtube: string | null
    biography: string | null
    _count: {
      track: number
    }
  }
}

const EditorTracksComponent = ({ editor }: Props) => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  )
const { data: session } = useSession();
  const [defaultLimit] = useAtom(defaultPageLimit)
  const [state] = useAtom(filterState)

  const [genres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [selectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [bpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200])
  )

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

  const [filetypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum(["audio", "video"])
    ).withDefault([])
  )
const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })
  const { data: track, isLoading } =
    api.track.getAllMainReleases.useQuery({
      search,
      genre: genres,
      tag: tags,
      key: selectedKeys,
      bpm_start: bpm[0],
      bpm_end: bpm[1],
      skip: Number(Number(pager) * limit - limit),
      take: limit,
      is_editor: false,
      is_editor_id: String(editor.id),
      selectionFilter: state.selectionFilter,
      filetypes,
    })

  return (
    <div className="w-full">
      {/* =====================================================
          FILTER PANEL
      ===================================================== */}
      <div
        className="
          relative
          mb-3
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-white/[0.02]
          p-3
        "
      >
        {/* Ambient accent */}
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
          {/* Filter label */}
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
              Filter Tracks
            </span>
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-2">
            <div
              className="
                flex
                w-full
                flex-col
                gap-2
                lg:flex-row
                lg:items-center
              "
            >
              <div className="w-full lg:w-32">
                <DataGenreComponent />
              </div>

              <div className="w-full lg:w-32">
                <DataTagComponent />
              </div>

              <div className="w-full lg:w-32">
                <DataBPMComponent />
              </div>

              <div className="w-full lg:w-32">
                <DataKeyComponent />
              </div>

              {editor.is_video_uploader && (
                <div
                  className="
                    hidden
                    w-full
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/10
                    bg-[#111518]/30
                    p-2.5
                    lg:flex
                    lg:w-52
                  "
                >
                  <FilterFileTypeComponent />
                </div>
              )}

              {/* Desktop search */}
              <div className="hidden min-w-0 flex-1 lg:flex">
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
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH
      ===================================================== */}
      <div
        className="
          mb-3
          flex
          w-full
          flex-col
          gap-1
          lg:hidden
        "
      >
        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-widest
            text-zinc-700
          "
        >
          Search Tracks
        </span>

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
          "
          placeholder="Search title, artist...."
        />
      </div>

      {/* =====================================================
          ACTIVE FILTERS
      ===================================================== */}
      <div className="mb-4">
        <FilterActiveResetComponents />
      </div>

      {/* =====================================================
          TRACK LIST HEADER
      ===================================================== */}
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          border-b
          border-white/5
          pb-2
        "
      >
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

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-zinc-600
            "
          >
            Releases
          </span>
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
          {track?.count?._count.id ?? 0} Tracks
        </span>
      </div>
{/* Track list header */}
                  <TrackListHeader />
      {/* =====================================================
          MAIN TRACK LIST
      ===================================================== */}
      <div className="w-full">
        <div className="flex w-full flex-col gap-1">
          {/* Loading */}
          {isLoading &&
            itemSkeleton.map((_, index) => (
              <LoadingSkeletonComponents
                key={index}
                className="
                  h-16
                  w-full
                  rounded-xl
                  border
                  border-white/5
                  bg-white/[0.02]
                "
              />
            ))}

          {/* Empty */}
          {!isLoading &&
            track?.count._count.id === 0 && (
              <div
                className="
                  rounded-xl
                  border
                  border-white/5
                  bg-white/[0.015]
                  py-10
                "
              >
                <EmptyComponent />
              </div>
            )}

          {/* Tracks */}
          {!isLoading &&
            track?.tracks.map((trackItem, index) => (
              <TrackItemComponent
                {...trackItem}
                key={trackItem.id}
                index_key={index}
                id={trackItem.id}
                price={Number(trackItem.price)}
                playlist={buildPlaylist(track.tracks)}
                credits={credits?.credit ?? 0}
              />
            ))}
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}
        <div className="mt-5">
          <PaginationNewComponents
            totalItems={Number(track?.count._count.id) ?? 0}
          />
        </div>
      </div>
    </div>
  )
}

export default EditorTracksComponent