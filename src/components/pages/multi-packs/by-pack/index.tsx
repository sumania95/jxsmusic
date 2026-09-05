import React from 'react'
import BannerTitleComponent from '@/components/common/banner-title'
import { api } from '@/utils/api'
import { formatCurrency } from '@/lib/utils'
import LoadingSkeletonComponents from '../../common/loading-skeleton'
import EmptyComponent from '../../common/empty'
import TrackItemComponent from '../../common/data-item'
import AddCartMultiPackComponent from './add-cart'
import Link from 'next/link'
import {
  ArrowLeft,
  BadgePercent,
  Disc3,
  Music2,
  UserRound,
} from 'lucide-react'
import { buildAlbumPlaylist } from '@/constant/helperPlaylist'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useAtom } from 'jotai'
import { defaultPageLimit } from '@/state/globalState'
import PaginationNewComponents from '@/components/common/pagination-new'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import Image from 'next/image'
import TrackListHeader from '../../common/track-header'
import { motion, useReducedMotion } from "framer-motion";
import { useSession } from 'next-auth/react'
import { LockKeyhole } from 'lucide-react'

interface Props {
  name: string | null;
  id: string;
  slug: string;
  user: {
    id: string;
    image: string | null;
    username: string | null;
  };
  image: string | null;
  price: number;
  artist: string | null;
}


