import React from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronDown,
  CircleX,
  Pencil,
} from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  formatCurrency,
  formatTrackTitle,
} from "@/lib/utils";
import ImageThumbnailComponent from "@/components/common/image-thumbnail";

interface Props {
  index_key: number;
  price: number;
  id: string;
  isActive: boolean;
  name: string | null;
  image: string | null;
  artist: string | null;

  trackAlbum: {
    track: TrackWithRelations;
  }[];

  user: {
    image: string | null;
  };
}

export type TrackWithRelations = {
  id: string;
  title: string | null;
  artist: string | null;
  description: string | null;
  bpm_start: number | null;
  bpm_end: number | null;
  release_year: number | null;
  in_key: string | null;
  is_explicit: boolean;
  is_opm: boolean;
  is_exclusive: boolean;
  price: number;

  genre_track: {
    genreId: string;
  }[];

  tag_track: {
    tagId: string;
  }[];
};

const MultiPacksTrackItem = (props: Props) => {
  const image = props.image ?? props.user.image;

  return (
    <AccordionItem
      value={`item-${props.index_key}`}
      className="
        group
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.06]
        bg-white/[0.015]
        px-0
        transition-all
        duration-200
        data-[state=open]:border-[#B9FF00]/15
        data-[state=open]:bg-white/[0.025]
      "
    >
      <AccordionTrigger
        className="
          relative
          flex
          min-h-[76px]
          w-full
          items-center
          gap-3
          px-3
          py-3
          text-left
          hover:no-underline
          sm:gap-4
          sm:px-4
          [&>svg]:hidden
        "
      >
        {/* Hover / active indicator */}
        <span
          className="
            absolute
            left-0
            top-1/2
            h-8
            w-0.5
            -translate-y-1/2
            rounded-full
            bg-[#B9FF00]
            opacity-0
            shadow-[0_0_10px_rgba(185,255,0,0.45)]
            transition-opacity
            group-hover:opacity-100
            group-data-[state=open]:opacity-100
          "
        />

        {/* Artwork */}
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            overflow-hidden
            border
            border-white/[0.07]
            bg-zinc-950
            sm:h-14
            sm:w-14
          "
        >
          <ImageThumbnailComponent
            image={String(image ?? "")}
            rounded={false}
          />
        </div>

        {/* Pack details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-zinc-100
                sm:text-[15px]
              "
            >
              {props.name ?? "Untitled Pack"}
            </h3>

            <span
              className="
                hidden
                rounded-full
                border
                border-white/[0.06]
                bg-white/[0.03]
                px-2
                py-0.5
                text-[9px]
                font-medium
                text-zinc-600
                sm:inline-flex
              "
            >
              {props.trackAlbum.length}{" "}
              {props.trackAlbum.length === 1
                ? "track"
                : "tracks"}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-zinc-600">
            {props.artist ?? "Unknown artist"}
          </p>

          {/* Mobile metadata */}
          <div className="mt-2 flex items-center gap-2 md:hidden">
            <StatusBadge active={props.isActive} />

            <span className="text-xs font-medium text-zinc-400">
              {formatCurrency(props.price)}
            </span>
          </div>
        </div>

        {/* Desktop status */}
        <div className="hidden w-28 shrink-0 md:flex">
          <StatusBadge active={props.isActive} />
        </div>

        {/* Price */}
        <div className="hidden w-24 shrink-0 justify-end md:flex">
          <span className="text-sm font-semibold text-zinc-300">
            {formatCurrency(props.price)}
          </span>
        </div>

        {/* Edit */}
        <Link
          href={`/restricted/editor/multi-pack/${props.id}`}
          onClick={(event) => event.stopPropagation()}
          className="
            hidden
            h-9
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.04]
            px-3
            text-[11px]
            font-medium
            text-zinc-300
            transition-all
            hover:border-[#B9FF00]/20
            hover:bg-[#B9FF00]
            hover:text-black
            sm:flex
          "
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>

        {/* Chevron */}
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-zinc-600
            transition-colors
            group-hover:bg-white/[0.04]
            group-hover:text-zinc-300
          "
        >
          <ChevronDown
            className="
              h-4
              w-4
              transition-transform
              duration-200
              group-data-[state=open]:rotate-180
            "
          />
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-0">
        <div className="border-t border-white/[0.06]">
          {/* Mobile edit */}
          <div className="flex border-b border-white/[0.05] p-3 sm:hidden">
            <Link
              href={`/restricted/editor/multi-pack/${props.id}`}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#B9FF00]
                px-3
                text-xs
                font-semibold
                text-black
                transition-colors
                hover:bg-[#B9FF00]
              "
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Pack
            </Link>
          </div>

          {/* Expanded header */}
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              pb-2
              pt-4
              sm:px-5
            "
          >
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Pack Contents
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Tracks included in this pack
              </p>
            </div>

            <span
              className="
                rounded-full
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-2.5
                py-1
                text-[10px]
                text-zinc-600
              "
            >
              {props.trackAlbum.length} total
            </span>
          </div>

          {/* Track list */}
          <div className="px-2 pb-2 sm:px-3 sm:pb-3">
            {props.trackAlbum.length > 0 ? (
              <div className="flex flex-col gap-1">
                {props.trackAlbum.map(({ track }, index) => (
                  <div
                    key={track.id}
                    className="
                      grid
                      min-h-12
                      grid-cols-[32px_1fr]
                      items-center
                      gap-2
                      rounded-xl
                      px-2
                      py-2
                      transition-colors
                      hover:bg-white/[0.03]
                      sm:grid-cols-[36px_1fr_auto]
                      sm:px-3
                    "
                  >
                    {/* Index */}
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-white/[0.035]
                        text-[10px]
                        font-medium
                        text-zinc-600
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Track details */}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-300 sm:text-sm">
                        {track.artist ? (
                          <>
                            <span className="text-zinc-500">
                              {track.artist}
                            </span>

                            <span className="px-1.5 text-zinc-700">
                              —
                            </span>
                          </>
                        ) : null}

                        {formatTrackTitle(
                          track.title,
                          track.is_explicit
                        )}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {track.bpm_start && (
                          <MetaBadge>
                            {track.bpm_start}
                            {track.bpm_end &&
                            track.bpm_end !== track.bpm_start
                              ? `-${track.bpm_end}`
                              : ""}
                            {" BPM"}
                          </MetaBadge>
                        )}

                        {track.in_key && (
                          <MetaBadge>
                            {track.in_key}
                          </MetaBadge>
                        )}

                        {track.release_year && (
                          <MetaBadge>
                            {track.release_year}
                          </MetaBadge>
                        )}

                        {track.is_exclusive && (
                          <span
                            className="
                              rounded-md
                              bg-[#B9FF00]/10
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-medium
                              uppercase
                              tracking-wide
                              text-[#B9FF00]
                            "
                          >
                            Exclusive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Track price */}
                    <span className="hidden text-xs font-medium text-zinc-600 sm:block">
                      {formatCurrency(track.price)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-24
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-white/[0.06]
                  text-xs
                  text-zinc-600
                "
              >
                No tracks added to this pack
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MultiPacksTrackItem;

const StatusBadge = ({
  active,
}: {
  active: boolean;
}) => {
  return active ? (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-emerald-500/15
        bg-emerald-500/[0.07]
        px-2.5
        py-1
        text-[10px]
        font-medium
        text-emerald-400
      "
    >
      <CheckCircle className="h-3 w-3" />
      Active
    </span>
  ) : (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-red-500/15
        bg-red-500/[0.07]
        px-2.5
        py-1
        text-[10px]
        font-medium
        text-red-400
      "
    >
      <CircleX className="h-3 w-3" />
      Inactive
    </span>
  );
};

const MetaBadge = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <span
      className="
        rounded-md
        border
        border-white/[0.05]
        bg-white/[0.025]
        px-1.5
        py-0.5
        text-[9px]
        text-zinc-600
      "
    >
      {children}
    </span>
  );
};