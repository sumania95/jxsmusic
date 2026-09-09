import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { formatTrackTitle } from "@/lib/utils";
import { useState } from "react";
import DataGenreComponent from "@/components/common/filter-genre";
import DataTagComponent from "@/components/common/filter-tag";
import DataBPMComponent from "@/components/common/filter-bpm";
import DataKeyComponent from "@/components/common/filter-key";
import SearchComponent from "@/components/common/search";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState
} from "nuqs";
import PaginationNewFixedLimitComponents from "@/components/common/pagination-new-fixed-limit";
import FilterActiveResetComponents from "@/components/common/filter-active-reset";
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  CirclePlus,
  Music2,
  Trash2,
  X,
} from "lucide-react";
import FilterFileTypeComponent from "@/components/common/filter-file";
import DataYearComponent from "@/components/common/filter-year";
import DataEnergyComponent from "@/components/common/filter-energy";
import ImageThumbnailComponent from "@/components/common/image-thumbnail";


type TrackItem = {
  trackId: string;
  title: string;
  artist: string;
  is_explicit: boolean;
};


export default function AlbumTrackSelector({
  value,
  onChange,
  error,
  disabled,
}: {
  value: TrackItem[];
  onChange: (tracks: TrackItem[]) => void;
  error?: string;
  disabled?: boolean;
}) {
  const itemSkeleton: number[] =
    Array.from(
      { length: 10 },
      (_, index) => index + 1
    );
  const CURRENT_YEAR = new Date().getFullYear();
  const MINIMUM_YEAR = 1950;
  const [defaultLimit] =
    useState(10);
  const [filetypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum(["audio", "video"]),
    ).withDefault([]),
  );

  const [explicit] = useQueryState(
    "explicit",
    parseAsStringEnum([
      "all",
      "clean",
      "dirty",
    ]).withDefault("all"),
  );
  const [genres] =
    useQueryState(
      "genres",
      parseAsArrayOf(
        parseAsString
      ).withDefault([])
    );

  const [tags] =
    useQueryState(
      "tags",
      parseAsArrayOf(
        parseAsString
      ).withDefault([])
    );

  const [selectedKeys] =
    useQueryState(
      "key",
      parseAsArrayOf(
        parseAsString
      ).withDefault([])
    );

  const [bpm] =
    useQueryState(
      "bpm",
      parseAsArrayOf(
        parseAsInteger
      ).withDefault([0, 200])
    );

  const [pager] =
    useQueryState(
      "page",
      parseAsInteger.withDefault(1)
    );

  const [search] =
    useQueryState(
      "search",
      {
        defaultValue: ""
      }
    );

  const [limit] =
    useQueryState(
      "limit",
      parseAsInteger.withDefault(
        defaultLimit
      )
    );
  const [selectedEnergy] = useQueryState(
    "energy",
    parseAsArrayOf(parseAsInteger).withDefault([]),
  );

  const [yearFrom] = useQueryState(
    "yearFrom",
    parseAsInteger.withDefault(MINIMUM_YEAR),
  );

  const [yearTo] = useQueryState(
    "yearTo",
    parseAsInteger.withDefault(CURRENT_YEAR),
  );
  const [
    hideAlbumTracks,
    setHideAlbumTracks
  ] = useState(false);

  const energy =
    selectedEnergy.length > 0
      ? selectedEnergy
      : undefined;

  const hasCustomYearRange =
    yearFrom !== MINIMUM_YEAR ||
    yearTo !== CURRENT_YEAR;
  const {
    data: tracks,
    isLoading
  } =
    api.album.getReleasedTrack.useQuery({
      search,
      genre: genres,
      tag: tags,
      key: selectedKeys,
      bpm_start: bpm[0],
      bpm_end: bpm[1],
      skip:
        Number(
          Number(pager) * limit - limit
        ),
      take: limit,
      hideAlbumTracks,
      filetypes,
      explicit,

      energy,

      year_start: hasCustomYearRange
        ? yearFrom
        : undefined,

      year_end: hasCustomYearRange
        ? yearTo
        : undefined,
    });


  const addTrack = (
    track: TrackItem
  ) => {
    if (
      value.some(
        (t) =>
          t.trackId === track.trackId
      )
    ) return;

    onChange([
      ...value,
      track
    ]);
  };


  const removeTrack = (
    id: string
  ) => {
    onChange(
      value.filter(
        (t) =>
          t.trackId !== id
      )
    );
  };
 const formatSizeMB = (bytes: number | null | undefined) => {
    if (bytes == null) return "Unknown size"

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[720px] w-full overflow-hidden rounded-2xl"
    >
      <ResizablePanel
        defaultSize={70}
        minSize={50}
        className="pr-2"
      >
        {/* =====================================================
          AVAILABLE TRACKS
      ===================================================== */}
        <section
          className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute right-[-100px] top-[-130px] h-64 w-64 rounded-full bg-[#B9FF00]/[0.025] blur-[90px]"
          />


          {/* HEADER */}
          <div
            className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.7)]"
                />

                <h3
                  className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200"
                >
                  Available Tracks
                </h3>
              </div>

              <p
                className="mt-1 text-[9px] uppercase tracking-[0.13em] text-zinc-600"
              >
                Browse and add released tracks
              </p>
            </div>


            <span
              className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-zinc-500"
            >
              {tracks?.count._count.id ?? 0}
            </span>
          </div>


          {/* HIDE ALBUM TRACKS */}
          <div
            className="relative flex items-center gap-3 border-b border-white/[0.06] px-4 py-3"
          >
            <Checkbox
              id="hide-album-tracks"
              checked={
                hideAlbumTracks
              }
              onCheckedChange={(
                checked
              ) =>
                setHideAlbumTracks(
                  checked === true
                )
              }
              className="border-white/20 data-[state=checked]:border-[#B9FF00] data-[state=checked]:bg-[#B9FF00] data-[state=checked]:text-black"
            />

            <Label
              htmlFor="hide-album-tracks"
              className="cursor-pointer text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500"
            >
              Hide tracks already in albums
            </Label>
          </div>


          <div
            className="relative space-y-3 p-3"
          >
            {/* =================================================
              FILTERS
          ================================================= */}
            <div className="scrollbar-hide flex lg:justify-between w-full gap-2 overflow-x-auto pb-1">
              <div className="flex gap-2 items-center">
                <div className="shrink-0">
                  <DataGenreComponent />
                </div>

                <div className="shrink-0">
                  <DataTagComponent />
                </div>

                <div className="shrink-0">
                  <DataBPMComponent />
                </div>

                <div className="shrink-0">
                  <DataKeyComponent />
                </div>
                <div className="shrink-0">
                  <DataEnergyComponent />
                </div>
                <div className="shrink-0">
                  <DataYearComponent />
                </div>
                <div className="shrink-0 items-center rounded-xl border border-white/10 bg-[#111518]/40 px-2 lg:flex">
                  <FilterFileTypeComponent />
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


            <FilterActiveResetComponents />


            {/* =================================================
              TRACK LIST
          ================================================= */}
            <div
              className="space-y-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800"
            >
              {isLoading &&
                itemSkeleton.map(
                  (_, index) => (
                    <LoadingSkeletonComponents
                      key={index}
                      className="h-[44px] w-full rounded-xl"
                    />
                  )
                )
              }


              {tracks?.tracks.map(
                (t) => {
                  const alreadyAdded =
                    value.some(
                      (v) =>
                        v.trackId === t.id
                    );

                  return (
                    <div
                      key={t.id}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2 transition-all hover:border-[#B9FF00]/15 hover:bg-white/[0.025]"
                    >
                      <div
                        className="flex min-w-0 items-center gap-3"
                      >
                        <div
          className="
            hidden h-10 w-10 shrink-0 overflow-hidden
            border border-white/10 bg-white/[0.04] md:block
          "
        >
          <ImageThumbnailComponent
            image={String("")}
            rounded={false}
          />
        </div>

                        <div className="min-w-0">
                          <p
                            className="mt-0.5 truncate text-xs text-zinc-300"
                          >
                            {formatTrackTitle(
                              t.title,
                              t.is_explicit
                            )}
                          </p>
                          <p
                            className="truncate text-xs font-semibold text-zinc-400"
                          >
                            {t.artist}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-zinc-500">
                              <span
                                className={`
                                  rounded-full border px-2 py-1
                                  text-[9px] font-semibold uppercase tracking-wider
                                  ${t.filetype?.toLowerCase().includes("video")
                                    ? "border-pink-400/20 bg-pink-400/10 text-pink-300"
                                    : "border-[#B9FF00]/20 bg-[#B9FF00]/10 text-yellow-100"
                                  }
                                `}
                              >
                                {t.filetype?.toLowerCase().includes("video") ? "Video" : "Audio"}
                              </span>

                              <span>{t.bpm_start} BPM</span>
                              <span aria-hidden="true">•</span>
                              <span>{t.in_key ?? "Unknown key"}</span>
                              <span aria-hidden="true">•</span>
                              <span>{t.filetype ?? "Unknown file type"}</span>
                              <span aria-hidden="true">•</span>
                              <span>{formatSizeMB(t.size)}</span>
                          </div>

                        </div>
                      </div>


                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          alreadyAdded ??
                          disabled
                        }
                        onClick={() =>
                          addTrack({
                            trackId:
                              t.id,

                            title:
                              String(
                                t.title
                              ),

                            artist:
                              String(
                                t.artist
                              ),

                            is_explicit:
                              t.is_explicit,
                          })
                        }
                        className="h-8 shrink-0 gap-1.5 rounded-lg border border-[#B9FF00]/15 bg-[#B9FF00]/[0.06] px-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#B9FF00] shadow-none hover:bg-[#B9FF00] hover:text-black disabled:border-white/[0.04] disabled:bg-white/[0.02] disabled:text-zinc-700"
                      >
                        <CirclePlus className="h-3 w-3" />

                        {alreadyAdded
                          ? "Added"
                          : "Add"
                        }
                      </Button>
                    </div>
                  );
                }
              )}
            </div>


            {/* PAGINATION */}
            <div
              className="border-t border-white/[0.06] pt-3"
            >
              <PaginationNewFixedLimitComponents
                defaultLimit={
                  defaultLimit
                }
                totalItems={
                  Number(
                    tracks?.count._count.id
                  ) ?? 0
                }
              />
            </div>
          </div>
        </section>

      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="w-1 border-0 bg-transparent after:absolute after:inset-y-4 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-white/10 hover:after:bg-[#B9FF00]/40 focus-visible:ring-[#B9FF00]/50"
      />

      <ResizablePanel
        defaultSize={30}
        minSize={30}
        className="pl-2"
      >


        {/* =====================================================
          ALBUM TRACKS
      ===================================================== */}
        <section
          className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute left-[-100px] top-[-130px] h-64 w-64 rounded-full bg-[#B9FF00]/[0.02] blur-[90px]"
          />


          {/* HEADER */}
          <div
            className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.7)]"
                />

                <h3
                  className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200"
                >
                  Album Tracks
                </h3>
              </div>

              <p
                className="mt-1 text-[9px] uppercase tracking-[0.13em] text-zinc-600"
              >
                Tracks included in this multipack
              </p>
            </div>


            <div className="flex items-center gap-2">
              {error && (
                <span
                  className="hidden max-w-56 truncate text-[9px] text-red-400 sm:block"
                >
                  {error}
                </span>
              )}

              <span className={`rounded-full border px-3 py-1 text-[10px] font-medium ${value.length >= 10 && value.length <= 150 ? "border-[#B9FF00]/15 bg-[#B9FF00]/[0.05] text-[#B9FF00]" : "border-white/[0.07] bg-white/[0.025] text-zinc-500"}`}>
                {value.length}/150
              </span>
            </div>
          </div>


          {/* ERROR */}
          {error && (
            <div
              className="border-b border-red-500/10 bg-red-500/[0.025] px-4 py-2 sm:hidden"
            >
              <p className="text-[9px] text-red-400">
                {error}
              </p>
            </div>
          )}


          {/* SELECTED TRACKS */}
          <div
            className="relative min-h-[610px] max-h-[610px] space-y-1.5 overflow-y-auto p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800"
          >
            {value.length === 0 && (
              <div
                className="flex h-full min-h-[560px] items-center justify-center"
              >
                <div
                  className="flex flex-col items-center justify-center text-center"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-700"
                  >
                    <Music2 className="h-5 w-5" />
                  </div>

                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-600"
                  >
                    No tracks added
                  </p>

                  <p
                    className="mt-1 text-[9px] text-zinc-700"
                  >
                    Select tracks from the available list
                  </p>
                </div>
              </div>
            )}


            {value.map(
              (t, i) => (
                <div
                  key={t.trackId}
                  className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2 transition-all hover:border-red-500/10 hover:bg-white/[0.025]"
                >
                  <div
                    className="flex min-w-0 items-center gap-3"
                  >
                    {/* NUMBER */}
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-[9px] font-semibold text-zinc-600"
                    >
                      {i + 1}
                    </div>


                    {/* INFO */}
                    <div className="min-w-0">
                      <p
                        className="mt-0.5 truncate text-xs text-zinc-300"
                      >
                        {formatTrackTitle(
                          t.title,
                          t.is_explicit
                        )}
                      </p>
                      <p
                        className="truncate text-xs font-semibold text-zinc-400"
                      >
                        {t.artist}
                      </p>


                    </div>
                  </div>


                  {/* REMOVE */}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={
                      disabled
                    }
                    onClick={() =>
                      removeTrack(
                        t.trackId
                      )
                    }
                    className="h-8 shrink-0 gap-1.5 rounded-lg border border-red-500/10 bg-red-500/[0.04] px-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-red-400 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            )}
          </div>
        </section>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}