import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { formatTrackTitle } from "@/lib/utils";
import { Loader2, Music2, Search } from "lucide-react";


export interface AlbumTrackType {
  trackId: string;
  title: string;
  artist: string;
  is_explicit: boolean;
}


interface Tracks {
  id: string;
  title: string | null;
  artist: string | null;
  is_explicit: boolean;
}


interface TrackSearchMultiProps {
  value: AlbumTrackType[];
  onSelect: (track: AlbumTrackType) => void;
  onRemove: (trackId: string) => void;
  disabled?: boolean;
}


const TrackSearchMulti = ({
  value,
  onSelect,
  onRemove,
  disabled,
}: TrackSearchMultiProps) => {
  const [query, setQuery] = useState("");

  const [debouncedQuery] =
    useDebounce(query, 500);

  const excludeIds =
    value.map(v => v.trackId);


  const {
    data: results = [],
    isFetching
  } = api.album.search.useQuery(
    {
      q: debouncedQuery,
      excludeIds
    },
    {
      enabled:
        debouncedQuery.length > 1
    }
  );


  const handleSelect = (
    track: Tracks
  ) => {
    if (
      !value.find(
        (v) =>
          v.trackId === track.id
      )
    ) {
      onSelect({
        trackId:
          track.id,

        title:
          String(track.title),

        artist:
          String(track.artist),

        is_explicit:
          track.is_explicit,
      });

      setQuery("");
    }
  };


  const visibleResults =
    query ? results : [];


  return (
    <div
      className="
        relative
        flex
        w-full
        flex-col
      "
    >
      {/* =====================================================
          SEARCH INPUT
      ===================================================== */}
      <div className="relative">
        <Search
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-zinc-600
          "
        />

        <Input
          type="text"
          placeholder="Search track"
          value={query}
          disabled={disabled}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          className="
            h-11
            rounded-xl
            border-white/[0.08]
            bg-white/[0.025]
            pl-10
            pr-10
            text-sm
            text-zinc-300
            shadow-none
            placeholder:text-zinc-700
            focus-visible:border-[#B9FF00]/30
            focus-visible:ring-[#B9FF00]/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />


        {isFetching && (
          <Loader2
            className="
              absolute
              right-3.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              animate-spin
              text-[#B9FF00]
            "
          />
        )}
      </div>


      {/* =====================================================
          SEARCH STATUS
      ===================================================== */}
      {isFetching && (
        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            px-1
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#B9FF00]
              shadow-[0_0_6px_rgba(185,255,0,0.6)]
            "
          />

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-zinc-600
            "
          >
            Searching
          </p>
        </div>
      )}


      {/* =====================================================
          RESULTS
      ===================================================== */}
      {visibleResults.length > 0 && (
        <ul
          className="
            mt-2
            max-h-64
            w-full
            overflow-y-auto
            rounded-2xl
            border
            border-white/10
            bg-zinc-950
            p-1.5
            shadow-[0_20px_50px_rgba(0,0,0,0.45)]
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-800
          "
        >
          {visibleResults.map(
            (track) => (
              <li
                key={track.id}
                onClick={() =>
                  handleSelect(track)
                }
                className="
                  group
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-transparent
                  px-3
                  py-2.5
                  transition-all
                  duration-200
                  hover:border-[#B9FF00]/10
                  hover:bg-[#B9FF00]/[0.04]
                "
              >
                {/* ICON */}
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
                    group-hover:bg-[#B9FF00]/[0.06]
                    group-hover:text-[#B9FF00]
                  "
                >
                  <Music2 className="h-3.5 w-3.5" />
                </div>


                {/* TRACK INFO */}
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-xs
                      font-medium
                      text-zinc-300
                      transition-colors
                      group-hover:text-[#B9FF00]
                    "
                  >
                    {formatTrackTitle(
                      track.title,
                      track.is_explicit
                    )}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[10px]
                      text-zinc-600
                    "
                  >
                    {track.artist}
                  </p>
                </div>


                {/* SELECT INDICATOR */}
                <div
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-zinc-800
                    transition-all
                    group-hover:bg-[#B9FF00]
                    group-hover:shadow-[0_0_8px_rgba(185,255,0,0.6)]
                  "
                />
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};


export default TrackSearchMulti;