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
  useQueryState
} from "nuqs";
import PaginationNewFixedLimitComponents from "@/components/common/pagination-new-fixed-limit";
import FilterActiveResetComponents from "@/components/common/filter-active-reset";
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CirclePlus,
  Music2,
  Trash2,
} from "lucide-react";


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

  const [defaultLimit] =
    useState(10);

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

  const [
    hideAlbumTracks,
    setHideAlbumTracks
  ] = useState(false);


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


  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        xl:grid-cols-2
      "
    >
      {/* =====================================================
          AVAILABLE TRACKS
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.02]
        "
      >
        {/* Ambient Glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-130px]
            h-64
            w-64
            rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[90px]
          "
        />


        {/* HEADER */}
        <div
          className="
            relative
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-4
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
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-zinc-200
                "
              >
                Available Tracks
              </h3>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Browse and add released tracks
            </p>
          </div>


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
            {tracks?.count._count.id ?? 0}
          </span>
        </div>


        {/* HIDE ALBUM TRACKS */}
        <div
          className="
            relative
            flex
            items-center
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-3
          "
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
            className="
              border-white/20
              data-[state=checked]:border-[#B9FF00]
              data-[state=checked]:bg-[#B9FF00]
              data-[state=checked]:text-black
            "
          />

          <Label
            htmlFor="hide-album-tracks"
            className="
              cursor-pointer
              text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]
              text-zinc-500
            "
          >
            Hide tracks already in albums
          </Label>
        </div>


        <div
          className="
            relative
            space-y-3
            p-3
          "
        >
          {/* =================================================
              FILTERS
          ================================================= */}
          <div
            className="
              grid
              grid-cols-2
              gap-2
              lg:grid-cols-4
            "
          >
            <div className="flex min-w-0 flex-col">
              <h3
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                Genre
              </h3>

              <DataGenreComponent />
            </div>


            <div className="flex min-w-0 flex-col">
              <h3
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                Tag
              </h3>

              <DataTagComponent />
            </div>


            <div className="flex min-w-0 flex-col">
              <h3
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                BPM
              </h3>

              <DataBPMComponent />
            </div>


            <div className="flex min-w-0 flex-col">
              <h3
                className="
                  mb-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                Key
              </h3>

              <DataKeyComponent />
            </div>
          </div>


          {/* SEARCH */}
          <div className="flex w-full flex-col">
            <h3
              className="
                mb-1
                text-[9px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-zinc-600
              "
            >
              Search
            </h3>

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
                p-1.5
                px-3
              "
              placeholder="Search title, artist...."
            />
          </div>


          <FilterActiveResetComponents />


          {/* =================================================
              TRACK LIST
          ================================================= */}
          <div
            className="
              min-h-[490px]
              max-h-[490px]
              space-y-1.5
              overflow-y-auto
              pr-1
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-zinc-800
            "
          >
            {isLoading &&
              itemSkeleton.map(
                (_, index) => (
                  <LoadingSkeletonComponents
                    key={index}
                    className="
                      h-[44px]
                      w-full
                      rounded-xl
                    "
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
                    className="
                      group
                      flex
                      min-h-11
                      items-center
                      justify-between
                      gap-3
                      rounded-xl
                      border
                      border-white/[0.05]
                      bg-white/[0.015]
                      px-3
                      py-2
                      transition-all
                      hover:border-[#B9FF00]/15
                      hover:bg-white/[0.025]
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
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
                          rounded-lg
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          text-zinc-600
                          transition-all
                          group-hover:border-[#B9FF00]/15
                          group-hover:text-[#B9FF00]
                        "
                      >
                        <Music2 className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0">
                         <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-zinc-300
                          "
                        >
                          {formatTrackTitle(
                            t.title,
                            t.is_explicit
                          )}
                        </p>
                        <p
                          className="
                            truncate
                            text-xs
                            font-semibold
                            text-zinc-400
                          "
                        >
                          {t.artist}
                        </p>

                       
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
                      className="
                        h-8
                        shrink-0
                        gap-1.5
                        rounded-lg
                        border
                        border-[#B9FF00]/15
                        bg-[#B9FF00]/[0.06]
                        px-2.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#B9FF00]
                        shadow-none
                        hover:bg-[#B9FF00]
                        hover:text-black
                        disabled:border-white/[0.04]
                        disabled:bg-white/[0.02]
                        disabled:text-zinc-700
                      "
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
            className="
              border-t
              border-white/[0.06]
              pt-3
            "
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


      {/* =====================================================
          ALBUM TRACKS
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.02]
        "
      >
        {/* Ambient Glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-[-100px]
            top-[-130px]
            h-64
            w-64
            rounded-full
            bg-[#B9FF00]/[0.02]
            blur-[90px]
          "
        />


        {/* HEADER */}
        <div
          className="
            relative
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-4
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
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-zinc-200
                "
              >
                Album Tracks
              </h3>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Tracks included in this multipack
            </p>
          </div>


          <div className="flex items-center gap-2">
            {error && (
              <span
                className="
                  hidden
                  max-w-56
                  truncate
                  text-[9px]
                  text-red-400
                  sm:block
                "
              >
                {error}
              </span>
            )}

            <span
              className={`
                rounded-full
                border
                px-3
                py-1
                text-[10px]
                font-medium
                ${
                  value.length >= 10 &&
                  value.length <= 150
                    ? `
                        border-[#B9FF00]/15
                        bg-[#B9FF00]/[0.05]
                        text-[#B9FF00]
                      `
                    : `
                        border-white/[0.07]
                        bg-white/[0.025]
                        text-zinc-500
                      `
                }
              `}
            >
              {value.length}/150
            </span>
          </div>
        </div>


        {/* ERROR */}
        {error && (
          <div
            className="
              border-b
              border-red-500/10
              bg-red-500/[0.025]
              px-4
              py-2
              sm:hidden
            "
          >
            <p className="text-[9px] text-red-400">
              {error}
            </p>
          </div>
        )}


        {/* SELECTED TRACKS */}
        <div
          className="
            relative
            min-h-[610px]
            max-h-[610px]
            space-y-1.5
            overflow-y-auto
            p-3
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-800
          "
        >
          {value.length === 0 && (
            <div
              className="
                flex
                h-full
                min-h-[560px]
                items-center
                justify-center
              "
            >
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-zinc-700
                  "
                >
                  <Music2 className="h-5 w-5" />
                </div>

                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.13em]
                    text-zinc-600
                  "
                >
                  No tracks added
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    text-zinc-700
                  "
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
                className="
                  group
                  flex
                  min-h-11
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3
                  py-2
                  transition-all
                  hover:border-red-500/10
                  hover:bg-white/[0.025]
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  {/* NUMBER */}
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      text-[9px]
                      font-semibold
                      text-zinc-600
                    "
                  >
                    {i + 1}
                  </div>


                  {/* INFO */}
                  <div className="min-w-0">
                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-zinc-300
                      "
                    >
                      {formatTrackTitle(
                        t.title,
                        t.is_explicit
                      )}
                    </p>
                    <p
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-zinc-400
                      "
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
                  className="
                    h-8
                    shrink-0
                    gap-1.5
                    rounded-lg
                    border
                    border-red-500/10
                    bg-red-500/[0.04]
                    px-2.5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-red-400
                    hover:border-red-500/20
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >
                  <Trash2 className="h-3 w-3" />

                  Remove
                </Button>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}