const MultiPackDetailComponent = (props: Props) => {
  const [defaultLimit] =
    useAtom(defaultPageLimit)
  const { data: session } = useSession();
  const reduceMotion = useReducedMotion();
  const itemSkeleton: number[] =
    Array.from(
      { length: defaultLimit },
      (_, index) => index + 1
    )

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })

  const {
    data: album,
    isLoading
  } = api.album.getIdFull.useQuery({
    slug: String(props.slug),
    skip: Number(
      Number(pager) * limit - limit
    ),
    take: limit,
  })


  const totalTrackPrice =
    album?.album.reduce(
      (sum, item) => {
        return (
          sum +
          Number(item.track.price ?? 0)
        )
      },
      0
    ) ?? 0


  const albumPrice =
    Number(props.price ?? 0)


  const saveAmount =
    totalTrackPrice - albumPrice


  const savePercent =
    totalTrackPrice > 0
      ? (
        saveAmount /
        totalTrackPrice
      ) * 100
      : 0


  const hasSavings =
    saveAmount > 0


  return (
    <div className="flex w-full flex-col gap-5">
      {/* =====================================================
          BACK
      ===================================================== */}
      <div className="pt-5">
        <Link
          href="/multi-packs"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.02]
            px-3
            py-2
            text-[10px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-zinc-500
            transition-all
            hover:border-[#B9FF00]/20
            hover:bg-[#B9FF00]/[0.04]
            hover:text-[#B9FF00]
          "
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back To Multi Packs
        </Link>
      </div>


      {/* =====================================================
          TITLE
      ===================================================== */}
      <BannerTitleComponent
        title={
          isLoading
            ? "Loading..."
            : props.name ?? "Loading..."
        }
        description={
          props.artist ?? "Loading..."
        }
      />


      {/* =====================================================
          ALBUM INFORMATION
      ===================================================== */}
      <section
        className="
          relative
          grid
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          lg:grid-cols-[380px_minmax(0,1fr)]
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-140px]
            top-[-160px]
            h-[380px]
            w-[380px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[110px]
          "
        />


        {/* =================================================
            COVER
        ================================================= */}
        <div
          className="
            relative
            flex
            items-center
            justify-center
            border-b
            border-white/[0.06]
            bg-[#111518]/20
            p-5
            lg:border-b-0
            lg:border-r
            lg:p-6
          "
        >
          <div
            className="
              relative
              aspect-square
              w-full
              max-w-[360px]
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.08]
              bg-zinc-950
              shadow-2xl
            "
          >
            <Avatar
              className="
                h-full
                w-full
                rounded-none
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
                "
              >
                <Image
                  src="/images/jeff92-ayan-brand-mark.svg"
                  alt="Logo"
                  width={1080}
                  height={1080}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </AvatarFallback>
            </Avatar>


            {/* subtle overlay */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-linear-to-t
                from-black/30
                via-transparent
                to-transparent
              "
            />
          </div>
        </div>


        {/* =================================================
            DETAILS
        ================================================= */}
        <div
          className="
            relative
            flex
            min-w-0
            flex-col
            justify-between
            gap-6
            p-5
            sm:p-6
            lg:p-8
          "
        >
          <div>
            {/* Label */}
            <div className="mb-4 flex items-center gap-2">
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
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Multipack
              </span>
            </div>


            {/* Album title */}
            <div>
              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                  text-zinc-100
                  sm:text-2xl
                "
              >
                {props.name}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-zinc-500
                "
              >
                {props.artist}
              </p>


              <div
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-3
                  py-2
                "
              >
                <Music2 className="h-3.5 w-3.5 text-[#B9FF00]" />

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-zinc-500
                  "
                >
                  {album?.count._count.id} edits
                </span>
              </div>
            </div>


            {/* =================================================
                CONTRIBUTOR
            ================================================= */}
            <div
              className="
                mt-6
                border-t
                border-white/[0.06]
                pt-5
              "
            >
              <p
                className="
                  mb-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Contributor
              </p>

              <Link
                href={`/editors/${props.user.id}`}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  p-2
                  pr-4
                  transition-all
                  hover:border-[#B9FF00]/15
                  hover:bg-[#B9FF00]/[0.03]
                "
              >
                <Avatar
                  className="
                    h-10
                    w-10
                    rounded-xl
                    border
                    border-white/[0.07]
                  "
                >
                  <AvatarImage
                    src={String(
                      props.user.image
                    )}
                    className="
                      rounded-xl
                      object-cover
                    "
                  />

                  <AvatarFallback
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      bg-zinc-900
                    "
                  >
                    <Image
                      src="/images/jeff92-ayan-brand-mark.svg"
                      alt="Logo"
                      width={1080}
                      height={1080}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.1em]
                      text-zinc-600
                    "
                  >
                    DJ / Editor
                  </p>

                  <h3
                    className="
                      text-xs
                      font-semibold
                      text-zinc-300
                      transition-colors
                      group-hover:text-[#B9FF00]
                    "
                  >
                    {props.user.username}
                  </h3>
                </div>
              </Link>
            </div>
          </div>


          {/* =================================================
              PRICE
          ================================================= */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#111518]/20
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-zinc-600
                  "
                >
                  Multipack Price
                </p>

                <div
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tabular-nums
                    text-[#B9FF00]
                  "
                >
                  {formatCurrency(
                    props.price
                  )}
                </div>
              </div>


              {hasSavings && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-green-500/10
                    bg-green-500/[0.04]
                    px-3
                    py-2.5
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-green-500/10
                      text-green-400
                    "
                  >
                    <BadgePercent className="h-4 w-4" />
                  </div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.1em]
                        text-green-500/60
                      "
                    >
                      You Save
                    </p>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-green-400
                      "
                    >
                      {formatCurrency(saveAmount)}
                      {" "}
                      ({savePercent.toFixed(0)}% discount)
                    </p>
                  </div>
                </div>
              )}
            </div>


            {/* CART */}
            <div
              className="
                border-t
                border-white/[0.06]
                p-4
              "
            >
              <AddCartMultiPackComponent
                trackId={null}
                albumId={String(props.id)}
                price={Number(props.price)}
                id={String(props.user.id)}
              />
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          TRACK LIST
      ===================================================== */}
      <section
        className="
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#B9FF00]/10
                text-[#B9FF00]
              "
            >
              <Disc3 className="h-4 w-4" />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-semibold
                  text-zinc-100
                "
              >
                Multipack Tracks
              </h3>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Included edits & remixes
              </p>
            </div>
          </div>


          {!isLoading &&
            Number(
              album?.count._count.id
            ) > 0 && (
              <span
                className="
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-3
                  py-1
                  text-[10px]
                  font-medium
                  text-zinc-500
                "
              >
                {album?.count._count.id}
              </span>
            )
          }
        </div>


        {/* TRACKS */}
        <div
          className="
            flex
            w-full
            flex-col
            gap-2
            p-2
            sm:p-3
          "
        >
          {isLoading &&
            itemSkeleton.map(
              (_, index) => (
                <LoadingSkeletonComponents
                  key={index}
                  className="
                    h-16
                    w-full
                    rounded-2xl
                  "
                />
              )
            )
          }
          {/* Track list header */}
          <TrackListHeader />

          {album?.count._count.id === 0 && (
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
                p-5
              "
            >
              <EmptyComponent />
            </div>
          )}


          {album?.album.map(
            (item, index) => (
              <div
                key={index}
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
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    z-10
                    h-7
                    w-0.5
                    -translate-y-1/2
                    rounded-full
                    bg-[#B9FF00]
                    opacity-0
                    shadow-[0_0_8px_rgba(185,255,0,0.35)]
                    transition-opacity
                    group-hover:opacity-100
                  "
                />

                <TrackItemComponent
                  {...item.track}
                  index_key={index}
                  id={item.track.id}
                  price={Number(
                    item.track.price
                  )}
                  playlist={
                    buildAlbumPlaylist(
                      album.album
                    )
                  }
                  credits={credits?.credit ?? 0}
                />
              </div>
            )
          )}
        </div>


        {/* PAGINATION */}
        <div
          className="
            border-t
            border-white/[0.06]
            bg-[#111518]/10
            p-3
          "
        >
          {session?.user ? (
            <div className="mt-8 flex justify-center rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
              <PaginationNewComponents
                totalItems={Number(album?.count._count.id) ?? 0}
              />
            </div>
          ) : (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mt-8 rounded-2xl border border-[#B9FF00]/20 bg-[#171d20] px-5 py-5 text-center shadow-[0_16px_50px_rgba(0,0,0,0.28)]"
            >
              <LockKeyhole className="mx-auto h-5 w-5 text-[#B9FF00]" />
              <p className="mt-3 text-sm font-semibold text-white">
                Sign in to preview and view more tracks
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Create a free account to play previews and browse every page
                of the catalog.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 inline-flex rounded-xl bg-[#B9FF00] px-5 py-2.5 text-xs font-semibold text-black"
              >
                Sign in or create account
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}


export default MultiPackDetailComponent