import React from "react";
import AddCartComponent from "../tracks/helper/add-cart";
import MoreDetailsGenreTooltip from "./more-details-genre";
import { RiPauseLargeFill, RiPlayLargeFill } from "react-icons/ri";
import { useAtom } from "jotai";
import { playerState, playlist } from "@/state/globalState";
import { api } from "@/utils/api";
import ImageThumbnailComponent from "@/components/common/image-thumbnail";
import Link from "next/link";
import { formatCurrency, formatTrackTitle } from "@/lib/utils";
import formatDuration from "format-duration";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";

type Props = {
  index_key: number;
  id: string;
  title: string | null;
  artist: string | null;
  in_key: string | null;
  filetype: string | null;
  preview_key: string | null;
  bpm_start: number;
  bpm_end: number;
  price: number;
  is_explicit: boolean;
  release_year: number;

  genre_track: {
    genre: {
      name: string;
    };
  }[];
  tag_track: {
    tag: {
      name: string;
    };
  }[];
  user: {
    id: string | null;
    username: string | null;
    image: string | null;
  };

  duration: number;
  releaseAt: Date;
  credits:number;
  playlist:
    | {
        id: string;
        index: number;
        title: string;
        artist: string;
        islink: string;
        key: string;
        bucketName: string;
        isFull: boolean;
      }[]
    | null;
};

