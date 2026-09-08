"use client"

import ImageThumbnailComponent from "@/components/common/image-thumbnail"
import { cn, formatCurrency } from "@/lib/utils"
import { playerState, playlist } from "@/state/globalState"
import { api } from "@/utils/api"
import formatDuration from "format-duration"
import { useAtom } from "jotai"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { RiPauseLargeFill, RiPlayLargeFill } from "react-icons/ri"
import { toast } from "sonner"

import AddCartComponent from "../tracks/helper/add-cart"
import MoreDetailsGenreTooltip from "./more-details-genre"
import {
  getActiveTrackColumns,
  type TrackColumnKey,
} from "./header-filter"
import { Zap } from "lucide-react"
import { getEnergyTheme } from "@/utils/energy-theme"

type Props = {
  index_key: number
  id: string
  title: string | null
  artist: string | null
  in_key: string | null
  filetype: string | null
  preview_key: string | null
  bpm_start: number
  bpm_end: number
  energy: number
  release_year: number
  price: number
  credits: number
  is_explicit: boolean
  duration: number
  releaseAt: Date
  genre_track: {
    genre: {
      name: string
    }
  }[]

  tag_track: {
    tag: {
      name: string
    }
  }[]

  user: {
    id: string | null
    username: string | null
    image: string | null
  }

  visibleColumns?: readonly TrackColumnKey[]

  playlist:
  | {
    id: string
    index: number
    title: string
    artist: string
    islink: string
    key: string
    bucketName: string
    isFull: boolean
  }[]
  | null
}

