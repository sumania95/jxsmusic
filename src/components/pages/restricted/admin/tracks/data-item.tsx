import { useAtom } from 'jotai'
import React from 'react'
import { playerState, playlist } from '@/state/globalState'
import { api } from '@/utils/api'
import {
  RiPauseLargeFill,
  RiPlayLargeFill,
} from 'react-icons/ri'
import MoreDetailsGenreTooltip from '@/components/pages/common/more-details-genre'
import Link from 'next/link'
import AdminAlertTrackDeleteComponent from './helper/track-delete'
import ImageThumbnailComponent from '@/components/common/image-thumbnail'
import {
  formatCurrency,
  formatTrackTitle
} from '@/lib/utils'
import AdminTrackUpdateUploadedForm from './helper/update-form'
import DownloadTrackFreeComponent from '@/components/common/download-free'


interface Props {
  index_key: number
  index: number
  price: number
  id: string
  title: string | null
  filetype: string | null
  preview_key: string | null
  artist: string | null
  in_key: string | null
  bpm_start: number
  bpm_end: number
  release_year: number
  is_opm: boolean
  is_disabled: boolean
  is_explicit: boolean
  is_exclusive: boolean
  _count:{
    downloadTrack:number
  },
  genre_track: {
    genre: {
      name: string
    }
  }[]
  user: {
    id: string | null
    image: string | null
  }
  duration: number
  releaseAt: Date
  playlist: {
    id: string
    index: number
    title: string
    artist: string
    key: string
    isFull: boolean
  }[] | null
}


