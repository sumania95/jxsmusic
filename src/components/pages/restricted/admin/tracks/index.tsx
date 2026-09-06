import React from "react";
import EmptyComponent from "../../../common/empty";
import { useAtom } from "jotai";
import { defaultPageLimit } from "@/state/globalState";
import { api } from "@/utils/api";
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
import AdminPublishedItem from "./data-item";
import AdminReleasesTrackSkeletonComponents from "./data-item-track-skeleton";
import { buildPlaylist } from "@/constant/helperPlaylist";
import DataTagComponent from "@/components/common/filter-tag";
import FilterFileTypeComponent from "@/components/common/filter-file";
import { UpdatePreviewKeyButton } from "../helper/generator-preview";
import {
  Disc3,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";


const AdminPublishedComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );


  const [defaultLimit] = useAtom(
    defaultPageLimit
  );


  const [genres] = useQueryState(
    "genres",
    parseAsArrayOf(
      parseAsString
    ).withDefault([])
  );


  const [tags] = useQueryState(
    "tags",
    parseAsArrayOf(
      parseAsString
    ).withDefault([])
  );


  const [selectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(
      parseAsString
    ).withDefault([])
  );


  const [bpm] = useQueryState(
    "bpm",
    parseAsArrayOf(
      parseAsInteger
    ).withDefault([
      0,
      200,
    ])
  );


  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );


  const [search] = useQueryState(
    "search",
    {
      defaultValue: "",
    }
  );


  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(
      defaultLimit
    )
  );


  const [filetypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum([
        "audio",
        "video",
      ])
    ).withDefault([])
  );


  const {
    data: track,
    isLoading,
  } =
    api.track.getAllReleases.useQuery({
      search,
      genre: genres,
      tag: tags,
      key: selectedKeys,
      bpm_start: bpm[0],
      bpm_end: bpm[1],
      skip: Number(
        pager * limit - limit
      ),
      take: limit,
      is_editor: false,
      filetypes,
    });


  const totalItems = Number(
    track?.count._count.id ?? 0
  );


  const playlist =
    track?.tracks
      ? buildPlaylist(
          track.tracks
        )
      : [];


  return (
    <div className="flex w-full flex-col gap-4">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-white/[0.06]
          bg-white/[0.015]
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#B9FF00]/10
              text-[#B9FF00]
            "
          >
            <Disc3 className="h-4 w-4" />
          </div>


          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Uploaded Tracks
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-zinc-600
              "
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "Record"
                : "Records"}
            </p>
          </div>
        </div>


        <div className="w-full sm:w-auto">
          <UpdatePreviewKeyButton />
        </div>
      </section>


      {/* =====================================================
          FILTERS
      ===================================================== */}
      <section
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-3
          sm:p-4
        "
      >
        <div className="mb-4 flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              bg-[#B9FF00]/10
              text-[#B9FF00]
            "
          >
            <SlidersHorizontal className="h-4 w-4" />
          </div>


          <div>
            <h4 className="text-xs font-semibold text-zinc-300">
              Filters
            </h4>

            <p
              className="
                mt-0.5
                text-[9px]
                uppercase
                tracking-[0.14em]
                text-zinc-600
              "
            >
              Refine the track library
            </p>
          </div>
        </div>


        {/* FILE TYPE */}
        <div className="mb-3">
          <FilterFileTypeComponent />
        </div>


        {/* DESKTOP FILTERS */}
        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-[140px_140px_140px_140px_1fr]
          "
        >
          <FilterBox label="Genre">
            <DataGenreComponent />
          </FilterBox>


          <FilterBox label="Tag">
            <DataTagComponent />
          </FilterBox>


          <FilterBox label="BPM">
            <DataBPMComponent />
          </FilterBox>


          <FilterBox label="Key">
            <DataKeyComponent />
          </FilterBox>


          <div className="hidden min-w-0 lg:block">
            <FilterLabel label="Search" />

            <SearchComponent
              className="
                flex
                h-11
                w-full
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-3
                transition-all
                focus-within:border-[#B9FF00]/30
                focus-within:bg-white/[0.04]
              "
              placeholder="Search title, artist..."
            />
          </div>
        </div>


        {/* MOBILE SEARCH */}
        <div className="mt-3 lg:hidden">
          <FilterLabel label="Search" />

          <SearchComponent
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-3
              py-2
              transition-all
              focus-within:border-[#B9FF00]/30
              focus-within:bg-white/[0.04]
            "
            placeholder="Search title, artist..."
          />
        </div>


        <div className="mt-3">
          <FilterActiveResetComponents />
        </div>
      </section>


      {/* =====================================================
          TRACK LIBRARY
      ===================================================== */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        {/* =================================================
            LIBRARY HEADER
        ================================================= */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-white/[0.06]
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-[#B9FF00]/10
                text-[#B9FF00]
              "
            >
              <Disc3 className="h-4 w-4" />
            </div>


            <div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Track Library
              </h4>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Published releases
              </p>
            </div>
          </div>


          {!isLoading &&
            totalItems > 0 && (
              <span
                className="
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-3
                  py-1
                  text-[10px]
                  font-medium
                  text-zinc-500
                "
              >
                {totalItems}
              </span>
            )}
        </div>


        {/* =================================================
            DESKTOP GRID HEADER
        ================================================= */}
        {!isLoading &&
          totalItems > 0 && (
            <div
              className="
                hidden
                min-h-11
                border-b
                border-white/[0.06]
                bg-[#111518]/20
                px-4

                md:grid
                md:grid-cols-[40px_40px_minmax(180px,1fr)_64px_72px_120px_70px_90px_132px]
                md:items-center
                md:gap-4
              "
            >
              {/* Play */}
              <ColumnHeader />

              {/* Avatar */}
              <ColumnHeader />

              {/* Track */}
              <ColumnHeader className="justify-start">
                Track
              </ColumnHeader>

              {/* Key */}
              <ColumnHeader>
                Key
              </ColumnHeader>

              {/* BPM */}
              <ColumnHeader>
                BPM
              </ColumnHeader>

              {/* Genre */}
              <ColumnHeader className="justify-start">
                Genre
              </ColumnHeader>

              {/* Type */}
              <ColumnHeader>
                Type
              </ColumnHeader>

              {/* DL */}
              <ColumnHeader>
                DL
              </ColumnHeader>

              {/* Actions */}
              <ColumnHeader className="justify-end">
                Actions
              </ColumnHeader>
            </div>
          )}


        {/* =================================================
            ROWS
        ================================================= */}
        <div className="flex flex-col">
          {/* Loading */}
          {isLoading &&
            itemSkeleton.map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    border-b
                    border-white/[0.04]
                    last:border-b-0
                  "
                >
                  <AdminReleasesTrackSkeletonComponents />
                </div>
              )
            )}


          {/* Empty */}
          {!isLoading &&
            totalItems === 0 && (
              <div className="p-3">
                <EmptyComponent
                  title="No Published Tracks"
                  description="No tracks matched your current filters."
                  className="
                    min-h-[220px]
                    border-dashed
                    py-16
                  "
                />
              </div>
            )}


          {/* Tracks */}
          {!isLoading &&
            track?.tracks.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="
                    border-b
                    border-white/[0.04]
                    last:border-b-0
                  "
                >
                  <AdminPublishedItem
                    {...item}
                    index_key={index}
                    index={index}
                    playlist={playlist}
                  />
                </div>
              )
            )}
        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}
        {totalItems > 0 && (
          <div
            className="
              border-t
              border-white/[0.06]
              bg-[#111518]/10
              p-3
            "
          >
            <PaginationNewComponents
              totalItems={
                totalItems
              }
            />
          </div>
        )}
      </section>
    </div>
  );
};


export default AdminPublishedComponent;


/* =========================================================
   FILTER LABEL
========================================================= */

const FilterLabel = ({
  label,
}: {
  label: string;
}) => {
  return (
    <p
      className="
        mb-1.5
        text-[9px]
        font-medium
        uppercase
        tracking-[0.13em]
        text-zinc-600
      "
    >
      {label}
    </p>
  );
};


/* =========================================================
   FILTER BOX
========================================================= */

const FilterBox = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="min-w-0">
      <FilterLabel
        label={label}
      />

      {children}
    </div>
  );
};


/* =========================================================
   COLUMN HEADER
========================================================= */

const ColumnHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `
          flex
          items-center
          justify-center
          whitespace-nowrap
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-zinc-600
        `,
        className
      )}
    >
      {children}
    </div>
  );
};