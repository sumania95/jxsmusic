import { useState } from "react";
import {
  LoaderIcon,
  Music2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useDebounce } from "use-debounce";

import { api } from "@/utils/api";
import { formatTrackTitle } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import SectionHeader from "./section-header";

export type SpotifyTrackType = {
  spotifyId: string;
  name: string;
  artists: string;
};

type ChangeHandler<T> = (
  value: T,
) => void | Promise<unknown>;

type OriginalCompositionSectionProps = {
  artist?: string | null;
  title?: string | null;
  isExplicit: boolean;
  isOriginal: boolean;
  spotifyTracks: SpotifyTrackType[];
  disabled?: boolean;
  error?: string;
  onOriginalChange: ChangeHandler<boolean>;
  onSpotifyTracksChange: ChangeHandler<
    SpotifyTrackType[]
  >;
};

export function OriginalCompositionSection({
  artist,
  title,
  isExplicit,
  isOriginal,
  spotifyTracks,
  disabled = false,
  error,
  onOriginalChange,
  onSpotifyTracksChange,
}: OriginalCompositionSectionProps) {
  const handleOriginalChange = (
    checked: boolean,
  ) => {
    void onOriginalChange(checked);

    if (checked) {
      void onSpotifyTracksChange([]);
    }
  };

  const handleSelect = (
    track: SpotifyTrackType,
  ) => {
    const alreadySelected = spotifyTracks.some(
      (item) =>
        item.spotifyId === track.spotifyId,
    );

    if (alreadySelected) {
      return;
    }

    void onSpotifyTracksChange([
      ...spotifyTracks,
      track,
    ]);
  };

  const handleRemove = (spotifyId: string) => {
    void onSpotifyTracksChange(
      spotifyTracks.filter(
        (item) => item.spotifyId !== spotifyId,
      ),
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.12] bg-[#111214] shadow-xl shadow-black/20">
      <SectionHeader
        error={error}
        icon={Music2}
        title="Original Composition"
        description="Identify source material contained in this track"
        badge="Audio"
      />

      <div className="space-y-5 p-4 sm:p-5">
        {/* Current track */}

        {/* <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#B9FF00]/15 bg-[#B9FF00]/10 text-[#B9FF00]">
            <Music2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Your track
            </p>

            <p className="truncate text-sm font-semibold text-zinc-300">
              {artist || "Unknown Artist"} - {formatTrackTitle(
                title,
                isExplicit,
              )}
            </p>
          </div>
        </div> */}

        {/* Information */}

        <div className="flex items-start gap-3 rounded-2xl border border-[#B9FF00]/10 bg-[#B9FF00]/[0.04] px-4 py-3.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#B9FF00]" />

          <p className="text-xs leading-5 text-zinc-400">
            Add matching Spotify tracks when this edit
            or remix contains existing original
            material. If this is entirely your own
            composition, enable the option below.
          </p>
        </div>

        {/* Original toggle */}

        <label
          htmlFor="is-original"
          className="
            flex
            cursor-pointer
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-white/[0.1]
            bg-white/[0.035]
            p-4
            transition
            hover:border-white/[0.16]
            hover:bg-white/[0.055]
          "
        >
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              Original / No source found
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Spotify source is not required when
              enabled.
            </p>
          </div>

          <Checkbox
            id="is-original"
            checked={isOriginal}
            disabled={disabled}
            onCheckedChange={(checked) => {
              handleOriginalChange(
                checked === true,
              );
            }}
            className="
              border-white/20
              data-[state=checked]:border-[#B9FF00]
              data-[state=checked]:bg-[#B9FF00]
              data-[state=checked]:text-black
            "
          />
        </label>

        {/* {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-3 py-2 text-xs font-medium text-red-300"
          >
            {error}
          </p>
        )} */}

        {!isOriginal && (
          <SpotifySearchMulti
            value={spotifyTracks}
            disabled={disabled}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SPOTIFY SEARCH
========================================================= */

type SpotifySearchMultiProps = {
  value: SpotifyTrackType[];
  disabled?: boolean;
  onSelect: (
    track: SpotifyTrackType,
  ) => void | Promise<unknown>;
  onRemove: (
    spotifyId: string,
  ) => void | Promise<unknown>;
};

export function SpotifySearchMulti({
  value,
  onSelect,
  onRemove,
  disabled = false,
}: SpotifySearchMultiProps) {
  const [query, setQuery] = useState("");

  const [debouncedQuery] = useDebounce(
    query.trim(),
    500,
  );

  const {
    data: results = [],
    isFetching,
  } = api.spotify.search.useQuery(
    {
      query: debouncedQuery,
    },
    {
      enabled:
        !disabled &&
        debouncedQuery.length > 0,
    },
  );

  const handleSelect = (
    track: SpotifyTrackType,
  ) => {
    if (disabled) {
      return;
    }

    const alreadySelected = value.some(
      (item) =>
        item.spotifyId === track.spotifyId,
    );

    if (alreadySelected) {
      return;
    }

    void onSelect(track);
    setQuery("");
  };

  const visibleResults =
    query.trim().length > 0 ? results : [];

  return (
    <div className="relative flex w-full flex-col gap-4">
      {/* Search input */}

      <div className="space-y-2">
        <label
          htmlFor="spotify-source-search"
          className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400"
        >
          Search source tracks
        </label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

          <Input
            id="spotify-source-search"
            type="text"
            placeholder="Search Spotify track..."
            value={query}
            disabled={disabled}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className="
              h-11
              rounded-xl
              border
              border-white/[0.12]
              bg-black/20
              pl-10
              pr-10
              text-sm
              text-zinc-100
              placeholder:text-zinc-600
              selection:bg-yellow-100
              selection:text-black
              focus-visible:border-[#B9FF00]/40
              focus-visible:ring-2
              focus-visible:ring-[#B9FF00]/15
            "
          />

          {isFetching && (
            <LoaderIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#B9FF00]" />
          )}
        </div>
      </div>

      {/* Search results */}

      {visibleResults.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111518] shadow-lg shadow-black/20">
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
              Spotify Results
            </span>

            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-400">
              {visibleResults.length} results
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {visibleResults.map((spotifyTrack) => (
              <button
                type="button"
                key={spotifyTrack.spotifyId}
                disabled={disabled}
                onClick={() => {
                  handleSelect(spotifyTrack);
                }}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-transparent
                  px-3
                  py-2.5
                  text-left
                  transition
                  hover:border-white/[0.07]
                  hover:bg-white/[0.05]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#B9FF00]/10 bg-[#B9FF00]/10 text-[#B9FF00]">
                  <Music2 className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                    {spotifyTrack.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {spotifyTrack.artists}
                  </p>
                </div>

                <span className="rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] font-medium text-zinc-400 transition group-hover:border-[#B9FF00]/20 group-hover:text-[#B9FF00]">
                  Add
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected sources */}

      {value.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
              Selected Sources
            </p>

            <span className="rounded-full bg-[#B9FF00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#B9FF00]">
              {value.length}
            </span>
          </div>

          {value.map((spotifyTrack) => (
            <div
              key={spotifyTrack.spotifyId}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 transition hover:border-white/[0.13] hover:bg-white/[0.05]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#B9FF00]/10 bg-[#B9FF00]/10 text-[#B9FF00]">
                  <Music2 className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {spotifyTrack.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {spotifyTrack.artists}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Remove ${spotifyTrack.name}`}
                disabled={disabled}
                onClick={() => {
                  void onRemove(
                    spotifyTrack.spotifyId,
                  );
                }}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-transparent
                  text-zinc-500
                  transition
                  hover:border-red-500/10
                  hover:bg-red-500/[0.08]
                  hover:text-red-400
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}