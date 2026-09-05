import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import Image from 'next/image'
import {
  CheckCircle2,
  Clock3,
  Disc3,
  Music2,
  UserRound,
} from 'lucide-react'


interface Props {
  id: string
  email: string | null
  name: string | null
  image: string | null
  username: string | null
  is_uploader: boolean
  createdAt: Date
  totalTracks: number
  publishedTracks: number
  unpublishedTracks: number
}


const AdminUserItem = (props: Props) => {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-4
        px-4
        py-4
        sm:px-5
        lg:flex-row
        lg:items-center
      "
    >
      {/* =====================================================
          USER
      ===================================================== */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* AVATAR */}
        <div className="relative shrink-0">
          <Avatar
            className="
              h-12
              w-12
              rounded-xl
              border
              border-white/[0.08]
              bg-zinc-950
            "
          >
            <AvatarImage
              src={props.image ?? ''}
              className="object-cover"
            />

            <AvatarFallback className="rounded-xl bg-zinc-950">
              <Image
                src="/images/jeff92-ayan-brand-mark.svg"
                alt="Logo"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>

          {/* uploader indicator */}
          {props.is_uploader && (
            <div
              className="
                absolute
                -bottom-1
                -right-1
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border-2
                border-zinc-950
                bg-[#B9FF00]
                text-black
              "
            >
              <Music2 className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        {/* USER INFO */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                max-w-[220px]
                truncate
                text-sm
                font-semibold
                text-zinc-200
              "
            >
              {props.name ?? 'Unnamed User'}
            </span>

            {/* MOBILE ROLE */}
            <div className="sm:hidden">
              {props.is_uploader ? (
                <Badge
                  variant="outline"
                  className="
                    rounded-full
                    border-[#B9FF00]/20
                    bg-[#B9FF00]/[0.07]
                    px-2
                    py-0
                    text-[9px]
                    text-[#B9FF00]
                  "
                >
                  Uploader
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="
                    rounded-full
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-2
                    py-0
                    text-[9px]
                    text-zinc-500
                  "
                >
                  User
                </Badge>
              )}
            </div>
          </div>

          <span
            className="
              block
              max-w-[220px]
              truncate
              text-[11px]
              text-zinc-600
            "
          >
            @{props.username ?? 'no-username'}
          </span>

          {/* EMAIL */}
          <span
            className="
              mt-0.5
              block
              max-w-[260px]
              truncate
              text-[10px]
              text-zinc-700
            "
          >
            {props.email ?? 'No email'}
          </span>
        </div>
      </div>

      {/* =====================================================
          ROLE
      ===================================================== */}
      <div className="hidden w-[110px] shrink-0 sm:flex sm:justify-center">
        {props.is_uploader ? (
          <Badge
            variant="outline"
            className="
              gap-1.5
              rounded-full
              border-[#B9FF00]/20
              bg-[#B9FF00]/[0.07]
              px-3
              text-[10px]
              font-medium
              text-[#B9FF00]
            "
          >
            <Disc3 className="h-3 w-3" />
            Uploader
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="
              gap-1.5
              rounded-full
              border-white/[0.08]
              bg-white/[0.025]
              px-3
              text-[10px]
              font-medium
              text-zinc-500
            "
          >
            <UserRound className="h-3 w-3" />
            User
          </Badge>
        )}
      </div>

      {/* =====================================================
          TRACK STATS
      ===================================================== */}
      {props.is_uploader && (
        <div
          className="
            grid
            w-full
            grid-cols-3
            gap-2
            border-t
            border-white/[0.05]
            pt-3
            lg:w-auto
            lg:min-w-[330px]
            lg:border-l
            lg:border-t-0
            lg:pl-4
            lg:pt-0
          "
        >
          {/* PUBLISHED */}
          <div
            className="
              hidden
              min-w-[95px]
              items-center
              gap-2
              rounded-xl
              border
              border-green-400/10
              bg-green-400/[0.025]
              px-3
              py-2
              md:flex
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-green-400/10
                text-green-400
              "
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>

            <div className="flex flex-col">
              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                Pub
              </span>

              <span className="text-xs font-semibold tabular-nums text-zinc-300">
                {props.publishedTracks}
              </span>
            </div>
          </div>

          {/* UNPUBLISHED */}
          <div
            className="
              hidden
              min-w-[95px]
              items-center
              gap-2
              rounded-xl
              border
              border-orange-400/10
              bg-orange-400/[0.025]
              px-3
              py-2
              md:flex
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-orange-400/10
                text-orange-400
              "
            >
              <Clock3 className="h-3.5 w-3.5" />
            </div>

            <div className="flex flex-col">
              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.12em]
                  text-zinc-600
                "
              >
                Unpub
              </span>

              <span className="text-xs font-semibold tabular-nums text-zinc-300">
                {props.unpublishedTracks}
              </span>
            </div>
          </div>

          {/* TOTAL */}
          <div
            className="
              col-span-3
              flex
              min-w-[95px]
              items-center
              justify-between
              gap-2
              rounded-xl
              border
              border-[#B9FF00]/10
              bg-[#B9FF00]/[0.035]
              px-3
              py-2
              md:col-span-1
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#B9FF00]/10
                  text-[#B9FF00]
                "
              >
                <Music2 className="h-3.5 w-3.5" />
              </div>

              <div className="flex flex-col">
                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.12em]
                    text-zinc-600
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-xs
                    font-semibold
                    tabular-nums
                    text-[#B9FF00]
                  "
                >
                  {props.totalTracks}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NORMAL USER PLACEHOLDER
      ===================================================== */}
      {!props.is_uploader && (
        <div
          className="
            hidden
            min-w-[330px]
            items-center
            justify-end
            lg:flex
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.14em]
              text-zinc-700
            "
          >
            No uploaded tracks
          </span>
        </div>
      )}
    </div>
  )
}


export default AdminUserItem