const AdminPublishedItem = (
  props: Props
) => {
  const [state, setState] =
    useAtom(playerState)

  const {
    mutateAsync: signSource
  } =
    api.signedUrl.signUrlKeyBucket.useMutation()

  const [, setData] =
    useAtom(playlist)


  const playButton = async () => {
    if (
      state.id === String(props.id)
    ) {
      setState({
        ...state,
        playing: true
      })
    } else {
      setState({
        ...state,
        next: true
      })


      const source =
        await signSource({
          id: String(props.id),
          key: String(
            props.preview_key
          ),
          bucketName:
            "jxs-music"
        })


      setState({
        ...state,
        id: String(props.id),
        source:
          String(source.url),
        playing: true,
        next: false
      })


      setData(
        props.playlist!
      )
    }
  }


  const isPlaying =
    state.playing &&
    state.id ===
    String(props.id)


  const isVideo =
    props.filetype?.includes(
      "video"
    )


  return (
    <div
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.02]
        transition-all
        duration-300
        hover:border-white/15
        hover:bg-white/[0.04]
      "
    >
      {/* =====================================================
          ACTIVE / HOVER INDICATOR
      ===================================================== */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-1
          bg-[#B9FF00]
          shadow-[0_0_18px_rgba(185,255,0,0.45)]
          transition-opacity
          duration-300

          ${isPlaying
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-70"
          }
        `}
      />


      {/* =====================================================
          MAIN GRID ROW
      ===================================================== */}
      <div
        className="
          flex
          min-h-[76px]
          w-full
          items-center
          gap-3
          px-3
          py-3

          md:grid
          md:grid-cols-[40px_40px_minmax(180px,1fr)_64px_72px_120px_70px_90px_132px]
          md:items-center
          md:gap-4
          md:px-4
        "
      >
        {/* =================================================
            PLAY
        ================================================= */}
        <button
          type="button"
          aria-label={
            isPlaying
              ? "Pause track"
              : "Play preview"
          }
          onClick={() => {
            if (isPlaying) {
              setState({
                ...state,
                playing: false
              })
            } else {
              void playButton()
            }
          }}
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-200

            ${isPlaying
              ? `
                    border-[#B9FF00]/40
                    bg-[#B9FF00]
                    text-black
                    shadow-[0_0_20px_rgba(185,255,0,0.18)]
                  `
              : `
                    border-white/10
                    bg-white/[0.04]
                    text-zinc-400
                    hover:border-[#B9FF00]/25
                    hover:bg-[#B9FF00]
                    hover:text-black
                  `
            }
          `}
        >
          {isPlaying ? (
            <RiPauseLargeFill
              className="h-5 w-5"
            />
          ) : (
            <RiPlayLargeFill
              className="ml-0.5 h-5 w-5"
            />
          )}
        </button>


        {/* =================================================
            USER IMAGE
        ================================================= */}
        <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] sm:block">
          <ImageThumbnailComponent
            image={String(props.user.image)}
          />
        </div>


        {/* =================================================
            TRACK INFO
        ================================================= */}
        <div
          className="
            min-w-0
            flex-1
            md:flex-none
          "
        >
          <Link
            href={`/tracks/${props.id}`}
            className="
              block
              max-w-full
              w-fit
            "
          >
            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-zinc-200
                transition-colors
                hover:text-[#B9FF00]
              "
            >
              {formatTrackTitle(
                props.title,
                props.is_explicit
              )}
            </h3>
          </Link>


          <p
            className="
              mt-0.5
              truncate
              text-[10px]
              text-zinc-600
            "
          >
            {props.artist}
          </p>


          {/* MOBILE META */}
          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-1.5
              md:hidden
            "
          >
            <span
              className="
                rounded-full
                border
                border-[#B9FF00]/15
                bg-[#B9FF00]/[0.05]
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-[#B9FF00]
              "
            >
              {formatCurrency(
                props.price
              )}
            </span>


            <span
              className={`
                rounded-full
                border
                px-2
                py-0.5
                text-[9px]
                font-semibold
                uppercase
                tracking-wider

                ${isVideo
                  ? `
                        border-pink-400/20
                        bg-pink-400/10
                        text-pink-300
                      `
                  : `
                        border-[#B9FF00]/20
                        bg-[#B9FF00]/10
                        text-[#B9FF00]
                      `
                }
              `}
            >
              {isVideo
                ? "Video"
                : "Audio"}
            </span>


            {props.is_disabled && (
              <span
                className="
                  rounded-full
                  border
                  border-red-500/20
                  bg-red-500/[0.08]
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  uppercase
                  text-red-400
                "
              >
                Disabled
              </span>
            )}
          </div>
        </div>


        {/* =================================================
            KEY
        ================================================= */}
        <div
          className="
            hidden
            items-center
            justify-center
            md:flex
          "
        >
          <span
            className="
              rounded-md
              border
              border-[#B9FF00]/20
              bg-[#B9FF00]/10
              px-2.5
              py-1
              text-[11px]
              font-bold
              text-[#B9FF00]
            "
          >
            {props.in_key ?? "--"}
          </span>
        </div>


        {/* =================================================
            BPM
        ================================================= */}
        <div
          className="
            hidden
            items-center
            justify-center
            md:flex
          "
        >
          <span
            className="
              text-xs
              font-semibold
              text-zinc-400
            "
          >
            {props.bpm_start}
          </span>
        </div>


        {/* =================================================
            GENRE
        ================================================= */}
        <div
          className="
            hidden
            min-w-0
            items-center
            md:flex
          "
        >
          <span
            className="
              min-w-0
              truncate
              text-xs
              font-medium
              text-zinc-500
            "
          >
            {
              props.genre_track[0]
                ?.genre.name
            }

            {Number(
              props.genre_track?.length
            ) > 1 && (
                <MoreDetailsGenreTooltip
                  genre_track={
                    props.genre_track
                  }
                />
              )}
          </span>
        </div>


        {/* =================================================
            TYPE
        ================================================= */}
        <div
          className="
            hidden
            items-center
            md:flex
          "
        >
          <span
            className={`
              rounded-full
              border
              px-2
              py-1
              text-[9px]
              font-semibold
              uppercase
              tracking-wider

              ${isVideo
                ? `
                      border-pink-400/20
                      bg-pink-400/10
                      text-pink-300
                    `
                : `
                      border-[#B9FF00]/20
                      bg-[#B9FF00]/10
                      text-[#B9FF00]
                    `
              }
            `}
          >
            {isVideo
              ? "Video"
              : "Audio"}
          </span>
        </div>


        {/* =================================================
            PRICE / STATUS
        ================================================= */}
        <div
          className="
            hidden
            flex-col
            items-center
            justify-center
            gap-1
            md:flex
          "
        >
          <span
            className="
              text-xs
              font-semibold
              tabular-nums
              text-zinc-300
            "
          >
            {props._count.downloadTrack}
          </span>


          {props.is_disabled && (
            <span
              className="
                rounded-full
                border
                border-red-500/20
                bg-red-500/[0.07]
                px-2
                py-0.5
                text-[8px]
                font-semibold
                uppercase
                tracking-wider
                text-red-400
              "
            >
              Disabled
            </span>
          )}
        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-end
            gap-1
          "
        >
          <AdminTrackUpdateUploadedForm
            id={props.id}
          />

          <AdminAlertTrackDeleteComponent
            id={props.id}
          />

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
            "
          >
            <DownloadTrackFreeComponent
              id={
                String(
                  props.id
                )
              }
            />
          </div>
        </div>
      </div>


      {/* =====================================================
          MOBILE BOTTOM META
      ===================================================== */}
      <div
        className="
          flex
          items-center
          gap-3
          border-t
          border-white/[0.05]
          px-4
          py-2
          md:hidden
        "
      >
        <span
          className="
            text-[9px]
            uppercase
            tracking-wider
            text-zinc-600
          "
        >
          {props.in_key ?? "--"}
        </span>


        <span
          className="
            h-1
            w-1
            rounded-full
            bg-zinc-700
          "
        />


        <span
          className="
            text-[9px]
            uppercase
            tracking-wider
            text-zinc-600
          "
        >
          {props.bpm_start} BPM
        </span>


        <span
          className="
            h-1
            w-1
            rounded-full
            bg-zinc-700
          "
        />


        <span
          className="
            truncate
            text-[9px]
            uppercase
            tracking-wider
            text-zinc-600
          "
        >
          {
            props.genre_track[0]
              ?.genre.name
          }
        </span>
      </div>
    </div>
  )
}


export default AdminPublishedItem


const keyData = [
  {
    id: 100,
    name: '--',
    color: '#000000',
    textColor: '#FFFFFF'
  },
  {
    id: 1,
    name: '1A',
    color: '#60F5D7',
    textColor: '#000000'
  },
  {
    id: 2,
    name: '1B',
    color: '#21ECBF',
    textColor: '#000000'
  },
  {
    id: 3,
    name: '2A',
    color: '#7DF5A3',
    textColor: '#000000'
  },
  {
    id: 4,
    name: '2B',
    color: '#3AF06D',
    textColor: '#000000'
  },
  {
    id: 5,
    name: '3A',
    color: '#ABF983',
    textColor: '#000000'
  },
  {
    id: 6,
    name: '3B',
    color: '#7AF53F',
    textColor: '#000000'
  },
  {
    id: 7,
    name: '4A',
    color: '#FED97E',
    textColor: '#000000'
  },
  {
    id: 8,
    name: '4B',
    color: '#FEC139',
    textColor: '#000000'
  },
  {
    id: 9,
    name: '5A',
    color: '#FDB9A0',
    textColor: '#000000'
  },
  {
    id: 10,
    name: '5B',
    color: '#FC8D6A',
    textColor: '#000000'
  },
  {
    id: 11,
    name: '6A',
    color: '#FDA6B1',
    textColor: '#000000'
  },
  {
    id: 12,
    name: '6B',
    color: '#FC7182',
    textColor: '#000000'
  },
  {
    id: 13,
    name: '7A',
    color: '#FDA0C7',
    textColor: '#000000'
  },
  {
    id: 14,
    name: '7B',
    color: '#FC67A5',
    textColor: '#000000'
  },
  {
    id: 15,
    name: '8A',
    color: '#F0A1E2',
    textColor: '#000000'
  },
  {
    id: 16,
    name: '8B',
    color: '#E768D1',
    textColor: '#000000'
  },
  {
    id: 17,
    name: '9A',
    color: '#D9A9FE',
    textColor: '#000000'
  },
  {
    id: 18,
    name: '9B',
    color: '#C075FF',
    textColor: '#000000'
  },
  {
    id: 19,
    name: '10A',
    color: '#B8C8FE',
    textColor: '#000000'
  },
  {
    id: 20,
    name: '10B',
    color: '#8EA5FF',
    textColor: '#000000'
  },
  {
    id: 21,
    name: '11A',
    color: '#8BE4F9',
    textColor: '#000000'
  },
  {
    id: 22,
    name: '11B',
    color: '#4BD1F8',
    textColor: '#000000'
  },
  {
    id: 23,
    name: '12A',
    color: '#5EF3EF',
    textColor: '#000000'
  },
  {
    id: 24,
    name: '12B',
    color: '#20EAE6',
    textColor: '#000000'
  },
]