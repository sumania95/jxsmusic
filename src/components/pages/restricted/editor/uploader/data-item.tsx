import React from 'react'
import { useAtom } from 'jotai'
import { playerState, playlist } from '@/state/globalState'
import formatDuration from 'format-duration'
import {
  RiPauseLargeFill,
  RiPlayLargeFill
} from 'react-icons/ri'
import { api } from '@/utils/api'
import AlertTrackDeleteComponent from './helper/track-delete'
import Link from 'next/link'
import {
  CalendarDays,
  Clock3,
  PenBox
} from 'lucide-react'


interface Props {
  index_key: number,
  id: string,
  download_key: string | null,
  title: string | null,
  artist: string | null,
  filename: string | null,
  description: string | null,
  duration: number,
  bpm_start: number,
  in_key: string | null;
  bpm_end: number,
  releaseAt: Date,
  playlist: {
    id: string,
    index: number,
    title: string,
    artist: string,
    version: string,
    key: string,
    isFull: boolean,
  }[] | null
  postNumber: number
}


const TrackUploadedItemComponent = (props: Props) => {
  const [state, setState] = useAtom(playerState)

  const { mutateAsync: signSource } =
    api.signedUrl.signUrlKeyBucket.useMutation()

  const [, setData] = useAtom(playlist)


  const playButton = async () => {
    if (state.id === String(props?.id)) {
      setState({
        ...state,
        playing: true
      })
    } else {
      // const previewLink = await preview({
      //     id:String(props?.id)
      // })

      setState({
        ...state,
        next: true
      })

      const source = await signSource({
        id: String(props.id),
        key: `${String(props.download_key)}`,
        bucketName: "jxs-music"
      })

      setState({
        ...state,
        id: String(props?.id),
        source: String(source.url),
        playing: true,
        next: false
      })

      setData(props.playlist!)
    }
  }


  const keyColor =
    keyData.find(
      (item) => item.name === props.in_key
    )?.color


  return (
    <div
      className="
        group
        relative
        flex
        h-auto
        w-full
        items-center
        gap-3
        px-3
        py-3
        text-zinc-300
        md:min-h-16
        md:px-4
      "
    >
      {/* =====================================================
          LEFT HOVER ACCENT
      ===================================================== */}
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
          shadow-[0_0_8px_rgba(185,255,0,0.35)]
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      />


      {/* =====================================================
          PLAY / NUMBER
      ===================================================== */}
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-white/[0.07]
          bg-white/[0.025]
          transition-all
          duration-200
          group-hover:border-[#B9FF00]/20
          group-hover:bg-[#B9FF00]/[0.05]
        "
      >
        {state.playing && state.id === String(props.id) ? (
          <RiPauseLargeFill
            onClick={() => {
              setState({
                ...state,
                playing: false
              })
            }}
            className="
              h-5
              w-5
              cursor-pointer
              text-[#B9FF00]
            "
          />
        ) : (
          <div className="group/play flex h-full w-full items-center justify-center">
            {/* NUMBER */}
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                group-hover/play:hidden
              "
            >
              <h3
                className="
                  text-[11px]
                  font-semibold
                  tabular-nums
                  text-zinc-500
                "
              >
                {props.postNumber}
              </h3>
            </div>

            {/* PLAY */}
            <div
              className="
                hidden
                h-full
                w-full
                items-center
                justify-center
                group-hover/play:flex
              "
            >
              <RiPlayLargeFill
                onClick={playButton}
                className="
                  h-5
                  w-5
                  cursor-pointer
                  text-[#B9FF00]
                "
              />
            </div>
          </div>
        )}
      </div>


      {/* =====================================================
          MAIN INFO
      ===================================================== */}
      <div
        className="
          grid
          min-w-0
          flex-1
          grid-cols-1
          items-center
          gap-3
          md:grid-cols-[minmax(0,1fr)_100px_130px_100px]
        "
      >
        {/* TRACK */}
        <div className="min-w-0">
          <h3
            className="
              truncate
              text-sm
              font-semibold
              text-zinc-200
            "
          >
            {props.filename?.replaceAll(
              " [CLEAN]",
              ""
            )
              .replaceAll(
                " [DIRTY]",
                ""
              )}
          </h3>

          <div
            className="
              mt-1
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
            "
          >
            <span
              className="
                flex
                items-center
                gap-1.5
                text-[10px]
                text-zinc-400
              "
            >
              <Clock3 className="h-3 w-3" />

              Duration :{' '}
              {formatDuration(
                Number(props.duration) * 1000,
                {
                  leading: true
                }
              )}
            </span>

            {/* MOBILE DATE */}
            <span
              className="
                flex
                items-center
                gap-1.5
                text-[10px]
                text-zinc-400
                md:hidden
              "
            >
              <CalendarDays className="h-3 w-3" />

              {new Date(
                props.releaseAt
              ).toLocaleDateString(
                "en-us",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }
              )}
            </span>
          </div>
        </div>


        {/* =================================================
            KEY
        ================================================= */}
        <div className="hidden items-center md:flex">
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                flex
                h-7
                min-w-[46px]
                items-center
                justify-center
                rounded-lg
                px-2
                text-[10px]
                font-bold
                text-black
                shadow-sm
              "
              style={{
                backgroundColor: keyColor
              }}
            >
              {props.in_key}
            </span>
          </div>

          {/* read only */}
          <span className='sr-only bg-[#FFFFFF] text-[#FFFFFF]'>--</span>
          <span className='sr-only bg-[#60F5D7]'>1A</span>
          <span className='sr-only bg-[#21ECBF]'>1B</span>
          <span className='sr-only bg-[#7DF5A3]'>2A</span>
          <span className='sr-only bg-[#3AF06D]'>2B</span>
          <span className='sr-only bg-[#ABF983]'>3A</span>
          <span className='sr-only bg-[#7AF53F]'>3B</span>
          <span className='sr-only bg-[#FED97E]'>4A</span>
          <span className='sr-only bg-[#FEC139]'>4B</span>
          <span className='sr-only bg-[#FDB9A0]'>5A</span>
          <span className='sr-only bg-[#FC8D6A]'>5B</span>
          <span className='sr-only bg-[#FDA6B1]'>6A</span>
          <span className='sr-only bg-[#FC7182]'>6B</span>
          <span className='sr-only bg-[#FDA0C7]'>7A</span>
          <span className='sr-only bg-[#FC67A5]'>7B</span>
          <span className='sr-only bg-[#F0A1E2]'>8A</span>
          <span className='sr-only bg-[#E768D1]'>8B</span>
          <span className='sr-only bg-[#D9A9FE]'>9A</span>
          <span className='sr-only bg-[#C075FF]'>9B</span>
          <span className='sr-only bg-[#B8C8FE]'>10A</span>
          <span className='sr-only bg-[#8EA5FF]'>10B</span>
          <span className='sr-only bg-[#8BE4F9]'>11A</span>
          <span className='sr-only bg-[#4BD1F8]'>11B</span>
          <span className='sr-only bg-[#5EF3EF]'>12A</span>
          <span className='sr-only bg-[#20EAE6]'>12B</span>
          {/* read only */}
        </div>


        {/* =================================================
            DATE
        ================================================= */}
        <div
          className="
            hidden
            items-center
            gap-2
            lg:flex
          "
        >
          <CalendarDays className="h-3.5 w-3.5 text-zinc-500" />

          <h3
            className="
              text-[10px]
              text-zinc-400
            "
          >
            {new Date(
              props.releaseAt
            ).toLocaleDateString(
              "en-us",
              {
                year: "numeric",
                month: "short",
                day: "numeric"
              }
            )}
          </h3>
        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}
        <div
          className="
            flex
            items-center
            justify-end
            gap-2
          "
        >
          {/* EDIT */}
          <Link
            href={`/restricted/editor/uploader/${props.id}`}
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
              text-zinc-400
              transition-all
              hover:border-[#B9FF00]/20
              hover:bg-[#B9FF00]/[0.07]
              hover:text-[#B9FF00]
            "
          >
            <PenBox className="h-4 w-4" />
          </Link>
          <AlertTrackDeleteComponent
            id={props.id}
            objectKey={String(props.download_key)}
            bucketName={"jxs-music"}
          />
        </div>
      </div>
    </div>
  )
}


export default TrackUploadedItemComponent



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