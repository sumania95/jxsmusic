import React from "react";
import EmptyComponent from "../../../common/empty";
import { useAtom } from "jotai";
import { defaultPageLimit } from "@/state/globalState";
import { api } from "@/utils/api";
import DataItemUploadTrackSkeletonComponents from "./data-item-track-skeleton";
import FilterActiveResetComponents from "@/components/common/filter-active-reset";
import SearchComponent from "@/components/common/search";
import DataKeyComponent from "@/components/common/filter-key";
import DataBPMComponent from "@/components/common/filter-bpm";
import DataGenreComponent from "@/components/common/filter-genre";
import PaginationNewComponents from "@/components/common/pagination-new";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { ProfileMeta } from "@/components/common/metadata";
import TrackItemComponent from "@/components/pages/common/data-item";
import { buildPlaylist } from "@/constant/helperPlaylist";
import DataTagComponent from "@/components/common/filter-tag";
import TrackListHeader from "@/components/pages/common/track-header";
import { useSession } from "next-auth/react";
import { useReducedMotion } from "framer-motion";
import TrackColumnFilter, { useTrackColumns } from "@/components/pages/common/header-filter";
import FilterFileTypeComponent from "@/components/common/filter-file";
import DataYearComponent from "@/components/common/filter-year";
import DataEnergyComponent from "@/components/common/filter-energy";


type TrackSortKey =
  | "track"
  | "key"
  | "bpm"
  | "energy"
  | "release_year"
  | "price";

type TrackSortOrder = "asc" | "desc";

const SORTABLE_COLUMNS: TrackSortKey[] = [
  "track",
  "key",
  "bpm",
  "energy",
  "release_year",
  "price",
];

const SORT_ORDERS: TrackSortOrder[] = [
  "asc",
  "desc",
];


const PublishedComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );
  const { data: session } = useSession();
  const reduceMotion = useReducedMotion();
  const {
    visibleColumns,
    toggleColumn,
    resetColumns,
  } = useTrackColumns()

  const CURRENT_YEAR = new Date().getFullYear();
  const MINIMUM_YEAR = 1950;
  const [defaultLimit] = useAtom(defaultPageLimit);

  const [genres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [selectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [bpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200])
  );

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const [search] = useQueryState("search", {
    defaultValue: "",
  });

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
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

  /*
   * Sorting starts blank.
   * The table header writes these values when clicked.
   */
  const [sort] = useQueryState(
    "sort",
    parseAsStringEnum<TrackSortKey>(
      SORTABLE_COLUMNS,
    ),
  );

  const [sortOrder] = useQueryState(
    "order",
    parseAsStringEnum<TrackSortOrder>(
      SORT_ORDERS,
    ),
  );

  const energy =
    selectedEnergy.length > 0
      ? selectedEnergy
      : undefined;

  const hasCustomYearRange =
    yearFrom !== MINIMUM_YEAR ||
    yearTo !== CURRENT_YEAR;
  const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })
  const { data: track, isLoading } =
    api.track.getAllReleases.useQuery({
      search,
      genre: genres,
      tag: tags,
      key: selectedKeys,
      bpm_start: bpm[0],
      bpm_end: bpm[1],
      skip: Number(Number(pager) * limit - limit),
      take: limit,
      is_editor: false,
      energy,

      year_start: hasCustomYearRange
        ? yearFrom
        : undefined,

      year_end: hasCustomYearRange
        ? yearTo
        : undefined,

      /*
       * Sorting is omitted until a column is clicked.
       */
      sort: sort ?? undefined,

      sort_order: sort
        ? (sortOrder ?? "asc")
        : undefined,
    }, {
      placeholderData: (previousData) =>
        previousData,
    },);
  const page = Number(pager) || 1;
  const total =
    Number(track?.count._count.id) || 0;

  const start =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );
  return (
    <div className="flex w-full flex-col gap-5">
      <ProfileMeta
        title="Published Tracks"
        description="Collection of DJ Music"
      />

      {/* Filters */}
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
            {/* <div className="flex shrink-0 rounded-xl border border-white/10 bg-[#111518]/40 p-1">{(["all", "clean", "dirty"] as const).map(value => <button key={value} onClick={() => void setExplicit(value)} className={`rounded-lg px-3 py-2 text-xs capitalize ${explicit === value ? value === "dirty" ? "bg-red-500 text-white" : value === "clean" ? "bg-emerald-500 text-black" : "bg-[#B9FF00] text-black" : "text-zinc-400"}`}>{value}</button>)}</div> */}
            <div className="hidden lg:flex">
              <TrackColumnFilter
                visibleColumns={visibleColumns}
                onToggle={toggleColumn}
                onReset={resetColumns}
              />
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
              {total === 1 ? "track" : "tracks"}
            </h3>
          </div>
        </div>
      </section>
      {/* =====================================================
          ACTIVE FILTERS
      ===================================================== */}
      <div>
        <FilterActiveResetComponents />
      </div>
      {/* Track list header */}
      <div className="flex w-full flex-col gap-5 -mt-5">

        <TrackListHeader
          visibleColumns={visibleColumns}
        />
        {/* Track list */}
        <section className="flex flex-col gap-2 -mt-5">
          {isLoading &&
            itemSkeleton.map((_, index) => (
              <div
                key={index}
                className="h-[76px] w-full animate-pulse rounded-2xl border border-white/5 bg-white/2.5"
              />
            ))}

          {!isLoading && track?.count._count.id === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
              <EmptyComponent />
            </div>
          )}

          {track?.tracks.map((trackItem, index) => (
            <TrackItemComponent
              {...trackItem}
              index_key={index}
              key={trackItem.id}
              id={trackItem.id}
              price={Number(trackItem.price)}
              playlist={buildPlaylist(track.tracks)}
              credits={credits?.credit ?? 0}
            />
          ))}
        </section>

        {/* Pagination */}
        {!!track?.count._count.id && (
          <div
            className="
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            p-3
          "
          >
            <PaginationNewComponents
              totalItems={Number(track?.count._count.id) ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedComponent;