const TrackItemComponent = (props: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const energy =
    Number.isFinite(props.energy) &&
      props.energy >= 1 &&
      props.energy <= 10
      ? Math.round(props.energy)
      : null;

  const activeBars =
    energy === null ? 0 : Math.ceil(energy / 2);

  const energyMood = getEnergyTheme(energy);

  const [player, setPlayer] = useAtom(playerState)
  const [, setPlaylist] = useAtom(playlist)

  const { mutateAsync: signSource } =
    api.signedUrl.signUrlKeyBucket.useMutation()

  const activeColumns = getActiveTrackColumns(
    props.visibleColumns
  )

  const activeColumnSet = new Set(
    activeColumns.map(({ key }) => key)
  )

  const isPlaying =
    player.playing && player.id === String(props.id)

  const isVideo =
    props.filetype?.toLowerCase().includes("video") ??
    false

  const formattedDuration = formatDuration(
    Number(props.duration) * 1000
  ).replace(/^(\d):/, "0$1:")

  const currentKey =
    keyData.find(
      ({ name }) =>
        name.toUpperCase() ===
        (props.in_key ?? "--").trim().toUpperCase()
    ) ?? keyData[0]

  const playButton = async () => {
    if (!session?.user) {
      toast.info(
        "Sign in to preview Jeff92 & Ayan Sumania edits.",
        {
          action: {
            label: "Sign in",
            onClick: () =>
              void router.push("/auth/login"),
          },
        }
      )

      return
    }

    if (player.id === String(props.id)) {
      setPlayer((current) => ({
        ...current,
        playing: true,
      }))

      return
    }

    setPlayer((current) => ({
      ...current,
      next: true,
    }))

    try {
      const source = await signSource({
        id: String(props.id),
        key: String(props.preview_key),
        bucketName: "jxs-music",
      })

      setPlayer((current) => ({
        ...current,
        id: String(props.id),
        source: String(source.url),
        playing: true,
        next: false,
      }))

      setPlaylist(props.playlist ?? [])
    } catch {
      setPlayer((current) => ({
        ...current,
        next: false,
      }))

      toast.error("Unable to load this preview.")
    }
  }

  const togglePlayback = () => {
    if (isPlaying) {
      setPlayer((current) => ({
        ...current,
        playing: false,
      }))

      return
    }

    void playButton()
  }

  return (
    <div
      className="
        group relative w-full overflow-hidden rounded-2xl
        border border-white/10 bg-white/[0.025]
        transition-all duration-300
        hover:border-white/15 hover:bg-white/[0.045]
      "
    >
      <div
        className={`
          pointer-events-none absolute inset-y-0 left-0
          w-1 bg-[#B9FF00]
          shadow-[0_0_20px_rgba(185,255,0,0.45)]
          transition-opacity duration-300
          ${isPlaying
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-70"
          }
        `}
      />

      <div
        className="
          flex min-h-[76px] w-full items-center gap-3
          px-3 py-3 md:grid md:items-center md:gap-4 md:px-4
        "
        style={{
          gridTemplateColumns: activeColumns
            .map(({ width }) => width)
            .join(" "),
        }}
      >
        {/* Play */}
        <button
          type="button"
          aria-label={
            isPlaying ? "Pause track" : "Play preview"
          }
          onClick={togglePlayback}
          className={`
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-full border
            transition-all duration-200
            ${isPlaying
              ? "border-[#B9FF00]/40 bg-[#B9FF00] text-black shadow-[0_0_20px_rgba(185,255,0,0.2)]"
              : "border-white/10 bg-white/[0.05] text-zinc-400 hover:border-[#B9FF00]/30 hover:bg-[#B9FF00] hover:text-black"
            }
          `}
        >
          {isPlaying ? (
            <RiPauseLargeFill className="h-5 w-5" />
          ) : (
            <RiPlayLargeFill className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* Avatar */}
        <div
          className="
            hidden h-10 w-10 shrink-0 overflow-hidden
            border border-white/10 bg-white/[0.04] md:block
          "
        >
          <ImageThumbnailComponent
            image={String(props.user.image ?? "")}
            rounded={false}
          />
        </div>

        {/* Track */}
        <div className="min-w-0 flex-1 md:flex-none">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/tracks/${props.id}`}
              className="min-w-0 max-w-full"
            >
              <h3
                className="
                  truncate text-sm font-semibold leading-5
                  text-zinc-100 transition-colors
                  hover:text-[#B9FF00]
                "
              >
                {props.title ?? "Untitled"}
              </h3>
            </Link>

            <span
              className={`
                inline-flex shrink-0 rounded-full border
                px-2 py-0.5 text-[9px] font-bold uppercase
                leading-none
                ${props.is_explicit
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }
              `}
            >
              {props.is_explicit ? "Dirty" : "Clean"}
            </span>
          </div>

          <p className="mt-0.5 truncate text-sm text-zinc-400">
            {props.artist ?? "Unknown artist"}
          </p>

          <div className="mt-2 flex items-center gap-1.5 md:hidden">
            <TrackTypeBadge isVideo={isVideo} />

            <span className="text-[10px] text-zinc-600">
              {formattedDuration}
            </span>
          </div>
        </div>

        {/* Key */}
        {activeColumnSet.has("key") && (
          <div className="hidden items-center justify-center md:flex">
            <span
              className="
                rounded-md border px-2.5 py-1
                text-[11px] font-bold
              "
              style={{
                backgroundColor: currentKey.color,
                borderColor: currentKey.color,
                color: currentKey.textColor,
              }}
            >
              {props.in_key ?? "--"}
            </span>
          </div>
        )}

        {/* BPM */}
        {activeColumnSet.has("bpm") && (
          <div className="hidden items-center justify-center md:flex">
            <span className="text-xs font-semibold text-zinc-400">
              {props.bpm_start || "—"}
            </span>
          </div>
        )}

        {/* Energy */}
        {activeColumnSet.has("energy") && (
          <div className="hidden items-center justify-center md:flex">
            <div
              className="flex items-center rounded-xl px-3 py-2"
              title={
                energy === null
                  ? "Energy unknown"
                  : `Energy ${energy}/10 — ${energyMood.label}`
              }
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-3">
                  <h3 className={cn(`text-[10px] font-medium tracking-wide text-zinc-300 uppercase whitespace-nowrap`)}>
                    Energy {energy === null ? "—" : `${energy}`}
                  </h3>

                  
                </div>

                <div
                  className="flex h-4 items-end gap-1"
                  role="meter"
                  aria-label="Mixed In Key energy"
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={energy ?? undefined}
                  aria-valuetext={
                    energy === null
                      ? "Unknown"
                      : `${energy}, ${energyMood.label}`
                  }
                >
                  {[35, 50, 65, 80, 100].map((height, index) => {
                    const active = index < activeBars;

                    return (
                      <span
                        key={height}
                        className={`w-1.5 rounded-sm transition-colors ${active
                            ? `${energyMood.barClass} ${energyMood.glowClass}`
                            : "bg-white/10"
                          }`}
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    );
                  })}
                </div>

                <span
                  className={`mt-1 block truncate text-[9px] font-medium ${energyMood.valueClass}`}
                >
                  {energyMood.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Release year */}
        {activeColumnSet.has("release_year") && (
          <div className="hidden items-center justify-center md:flex">
            <span className="text-xs font-semibold text-zinc-400">
              {props.release_year || "—"}
            </span>
          </div>
        )}

        {/* Genre */}
        {activeColumnSet.has("genre") && (
          <div className="hidden min-w-0 items-center md:flex">
            {props.genre_track.length > 0 ? (
              <div
                className="
                  flex flex-wrap min-w-0 items-center gap-1
                "
              >
                {props.genre_track
                  .map(({ genre }, index) => (
                    <span
                      key={`${genre.name}-${index}`}
                      title={genre.name}
                      className="
                        rounded-full
                        border border-purple-400/15
                        bg-purple-400/[0.06] px-2 py-0.5
                        text-[9px] font-medium text-purple-400
                      "
                    >
                      {genre.name}
                    </span>
                  ))}

              </div>
            ) : (
              <span className="text-xs text-zinc-600">
                —
              </span>
            )}
          </div>
        )}

        {/* Tags — separate from Genre */}
        {activeColumnSet.has("tags") && (
          <div className="hidden min-w-0 items-center md:flex">
            {props.tag_track.length > 0 ? (
              <div
                className="
                  flex flex-wrap min-w-0 items-center gap-1
                "
              >
                {props.tag_track
                  .map(({ tag }, index) => (
                    <span
                      key={`${tag.name}-${index}`}
                      title={tag.name}
                      className="
                        rounded-full
                        border border-cyan-400/15
                        bg-cyan-400/[0.06] px-2 py-0.5
                        text-[9px] font-medium text-cyan-400
                      "
                    >
                      {tag.name}
                    </span>
                  ))}

              </div>
            ) : (
              <span className="text-xs text-zinc-600">
                —
              </span>
            )}
          </div>
        )}

        {/* Type */}
        {activeColumnSet.has("type") && (
          <div className="hidden items-center md:flex">
            <TrackTypeBadge isVideo={isVideo} />
          </div>
        )}

        {/* Duration */}
        {activeColumnSet.has("duration") && (
          <div className="hidden items-center justify-center md:flex">
            <span className="text-xs text-zinc-600">
              {formattedDuration}
            </span>
          </div>
        )}

        {/* Price */}
        {activeColumnSet.has("price") && (
          <div className="flex shrink-0 items-center justify-end">
            <AddCartComponent
              trackId={props.id}
              albumId={null}
              price={props.price}
              id={props.user.id}
              credits={props.credits}
            />
          </div>
        )}
      </div>

      {/* Mobile metadata */}
      <div
        className="
          flex flex-wrap items-center gap-2 border-t
          border-white/5 px-4 py-2 md:hidden
        "
      >
        <span
          className="
            truncate text-xs uppercase tracking-wider
            text-yellow-600
          "
        >
          {props.price === 0
            ? "Free"
            : formatCurrency(props.price)}
        </span>
        <MetadataDivider />
        <MetadataItem>
          <span style={{ color: currentKey.color }}>
            {props.in_key ?? "--"}
          </span>
        </MetadataItem>

        <MetadataDivider />

        <MetadataItem>
          {props.bpm_start || "—"} BPM
        </MetadataItem>

        <MetadataDivider />

        <MetadataItem>
          Energy {Number.isFinite(props.energy) ? props.energy : "—"}
        </MetadataItem>

        <MetadataDivider />

        <MetadataItem>
          {props.release_year || "—"}
        </MetadataItem>

        <MetadataDivider />

        <MetadataItem>
          {props.genre_track[0]?.genre.name ?? "No genre"}
        </MetadataItem>
      </div>
    </div>
  )
}

const TrackTypeBadge = ({
  isVideo,
}: {
  isVideo: boolean
}) => {
  return (
    <span
      className={`
        rounded-full border px-2 py-1
        text-[9px] font-semibold uppercase tracking-wider
        ${isVideo
          ? "border-pink-400/20 bg-pink-400/10 text-pink-300"
          : "border-[#B9FF00]/20 bg-[#B9FF00]/10 text-yellow-100"
        }
      `}
    >
      {isVideo ? "Video" : "Audio"}
    </span>
  )
}

const MetadataItem = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <span
      className="
        truncate text-[9px] uppercase
        tracking-wider text-zinc-400
      "
    >
      {children}
    </span>
  )
}

const MetadataDivider = () => (
  <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-700" />
)

export default TrackItemComponent

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
] as const