import ImageThumbnailComponent from '@/components/common/image-thumbnail'
import { formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  key: number
  index_key: number
  id: string
  track: {
    id: string
    title: string | null
    releaseAt: Date
  }[]
  image: string | null
  username: string | null
  _count: {
    track: number
  }
}

const EditorItemComponent = (props: Props) => {
  return (
    <Link
      href={`/editors/${props.id}`}
      className="
        group
        relative
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.02]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#B9FF00]/30
        hover:bg-white/[0.04]
        hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}
      <div
        className="
          relative
          aspect-square
          w-full
          overflow-hidden
          bg-zinc-950
        "
      >
        <div
          className="
            h-full
            w-full
            transition-transform
            duration-500
            group-hover:scale-[1.03]
          "
        >
          <ImageThumbnailComponent
            image={String(props.image)}
            rounded={false}
          />
        </div>

        {/* Image gradient */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-linear-to-t
            from-black/80
            via-black/30
            to-transparent
          "
        />

        {/* Track count */}
        <div
          className="
            absolute
            right-3
            top-3
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/10
            bg-[#111518]/70
            px-2.5
            py-1.5
            backdrop-blur-md
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#B9FF00]
              shadow-[0_0_8px_rgba(185,255,0,0.7)]
            "
          />

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-wider
              text-zinc-300
            "
          >
            {props._count.track} Tracks
          </span>
        </div>
      </div>

      {/* =====================================================
          EDITOR NAME
      ===================================================== */}
      <div
        className="
          border-b
          border-white/5
          px-4
          py-3.5
        "
      >
        <div className="mb-1 flex items-center gap-2">
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#B9FF00]
              opacity-70
            "
          />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-zinc-600
            "
          >
            Jeff92 & Ayan Sumania Editor
          </span>
        </div>

        <h3
          className="
            truncate
            text-sm
            font-semibold
            text-zinc-200
            transition-colors
            duration-200
            group-hover:text-[#B9FF00]
          "
        >
          {props.username}
        </h3>
      </div>

      {/* =====================================================
          METADATA
      ===================================================== */}
      <div className="flex flex-col px-4 py-3">
        {/* Total tracks */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/5
            py-2
          "
        >
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            Total Tracks
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-zinc-300
            "
          >
            {props._count.track}
          </span>
        </div>

        {/* Last upload */}
        <div
          className="
            flex
            items-center
            justify-between
            py-2
          "
        >
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            Last Upload
          </span>

          <span
            className="
              text-[10px]
              font-medium
              text-zinc-400
            "
          >
            {props.track[0]?.releaseAt
              ? formatDateShort(
                  String(props.track[0]?.releaseAt)
                )
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ACTIVE LINE
      ===================================================== */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-px
          w-0
          -translate-x-1/2
          bg-[#B9FF00]
          transition-all
          duration-300
          group-hover:w-2/3
          group-hover:shadow-[0_0_10px_rgba(185,255,0,0.5)]
        "
      />
    </Link>
  )
}

export default EditorItemComponent