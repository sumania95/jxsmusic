"use client"

import React, { useMemo } from "react"
import {
  ArrowDownToLine,
  Flame,
  Headphones,
  Loader2,
  Music2,
  Sparkles,
} from "lucide-react"
import { useQueryState } from "nuqs"

import BannerTitleComponent from "@/components/common/banner-title"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { api } from "@/utils/api"
import TrackItemComponent from "../common/data-item"
import TrackListHeader from "../common/track-header"
import { useSession } from "next-auth/react"
import { useTrackColumns } from "../common/header-filter"

// Change this path to the real location of your component.

const chartTypes = [
  {
    value: "trending",
    label: "Trending",
    description: "Popular across downloads and previews",
    icon: Flame,
  },
  {
    value: "downloads",
    label: "Downloads",
    description: "The most downloaded DJ edits",
    icon: ArrowDownToLine,
  },
  {
    value: "previews",
    label: "Previewed",
    description: "The most listened-to releases",
    icon: Headphones,
  },
  {
    value: "new",
    label: "New & Hot",
    description: "The latest published tracks",
    icon: Sparkles,
  },
] as const

type ChartType = (typeof chartTypes)[number]["value"]

const isChartType = (value: string): value is ChartType => {
  return chartTypes.some((chart) => chart.value === value)
}

const ChartsComponent = () => {
  const {
            visibleColumns,
            toggleColumn,
            resetColumns,
          } = useTrackColumns()
  const [chartParam, setChartParam] = useQueryState("chart", {
    defaultValue: "trending",
  })
const { data: session } = useSession();
  const chart: ChartType = isChartType(chartParam)
    ? chartParam
    : "trending"

  const selectedChart =
    chartTypes.find((item) => item.value === chart) ??
    chartTypes[0]
const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })
  const tracksQuery = api.chart.tracks.useQuery(
    {
      chart,
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    },
  )

  const tracks = tracksQuery.data ?? []

  /*
   * TrackItemComponent sends this list to the global audio player.
   * The same playlist is reused by every chart row.
   */
  const chartPlaylist = useMemo(
    () =>
      tracks
        .filter(
          (
            track,
          ): track is typeof track & {
            title: string
            artist: string
            preview_key: string
          } =>
            Boolean(
              track.title &&
                track.artist &&
                track.preview_key,
            ),
        )
        .map((track, index) => ({
          id: track.id,
          index,
          title: track.title,
          artist: track.artist,
          islink: track.preview_key,
          key: track.preview_key,
          bucketName: "jxs-music",
          isFull: false,
        })),
    [tracks],
  )

  const handleChartChange = (value: string) => {
    if (isChartType(value)) {
      void setChartParam(value)
    }
  }

  const SelectedChartIcon = selectedChart.icon

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:rounded-3xl sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute right-[-120px] top-[-180px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.04] blur-[100px]" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Jeff92 & Ayan Sumania Charts
            </span>
          </div>

          <BannerTitleComponent
            title="Top DJ Tracks"
            description="Discover the edits DJs are downloading, previewing, and playing right now."
          />
        </div>
      </section>

      {/* Chart navigation */}
      {/* Mobile chart navigation */}
<div
  className="
    -mx-4
    overflow-x-auto
    px-4
    pb-2
    lg:hidden
    [-webkit-overflow-scrolling:touch]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
