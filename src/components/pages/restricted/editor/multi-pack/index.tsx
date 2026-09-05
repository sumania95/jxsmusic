import React from "react";
import EmptyComponent from "../../../common/empty";
import { useAtom } from "jotai";
import { defaultPageLimit } from "@/state/globalState";
import { api } from "@/utils/api";
import FilterActiveResetComponents from "@/components/common/filter-active-reset";
import SearchComponent from "@/components/common/search";
import PaginationNewComponents from "@/components/common/pagination-new";
import {
  parseAsInteger,
  useQueryState,
} from "nuqs";
import { ProfileMeta } from "@/components/common/metadata";
import DataItemUploadTrackSkeletonComponents from "./data-item-track-skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import MultiPacksTrackItem from "./data-item";
import BannerTitleComponent from "@/components/common/banner-title";
import { Plus, Layers3 } from "lucide-react";

const MultiPacksComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );

  const [defaultLimit] = useAtom(defaultPageLimit);

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const [search] = useQueryState("search", {
    defaultValue: "",
  });

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "desc",
  });

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  );

  const { data: album, isLoading } =
    api.album.getAll.useQuery({
      search,
      sort,
      skip: Number(Number(pager) * limit - limit),
      take: limit,
    });

  return (
    <div className="flex w-full flex-col gap-5 text-zinc-300">
      <ProfileMeta
        title="Multi Packs"
        description="Collection of DJ Music"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      {/* <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
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
            title="Multi Packs"
            description="Create and manage grouped collections of DJ tracks."
          />
        </div>
      </section> */}

      {/* =====================================================
          ACTIONS / FILTERS
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
        <div className="grid gap-3 lg:grid-cols-[auto_auto_1fr]">
          {/* Create pack */}
          <Link
            href="/restricted/editor/multi-pack/create"
            className="
              flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#B9FF00]
              px-4
              text-xs
              font-semibold
              text-black
              transition-all
              hover:bg-[#B9FF00]
              active:scale-[0.98]
            "
          >
            <Plus className="h-4 w-4" />
            Create Pack
          </Link>

          {/* Sort */}
          <Select
            value={sort}
            onValueChange={setSort}
          >
            <SelectTrigger
              className="
                h-11
                w-full
                rounded-2xl
                border-white/10
                bg-white/[0.03]
                px-4
                text-xs
                text-zinc-300
                shadow-none
                transition-colors
                hover:bg-white/[0.05]
                lg:w-[190px]
              "
            >
              <SelectValue placeholder="Select ordering" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort</SelectLabel>
                <SelectItem value="asc">
                  Title A-Z
                </SelectItem>
                <SelectItem value="desc">
                  Title Z-A
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Desktop search */}
          <div className="hidden min-w-0 lg:block">
            <SearchComponent
              className="
                flex
                h-11
                w-full
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-3
                transition-all
                focus-within:border-[#B9FF00]/30
                focus-within:bg-white/[0.05]
              "
              placeholder="Search pack title..."
            />
          </div>
        </div>

        {/* Mobile / tablet search */}
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
              transition-all
              focus-within:border-[#B9FF00]/30
              focus-within:bg-white/[0.05]
            "
            placeholder="Search pack title..."
          />
        </div>

        <div className="mt-3">
          <FilterActiveResetComponents />
        </div>
      </section>

      {/* =====================================================
          PACK LIBRARY
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
        {/* Section header */}
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
          <div>
            <div className="flex items-center gap-2">
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
                <Layers3 className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Pack Library
                </h2>

                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  Published multi-track collections
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-1.5
              text-[10px]
              font-medium
              text-zinc-500
            "
          >
            {Number(album?.count._count.id ?? 0)}{" "}
            {Number(album?.count._count.id ?? 0) === 1
              ? "Pack"
              : "Packs"}
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3">
          {/* Loading */}
          {isLoading &&
            itemSkeleton.map((_, index) => (
              <div
                key={index}
                className="mb-2 overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.015]"
              >
                <DataItemUploadTrackSkeletonComponents />
              </div>
            ))}

          {/* Packs */}
          {!isLoading &&
            album?.albums &&
            album.albums.length > 0 && (
              <Accordion
                type="single"
                collapsible
                className="flex w-full flex-col gap-2"
              >
                {album.albums.map((item, index) => (
                  <div
                    key={item.id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.05]
                      bg-white/[0.015]
                      transition-all
                      duration-200
                      hover:border-[#B9FF00]/15
                      hover:bg-white/[0.025]
                    "
                  >
                    {/* hover indicator */}
                    <div
                      className="
                        absolute
                        left-0
                        top-1/2
                        z-10
                        h-8
                        w-0.5
                        -translate-y-1/2
                        rounded-full
                        bg-[#B9FF00]
                        opacity-0
                        shadow-[0_0_10px_rgba(185,255,0,0.4)]
                        transition-opacity
                        group-hover:opacity-100
                      "
                    />

                    <MultiPacksTrackItem
                      {...item}
                      index_key={index}
                    />
                  </div>
                ))}
              </Accordion>
            )}

          {/* Empty */}
          {!isLoading &&
            Number(album?.count._count.id ?? 0) === 0 && (
              <div
                className="
                  flex
                  min-h-[180px]
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-white/[0.07]
                  bg-white/[0.015]
                  p-4
                "
              >
                <EmptyComponent />
              </div>
            )}
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}
        {Number(album?.count._count.id ?? 0) > 0 && (
          <div
            className="
              border-t
              border-white/[0.06]
              bg-[#111518]/10
              px-3
              py-3
              sm:px-4
            "
          >
            <PaginationNewComponents
              totalItems={Number(album?.count._count.id ?? 0)}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default MultiPacksComponent;