const TrackItemComponent = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [state, setState] = useAtom(playerState);

  const { mutateAsync: signSource } =
    api.signedUrl.signUrlKeyBucket.useMutation();

  const [, setData] = useAtom(playlist);

  const playButton = async () => {
    if (!session?.user) {
      toast.info("Sign in to preview Jeff92 & Ayan Sumania edits.", {
        action: {
          label: "Sign in",
          onClick: () => void router.push("/auth/login"),
        },
      });
      return;
    }
    if (state.id === String(props.id)) {
      setState({
        ...state,
        playing: true,
      });
    } else {
      setState({
        ...state,
        next: true,
      });

      const source = await signSource({
        id: String(props.id),
        key: String(props.preview_key),
        bucketName: "jxs-music",
      });

      setState({
        ...state,
        id: String(props.id),
        source: String(source.url),
        playing: true,
        next: false,
      });

      setData(props.playlist!);
    }
  };

  const isPlaying = state.playing && state.id === String(props.id);

  const isVideo = props.filetype?.includes("video");

  const duration = formatDuration(Number(props.duration * 1000)).replace(
    /^(\d):/,
    "0$1:",
  );
  const currentKey = keyData.find(
    ({ name }) =>
      name.toUpperCase() === (props.in_key ?? "--").trim().toUpperCase(),
  ) ?? {
    id: 100,
    name: "--",
    color: "#000000",
    textColor: "#FFFFFF",
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.045]">
      {/* =====================================================
          SUBTLE ACTIVE / HOVER GLOW
      ===================================================== */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#B9FF00] shadow-[0_0_20px_rgba(185,255,0,0.45)] transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-70"
        } `}
      />

      {/* =====================================================
          MAIN ROW
      ===================================================== */}
      <div className="flex min-h-[76px] w-full items-center gap-3 px-3 py-3 md:grid md:grid-cols-[40px_40px_minmax(180px,1fr)_56px_80px_128px_64px_56px_154px] md:items-center md:gap-4 md:px-4">
        {/* =====================================================
            PLAY BUTTON
        ===================================================== */}
        <button
          type="button"
          aria-label={isPlaying ? "Pause track" : "Play preview"}
          onClick={() => {
            if (isPlaying) {
              setState({
                ...state,
                playing: false,
              });
            } else {
              void playButton();
            }
          }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            isPlaying
              ? `border-[#B9FF00]/40 bg-[#B9FF00] text-black shadow-[0_0_20px_rgba(185,255,0,0.2)]`
              : `border-white/10 bg-white/[0.05] text-zinc-400 hover:border-[#B9FF00]/30 hover:bg-[#B9FF00] hover:text-black`
          } `}
        >
          {isPlaying ? (
            <RiPauseLargeFill className="h-5 w-5" />
          ) : (
            <RiPlayLargeFill className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* =====================================================
            EDITOR AVATAR
        ===================================================== */}
        <div className="hidden h-10 w-10 shrink-0 overflow-hidden border border-white/10 bg-white/[0.04] sm:block">
          <ImageThumbnailComponent
            image={String(props.user.image)}
            rounded={false}
          />
        </div>

        {/* =====================================================
            TRACK INFO
        ===================================================== */}
        <div className="min-w-0 flex-1 md:flex-none">
          <div className="flex min-w-0 items-center gap-2"><Link href={`/tracks/${props.id}`} className="min-w-0 max-w-full">
            <h3 className="truncate text-sm font-semibold leading-5 text-zinc-100 transition-colors hover:text-[#B9FF00]">
              {props.title}
            </h3>
          </Link><span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase leading-none ${props.is_explicit ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}>{props.is_explicit ? "Dirty" : "Clean"}</span></div>

          <p className="mt-0.5 truncate text-sm text-zinc-400">
            {props.artist}
          </p>
          <Link
            href={`/editors/${props.user.id}`}
            className="mt-0.5 truncate text-xs text-[#B9FF00]/70 hover:text-yellow-400"
          >
            {props.user.username}
          </Link>

          {/* MOBILE METADATA */}
          <div className="mt-2 flex items-center gap-1.5 md:hidden">
            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${
                isVideo
                  ? `border-pink-400/20 bg-pink-400/10 text-pink-300`
                  : `border-[#B9FF00]/20 bg-[#B9FF00]/10 text-[#B9FF00]`
              } `}
            >
              {isVideo ? "Video" : "Audio"}
            </span>

            <span className="text-[10px] text-zinc-600">{duration}</span>
          </div>
        </div>

        {/* =====================================================
            KEY
        ===================================================== */}
        <div className="hidden items-center justify-center md:flex">
          <span
            className="rounded-md border px-2.5 py-1 text-[11px] font-bold"
            style={{
              backgroundColor: currentKey.color,
              borderColor: currentKey.color,
              color: currentKey.textColor,
            }}
          >
            {props.in_key ?? "--"}
          </span>
        </div>

        {/* =====================================================
            BPM
        ===================================================== */}
        <div className="hidden items-center justify-center md:flex">
          <span className="text-xs font-semibold text-zinc-400">
            {props.bpm_start}
          </span>
        </div>

        {/* =====================================================
            GENRE
        ===================================================== */}
        <div className="hidden min-w-0 flex-col items-start gap-1 lg:flex">
          <div className="flex items-center gap-1">
            <span className="min-w-0 truncate text-xs font-medium text-zinc-400">
              {props.genre_track[0]?.genre.name}
            </span>
            {Number(props.genre_track?.length) > 1 && (
              <MoreDetailsGenreTooltip genre_track={props.genre_track} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {props.tag_track.map((tag, idx) => (
              <span
                key={idx}
                className="min-w-0 truncate text-[9px] font-medium text-cyan-500"
              >
                {tag.tag.name}
              </span>
            ))}
            {/* {Number(props.tag_track?.length) > 1 && (
              <MoreDetailsGenreTooltip
                genre_track={props.tag_track}
              />
            )} */}
          </div>
        </div>

        {/* =====================================================
            TYPE
        ===================================================== */}
        <div className="hidden items-center md:flex">
          <span
            className={`rounded-full border px-2 py-1 text-[9px] font-semibold tracking-wider uppercase ${
              isVideo
                ? `border-pink-400/20 bg-pink-400/10 text-pink-300`
                : `border-[#B9FF00]/20 bg-[#B9FF00]/10 text-yellow-100`
            } `}
          >
            {isVideo ? "Video" : "Audio"}
          </span>
        </div>

        {/* =====================================================
            DURATION
        ===================================================== */}
        <div className="hidden items-center justify-center md:flex">
          <span className="text-xs text-zinc-600">{duration}</span>
        </div>

        {/* =====================================================
            CART / PRICE
        ===================================================== */}
        <div className="flex shrink-0 items-center justify-end">
          <AddCartComponent
            trackId={props.id}
            albumId={null}
            price={props.price}
            id={props.user.id}
            credits={props.credits}
          />
        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM METADATA
      ===================================================== */}
      <div className="flex items-center gap-3 border-t border-white/5 px-4 py-2 md:hidden">
        <span
          className="text-[9px] font-semibold tracking-wider uppercase"
          style={{
            color: currentKey.color,
          }}
        >
          {props.in_key ?? "--"}
        </span>

        <span className="h-1 w-1 rounded-full bg-zinc-700" />

        <span className="text-[9px] tracking-wider text-zinc-400 uppercase">
          {props.bpm_start} BPM
        </span>

        <span className="h-1 w-1 rounded-full bg-zinc-700" />

        <span className="truncate text-[9px] tracking-wider text-zinc-400 uppercase">
          {props.genre_track[0]?.genre.name}
        </span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />

        <span className="truncate text-xs tracking-wider text-yellow-600 uppercase">
          {props.price === 0 ? "FREE" : formatCurrency(props.price)}
        </span>
      </div>
    </div>
  );
};

export default TrackItemComponent;

const keyData = [
  {
    id: 100,
    name: "--",
    color: "#000000",
    textColor: "#FFFFFF",
  },
  {
    id: 1,
    name: "1A",
    color: "#60F5D7",
    textColor: "#000000",
  },
  {
    id: 2,
    name: "1B",
    color: "#21ECBF",
    textColor: "#000000",
  },
  {
    id: 3,
    name: "2A",
    color: "#7DF5A3",
    textColor: "#000000",
  },
  {
    id: 4,
    name: "2B",
    color: "#3AF06D",
    textColor: "#000000",
  },
  {
    id: 5,
    name: "3A",
    color: "#ABF983",
    textColor: "#000000",
  },
  {
    id: 6,
    name: "3B",
    color: "#7AF53F",
    textColor: "#000000",
  },
  {
    id: 7,
    name: "4A",
    color: "#FED97E",
    textColor: "#000000",
  },
  {
    id: 8,
    name: "4B",
    color: "#FEC139",
    textColor: "#000000",
  },
  {
    id: 9,
    name: "5A",
    color: "#FDB9A0",
    textColor: "#000000",
  },
  {
    id: 10,
    name: "5B",
    color: "#FC8D6A",
    textColor: "#000000",
  },
  {
    id: 11,
    name: "6A",
    color: "#FDA6B1",
    textColor: "#000000",
  },
  {
    id: 12,
    name: "6B",
    color: "#FC7182",
    textColor: "#000000",
  },
  {
    id: 13,
    name: "7A",
    color: "#FDA0C7",
    textColor: "#000000",
  },
  {
    id: 14,
    name: "7B",
    color: "#FC67A5",
    textColor: "#000000",
  },
  {
    id: 15,
    name: "8A",
    color: "#F0A1E2",
    textColor: "#000000",
  },
  {
    id: 16,
    name: "8B",
    color: "#E768D1",
    textColor: "#000000",
  },
  {
    id: 17,
    name: "9A",
    color: "#D9A9FE",
    textColor: "#000000",
  },
  {
    id: 18,
    name: "9B",
    color: "#C075FF",
    textColor: "#000000",
  },
  {
    id: 19,
    name: "10A",
    color: "#B8C8FE",
    textColor: "#000000",
  },
  {
    id: 20,
    name: "10B",
    color: "#8EA5FF",
    textColor: "#000000",
  },
  {
    id: 21,
    name: "11A",
    color: "#8BE4F9",
    textColor: "#000000",
  },
  {
    id: 22,
    name: "11B",
    color: "#4BD1F8",
    textColor: "#000000",
  },
  {
    id: 23,
    name: "12A",
    color: "#5EF3EF",
    textColor: "#000000",
  },
  {
    id: 24,
    name: "12B",
    color: "#20EAE6",
    textColor: "#000000",
  },
];