>
  <div className="flex w-max min-w-full gap-2">
    {chartTypes.map((item) => {
      const Icon = item.icon
      const isActive = chart === item.value

      return (
        <button
          key={item.value}
          type="button"
          aria-pressed={isActive}
          onClick={() => handleChartChange(item.value)}
          className={`
            flex
            min-h-11
            shrink-0
            touch-manipulation
            items-center
            justify-center
            gap-2
            whitespace-nowrap
            rounded-xl
            border
            px-4
            py-2.5
            text-[10px]
            font-medium
            uppercase
            tracking-wider
            transition-colors
            duration-200
            [-webkit-tap-highlight-color:transparent]

            ${
              isActive
                ? `
                    border-[#B9FF00]/20
                    bg-[#B9FF00]/10
                    text-[#B9FF00]
                  `
                : `
                    border-white/10
                    bg-[#111518]/40
                    text-zinc-500
                    active:bg-white/[0.05]
                    active:text-zinc-300
                  `
            }
          `}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span>{item.label}</span>
        </button>
      )
    })}
  </div>
</div>

{/* Desktop chart navigation */}
<Tabs
  value={chart}
  onValueChange={handleChartChange}
  className="hidden w-full lg:block"
>
  <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-[#111518]/40 p-1">
    {chartTypes.map((item) => {
      const Icon = item.icon

      return (
        <TabsTrigger
          key={item.value}
          value={item.value}
          className="
            flex
            min-h-12
            min-w-0
            items-center
            justify-center
            gap-2
            rounded-xl
            px-3
            py-3
            text-[10px]
            font-medium
            uppercase
            tracking-wider
            text-zinc-600
            transition-colors
            hover:text-zinc-300
            data-[state=active]:bg-white/[0.06]
            data-[state=active]:text-[#B9FF00]
            data-[state=active]:shadow-none
          "
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </TabsTrigger>
      )
    })}
  </TabsList>
</Tabs>

      {/* Main chart layout */}
<div className="mt-8 flex w-full flex-col gap-6 xl:flex-row xl:items-start">
  {/* Tracks column */}
  <main className="min-w-0 flex-1">
    {/* Selected chart information */}
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <SelectedChartIcon className="h-4 w-4 text-[#B9FF00]" />

          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            {selectedChart.label}
          </h2>
        </div>

        <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
          {selectedChart.description}
        </p>
      </div>

      {!tracksQuery.isLoading && (
        <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-700">
          Top {tracks.length}
        </span>
      )}
    </div>

    {/* Desktop headings */}
    {tracks.length > 0 && (
      <TrackListHeader 
        visibleColumns={visibleColumns}
      />

    )}

    {/* Initial loading */}
    {tracksQuery.isLoading && (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#B9FF00]" />

          <span className="text-xs text-zinc-600">
            Loading chart…
          </span>
        </div>
      </div>
    )}

    {/* Error */}
    {tracksQuery.isError && (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.025] px-5 text-center">
        <Music2 className="mb-4 h-6 w-6 text-red-400" />

        <h3 className="text-sm font-medium text-white">
          Unable to load this chart
        </h3>

        <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
          The tracks could not be loaded. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void tracksQuery.refetch()}
          className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-[#B9FF00]/20 hover:text-[#B9FF00]"
        >
          Try again
        </button>
      </div>
    )}

    {/* Empty */}
    {tracksQuery.isSuccess && tracks.length === 0 && (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 text-center">
        <Music2 className="mb-4 h-6 w-6 text-zinc-700" />

        <h3 className="text-sm font-medium text-white">
          No chart tracks yet
        </h3>

        <p className="mt-2 text-xs text-zinc-600">
          Published and reviewed tracks will appear here.
        </p>
      </div>
    )}

    {/* Track rows */}
    {tracksQuery.isSuccess && tracks.length > 0 && (
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackItemComponent
            key={track.id}
            index_key={index}
            id={track.id}
            title={track.title}
            artist={track.artist}
            in_key={track.in_key}
            energy={track.energy}
            filetype={track.filetype}
            preview_key={track.preview_key}
            bpm_start={track.bpm_start}
            bpm_end={track.bpm_end}
            price={track.price}
            is_explicit={track.is_explicit}
            release_year={track.release_year}
            genre_track={track.genre_track}
            tag_track={track.tag_track}
            user={track.user}
            duration={track.duration}
            releaseAt={track.releaseAt}
            playlist={chartPlaylist}
            credits={credits?.credit ?? 0}
            visibleColumns={visibleColumns}
          />
        ))}
      </div>
    )}

    {/* Background refresh */}
    {tracksQuery.isFetching && !tracksQuery.isLoading && (
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-zinc-700">
        <Loader2 className="h-3 w-3 animate-spin" />
        Updating chart
      </div>
    )}
  </main>

  {/* Rankings sidebar */}
</div>
    </div>
  )
}

export default ChartsComponent
