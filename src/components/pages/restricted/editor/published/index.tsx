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
  useQueryState,
} from "nuqs";
import { ProfileMeta } from "@/components/common/metadata";
import TrackItemComponent from "@/components/pages/common/data-item";
import { buildPlaylist } from "@/constant/helperPlaylist";
import DataTagComponent from "@/components/common/filter-tag";
import TrackListHeader from "@/components/pages/common/track-header";
import Link from "next/link";
import { PenBox } from "lucide-react";
import { useSession } from "next-auth/react";

const PublishedComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );
    const { data: session } = useSession();
  
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
    });

  return (
    <div className="flex w-full flex-col gap-5">
      <ProfileMeta
        title="Published Tracks"
        description="Collection of DJ Music"
      />

      {/* Header */}
      {/* <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 px-5 py-8 sm:px-8 lg:px-10">
        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-180px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Jeff92 & Ayan Sumania Library
            </span>
          </div>

          <BannerTitleComponent
            title="Published Tracks"
            description="Manage and browse your published DJ edits and releases"
          />
        </div>
      </section> */}

      {/* Filters */}
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
        <div className="grid gap-3 lg:grid-cols-[auto_auto_auto_auto_1fr]">
          <div className="min-w-0">
            <DataGenreComponent />
          </div>

          <div className="min-w-0">
            <DataTagComponent />
          </div>

          <div className="min-w-0">
            <DataBPMComponent />
          </div>

          <div className="min-w-0">
            <DataKeyComponent />
          </div>

          <div className="hidden min-w-0 lg:block">
            <SearchComponent
              className="
                flex
                w-full
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-3
                py-2
                transition
                focus-within:border-[#B9FF00]/40
                focus-within:bg-white/[0.05]
              "
              placeholder="Search title, artist..."
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 lg:hidden">
          <SearchComponent
            className="
              flex
              w-full
              items-center
              gap-2
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-2
              transition
              focus-within:border-[#B9FF00]/40
              focus-within:bg-white/[0.05]
            "
            placeholder="Search title, artist..."
          />
        </div>

        <div className="mt-3">
          <FilterActiveResetComponents />
        </div>
      </section>
{/* Track list header */}
                  <TrackListHeader />
      {/* Track list */}
      <section className="flex flex-col gap-2 -mt-5">
        {isLoading &&
          itemSkeleton.map((_, index) => (
            <DataItemUploadTrackSkeletonComponents key={index} />
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
  );
};

export default PublishedComponent;
