import { useState } from "react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

import { api } from "@/utils/api"
import { formatDateShort, formatTrackTitle } from "@/lib/utils"
import DownloadTrackComponent from "@/components/common/download"
import { DownloadZipComponent } from "@/components/common/download-zip"
import PaginationNewComponents from "@/components/common/pagination-new"
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton"
import EmptyComponent from "@/components/pages/common/empty"
import FilterActiveResetComponents from "@/components/common/filter-active-reset"

import { DownloadsSearchFilter } from "./downloads-search-filter"

const MAX_TRACK_ZIP_SIZE_BYTES = 1024 * 1024 * 1024

type SelectedTrack = {
  id: string
  size: number
}

const formatSizeMB = (bytes: number | null | undefined) => {
  if (bytes == null) {
    return "Unknown size"
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export const PaidTracks = () => {
  const defaultLimit = 20
  const currentYear = new Date().getFullYear()
  const minimumYear = 1950

  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([])
  const [selectionError, setSelectionError] = useState("")

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

  const [filetypes] = useQueryState(
    "filetype",
    parseAsArrayOf(parseAsStringEnum(["audio", "video"])).withDefault([])
  )

  const [explicit] = useQueryState(
    "explicit",
    parseAsStringEnum(["all", "clean", "dirty"]).withDefault("all")
  )

  const [bpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200])
  )

  const [selectedEnergy] = useQueryState(
    "energy",
    parseAsArrayOf(parseAsInteger).withDefault([])
  )

  const [yearFrom] = useQueryState(
    "yearFrom",
    parseAsInteger.withDefault(minimumYear)
  )

  const [yearTo] = useQueryState(
    "yearTo",
    parseAsInteger.withDefault(currentYear)
  )

  const safeSort: "asc" | "desc" = sort === "asc" ? "asc" : "desc"
  const skip = Number(pager) * limit - limit
  const energy = selectedEnergy.length > 0 ? selectedEnergy : undefined
  const hasCustomYearRange = yearFrom !== minimumYear || yearTo !== currentYear

  const paidTracks = api.downloads.getPaidTracks.useQuery({
    search,
    skip,
    take: limit,
    genre: genres,
    tag: tags,
    key: selectedKeys,
    bpm_start: bpm[0],
    bpm_end: bpm[1],
    filetypes,
    explicit,
    energy,
    year_start: hasCustomYearRange ? yearFrom : undefined,
    year_end: hasCustomYearRange ? yearTo : undefined,
    sort: safeSort,
  })

  const purchases = paidTracks.data?.purchases ?? []

  const visibleTracks = purchases.flatMap(({ track }) =>
    track
      ? [{ id: track.id, size: track.size }]
      : []
  )

  const selectedTrackIds = selectedTracks.map(({ id }) => id)

  const selectedSizeBytes = selectedTracks.reduce(
    (total, track) => total + track.size,
    0
  )

  const allVisibleTracksSelected =
    visibleTracks.length > 0 &&
    visibleTracks.every(({ id }) => selectedTrackIds.includes(id))

  const toggleTrack = (track: SelectedTrack) => {
    if (selectedTrackIds.includes(track.id)) {
      setSelectedTracks((current) =>
        current.filter(({ id }) => id !== track.id)
      )
      setSelectionError("")
      return
    }

    if (selectedSizeBytes + track.size > MAX_TRACK_ZIP_SIZE_BYTES) {
      setSelectionError("The selected tracks cannot exceed 1 GB.")
      return
    }

    setSelectedTracks((current) => [...current, track])
    setSelectionError("")
  }

  const toggleAllVisibleTracks = () => {
    if (allVisibleTracksSelected) {
      const visibleIds = new Set(visibleTracks.map(({ id }) => id))

      setSelectedTracks((current) =>
        current.filter(({ id }) => !visibleIds.has(id))
      )
      setSelectionError("")
      return
    }

    const next = [...selectedTracks]
    const selectedIds = new Set(selectedTrackIds)
    let totalSize = selectedSizeBytes
    let skippedTrack = false

    for (const track of visibleTracks) {
      if (selectedIds.has(track.id)) {
        continue
      }

      if (totalSize + track.size > MAX_TRACK_ZIP_SIZE_BYTES) {
        skippedTrack = true
        continue
      }

      next.push(track)
      selectedIds.add(track.id)
      totalSize += track.size
    }

    setSelectedTracks(next)
    setSelectionError(
      skippedTrack
        ? "Some tracks were skipped because the ZIP limit is 1 GB."
        : ""
    )
  }

  const clearSelection = () => {
    setSelectedTracks([])
    setSelectionError("")
  }

  return (
    <>
      <div className="flex flex-col">
        <DownloadsSearchFilter />

        <div className="mb-5">
          <FilterActiveResetComponents />
        </div>

        <div className="my-2 flex flex-col gap-3 rounded-xl border border-[#B9FF00]/15 bg-[#B9FF00]/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-xs font-medium text-zinc-300">
            <input
              type="checkbox"
              checked={allVisibleTracksSelected}
              onChange={toggleAllVisibleTracks}
              className="size-4 rounded border-white/20 bg-[#111518] accent-[#B9FF00]"
            />
            Select all tracks on this page
          </label>

          {selectedTrackIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Clear ({selectedTrackIds.length})
              </button>

              <DownloadZipComponent
                id="selected-paid-tracks"
                fileName="jxsmusic-selected-tracks"
                trackIds={selectedTrackIds}
                source="track"
              />
            </div>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-wider">
          <span className="text-zinc-500">
            Selected: {formatSizeMB(selectedSizeBytes)} / 1024.00 MB
          </span>

          {selectionError && (
            <span role="alert" className="text-red-400">
              {selectionError}
            </span>
          )}
        </div>

        {paidTracks.isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: defaultLimit }).map((_, index) => (
              <LoadingSkeletonComponents
                key={index}
                className="h-16 w-full rounded-xl"
              />
            ))}
          </div>
        )}

        {!paidTracks.isLoading && !purchases.length && <EmptyComponent />}

        {!paidTracks.isLoading && purchases.map((purchase, index) => {
          const track = purchase.track

          if (!track) {
            return null
          }

          const isVideo = track.filetype
            ?.toLowerCase()
            .includes("video")

          return (
            <div
              key={`${track.id}-${index}`}
              className="flex w-full items-center gap-3 border-b border-white/[0.05] px-3 py-3 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedTrackIds.includes(track.id)}
                onChange={() =>
                  toggleTrack({ id: track.id, size: track.size })
                }
                aria-label={`Select ${track.artist} - ${track.title}`}
                className="size-4 shrink-0 rounded border-white/20 bg-[#111518] accent-[#B9FF00]"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-md font-medium text-zinc-300">
                  {formatTrackTitle(track.title, track.is_explicit)}
                </h3>

                <p className="mt-0.5 truncate text-xs text-zinc-400">
                  {track.artist ?? "Unknown artist"}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-zinc-500">
                  <span className={`rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${isVideo ? "border-pink-400/20 bg-pink-400/10 text-pink-300" : "border-[#B9FF00]/20 bg-[#B9FF00]/10 text-yellow-100"}`}>
                    {isVideo ? "Video" : "Audio"}
                  </span>
                  <span>{track.bpm_start} BPM</span>
                  <span aria-hidden="true">•</span>
                  <span>{track.in_key ?? "Unknown key"}</span>
                  <span aria-hidden="true">•</span>
                  <span>{track.filetype ?? "Unknown file type"}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatSizeMB(track.size)}</span>
                </div>

                <p className="mt-1 text-[9px] uppercase tracking-wider text-zinc-400">
                  {purchase.order.checkoutId}
                </p>

                <h3 className="text-xs">
                  {formatDateShort(purchase.order.createdAt)}
                </h3>
              </div>

              <DownloadTrackComponent id={track.id} />
            </div>
          )
        })}
      </div>

      {(paidTracks.data?.count ?? 0) > 0 && (
        <PaginationNewComponents totalItems={paidTracks.data?.count ?? 0} />
      )}
    </>
  )
}