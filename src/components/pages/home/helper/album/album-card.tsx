import Image from "next/image"
import Link from "next/link"
import { Music2 } from "lucide-react"


interface Props {
  name: string | null
  id: string
  user: {
    id: string
    image: string | null
  }
  image: string | null
  price: number
  slug: string
  artist: string | null
  _count: {
    trackAlbum: number
  }
}


export function AlbumCard(props: Props) {
  return (
    <Link
      href={`/multi-packs/${props.slug}`}
      className="
        group
        relative
        flex
        w-full
        cursor-pointer
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
        <Image
          src={
            props.image ??
            props.user.image ??
            "/placeholder.png"
          }
          alt={props.name ?? "Album"}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-[1.035]
          "
        />

        {/* IMAGE GRADIENT */}
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


        {/* PRICE */}
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
            {Number(props.price / 100).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )}
          </span>
        </div>
      </div>


      {/* =====================================================
          INFO
      ===================================================== */}
      <div className="flex flex-col px-4 py-4">
        <div className="mb-2 flex items-center gap-2">
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


        <p
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
          {props.name}
        </p>


        <p
          className="
            mt-1
            truncate
            text-[10px]
            text-zinc-600
          "
        >
          {props.artist}
        </p>


        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-white/[0.06]
            pt-3
          "
        >
          <div className="flex items-center gap-2">
            <Music2 className="h-3.5 w-3.5 text-zinc-600" />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.1em]
                text-zinc-600
              "
            >
              {props._count.trackAlbum} tracks
            </span>
          </div>


          <span
            className="
              text-xs
              font-semibold
              tabular-nums
              text-zinc-300
            "
          >
            {Number(props.price / 100).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
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