import React from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import { Music2 } from 'lucide-react'


type Props = {
  index_key: number
  id: string
  slug: string
  name: string | null
  artist: string | null
  image: string | null
  price: number
  user: {
    image: string | null
    id: string
  }
  _count: {
    trackAlbum: number
  }
}


const MultiPackItemComponent = (
  props: Props
) => {
  return (
    <Link
      href={`/multi-packs/${props.slug}`}
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
        hover:border-[#B9FF00]/20
        hover:bg-white/[0.035]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]
      "
    >
      {/* =====================================================
          COVER
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
        <Avatar
          className="
            h-full
            w-full
            rounded-none
            border-0
          "
        >
          <AvatarImage
            src={String(
              props.image ??
              props.user.image
            )}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.035]
            "
          />

          <AvatarFallback
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              rounded-none
              bg-zinc-950
              text-zinc-700
            "
          >
            <Music2 className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>


        {/* IMAGE OVERLAY */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/80
            via-transparent
            to-transparent
          "
        />


        {/* TRACK COUNT */}
        <div
          className="
            absolute
            right-3
            top-3
            flex
            items-center
            gap-2
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
              tracking-[0.1em]
              text-zinc-300
            "
          >
            {props._count.trackAlbum} edits
          </span>
        </div>


        {/* PRICE ON IMAGE */}
        <div
          className="
            absolute
            bottom-3
            left-3
            rounded-xl
            border
            border-[#B9FF00]/15
            bg-[#111518]/70
            px-3
            py-2
            backdrop-blur-md
          "
        >
          <span
            className="
              text-sm
              font-bold
              tabular-nums
              text-[#B9FF00]
            "
          >
            {formatCurrency(
              props.price
            )}
          </span>
        </div>
      </div>


      {/* =====================================================
          INFO
      ===================================================== */}
      <div
        className="
          relative
          flex
          flex-col
          gap-1
          px-4
          py-4
        "
      >
        <div
          className="
            mb-1
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-[#B9FF00]
            "
          />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-zinc-600
            "
          >
            Jeff92 & Ayan Sumania Multipack
          </span>
        </div>


        <h3
          className="
            truncate
            text-sm
            font-semibold
            text-zinc-200
            transition-colors
            group-hover:text-[#B9FF00]
          "
        >
          {props.name}
        </h3>


        {props.artist && (
          <p
            className="
              truncate
              text-[10px]
              text-zinc-600
            "
          >
            {props.artist}
          </p>
        )}


        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            border-t
            border-white/[0.06]
            pt-3
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-zinc-600
            "
          >
            {props._count.trackAlbum} Tracks
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-zinc-300
            "
          >
            {formatCurrency(
              props.price
            )}
          </span>
        </div>
      </div>


      {/* =====================================================
          BOTTOM ACCENT
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


export default MultiPackItemComponent