import TrackItemComponent from "../common/data-item";
import { useAtom } from "jotai";
import { defaultPageLimit, filterState } from "@/state/globalState";
import { api } from "@/utils/api";
import EmptyComponent from "../common/empty";
import LoadingSkeletonComponents from "../common/loading-skeleton";
import BannerTitleComponent from "@/components/common/banner-title";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import PaginationNewComponents from "@/components/common/pagination-new";
import DataGenreComponent from "@/components/common/filter-genre";
import DataBPMComponent from "@/components/common/filter-bpm";
import DataKeyComponent from "@/components/common/filter-key";
import FilterActiveResetComponents from "@/components/common/filter-active-reset";
import SearchComponent from "@/components/common/search";
import { ProfileMeta } from "@/components/common/metadata";
import DataTagComponent from "@/components/common/filter-tag";
import { buildPlaylist } from "@/constant/helperPlaylist";
import FilterFileTypeComponent from "@/components/common/filter-file";
import TrackListHeader from "../common/track-header";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import TrackColumnFilter, { useTrackColumns } from "../common/header-filter";

const TracksComponent = () => {
  const { data: session } = useSession();
  const reduceMotion = useReducedMotion();
  const {
    visibleColumns,
    toggleColumn,
    resetColumns,
  } = useTrackColumns()
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1,
  );

  const [defaultLimit] = useAtom(defaultPageLimit);
  const [state] = useAtom(filterState);

  const [genres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [filetypes] = useQueryState(
    "filetype",
    parseAsArrayOf(parseAsStringEnum(["audio", "video"])).withDefault([]),
  );
  const [explicit, setExplicit] = useQueryState("explicit", parseAsStringEnum(["all", "clean", "dirty"]).withDefault("all"));

  const [bpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200]),
  );

  const [pager] = useQueryState("page", parseAsInteger.withDefault(1));

  const [search] = useQueryState("search", {
    defaultValue: "",
  });

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit),
  );
  const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })
  const { data: track, isLoading } = api.track.getAllMainReleases.useQuery({
    search,
    genre: genres,
    tag: tags,
    key: selectedKeys,
    bpm_start: bpm[0],
    bpm_end: bpm[1],
    skip: session?.user ? Number(Number(pager) * limit - limit) : 0,
    take: session?.user ? limit : Math.min(limit, 20),
    is_editor: false,
    is_editor_id: null,
    selectionFilter: state.selectionFilter,
    filetypes,
    explicit,
  });
  const page = Number(pager) || 1
  const total = Number(track?.count._count.id) || 0

  const start = total === 0
    ? 0
    : (page - 1) * limit + 1

  const end = Math.min(page * limit, total)
  return (
    <>
      <ProfileMeta title="New Releases" description="Collection of DJ Music" />

      <main className="min-h-screen w-full bg-[#111518] text-zinc-100">
        <div>
          {/* =====================================================
              PAGE HEADER
          ===================================================== */}
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 px-5 py-8 sm:px-8 lg:px-10">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute top-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

                <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
                  Jeff92 & Ayan Sumania Library
                </span>
              </div>

              <BannerTitleComponent
                title="Tracks"
                description="New releases of exclusive edits & remixes"
              />
            </div>
          </section>

          {/* =====================================================
              FILTER BAR
          ===================================================== */}
          <section className="mb-5 rounded-2xl border border-white/10 bg-white/2.5 p-3 sm:p-4">
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

                  <div className="shrink-0">
                    <DataBPMComponent />
                  </div>

                  <div className="shrink-0">
                    <DataKeyComponent />
                  </div>

                  <div className="shrink-0 items-center rounded-xl border border-white/10 bg-[#111518]/40 px-2 lg:flex">
                    <FilterFileTypeComponent />
                  </div>

                </div>
                {/* <div className="flex shrink-0 rounded-xl border border-white/10 bg-[#111518]/40 p-1">{(["all", "clean", "dirty"] as const).map(value => <button key={value} onClick={() => void setExplicit(value)} className={`rounded-lg px-3 py-2 text-xs capitalize ${explicit === value ? value === "dirty" ? "bg-red-500 text-white" : value === "clean" ? "bg-emerald-500 text-black" : "bg-[#B9FF00] text-black" : "text-zinc-400"}`}>{value}</button>)}</div> */}
                <TrackColumnFilter
                  visibleColumns={visibleColumns}
                  onToggle={toggleColumn}
                  onReset={resetColumns}
                />
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
                  {total === 1 ? "track" : "tracks"}
                </h3>
              </div>
            </div>
          </section>

          {/* =====================================================
              ACTIVE FILTERS
          ===================================================== */}
          <div className="mb-5">
            <FilterActiveResetComponents />
          </div>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            {/* ===================================================
                TRACK LIST
            =================================================== */}
            <section className="min-w-0 flex-1">
              {/* Track list header */}
              <TrackListHeader
                visibleColumns={visibleColumns}
              />

              {/* Track rows */}
              <div className="flex w-full flex-col gap-2">
                {isLoading &&
                  itemSkeleton.map((_, index) => (
                    <div
                      key={index}
                      className="h-[76px] w-full animate-pulse rounded-2xl border border-white/5 bg-white/2.5"
                    />
                  ))}

                {track?.count._count.id === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/2.5 p-8">
                    <EmptyComponent />
                  </div>
                )}

                {track?.tracks.map((trackItem, index) => (
                  <TrackItemComponent
                    {...trackItem}
                    key={trackItem.id}
                    index_key={index}
                    id={trackItem.id}
                    price={Number(trackItem.price)}
                    playlist={buildPlaylist(track.tracks)}
                    credits={credits?.credit ?? 0}
                    visibleColumns={visibleColumns}
                  />
                ))}
              </div>

              {/* Pagination */}
              {session?.user ? (
                <div className="mt-8 flex justify-center rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
                  <PaginationNewComponents
                    totalItems={Number(track?.count._count.id) ?? 0}
                  />
                </div>
              ) : (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="mt-8 rounded-2xl border border-[#B9FF00]/20 bg-[#171d20] px-5 py-5 text-center shadow-[0_16px_50px_rgba(0,0,0,0.28)]"
                >
                  <LockKeyhole className="mx-auto h-5 w-5 text-[#B9FF00]" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Sign in to preview and view more tracks
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Create a free account to play previews and browse every page
                    of the catalog.
                  </p>
                  <Link
                    href="/auth/login"
                    className="mt-4 inline-flex rounded-xl bg-[#B9FF00] px-5 py-2.5 text-xs font-semibold text-black"
                  >
                    Sign in or create account
                  </Link>
                </motion.div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default TracksComponent;
