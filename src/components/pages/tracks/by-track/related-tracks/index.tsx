import LoadingSkeletonComponents from '@/components/pages/common/loading-skeleton'
import { defaultPageLimit } from '@/state/globalState'
import { api } from '@/utils/api'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import React from 'react'
import EmptyComponent from '@/components/pages/common/empty'
import PaginationNewComponents from '@/components/common/pagination-new'
import TrackItemComponent from '@/components/pages/common/data-item'
import { parseAsInteger, useQueryState } from 'nuqs'
import { buildPlaylist } from '@/constant/helperPlaylist'
import TrackListHeader from '@/components/pages/common/track-header'
import { motion, useReducedMotion } from "framer-motion";
import { useSession } from 'next-auth/react'
import { LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { useTrackColumns } from '@/components/pages/common/header-filter'

const TrackDetailRelatedComponent = () => {
  const router = useRouter()
  const { data: session } = useSession();
  const {
      visibleColumns,
      toggleColumn,
      resetColumns,
    } = useTrackColumns()
  const reduceMotion = useReducedMotion();
  const trackId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id

  const itemSkeleton: number[] = Array.from(
    { length: 8 },
    (_, index) => index + 1
  )

  const [defaultLimit] = useAtom(defaultPageLimit)

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  {/* =====================================================
      CURRENT TRACK
  ===================================================== */}

  const {
    data: getTrack,
    isLoading: isTrackLoading,
  } = api.track.getIdMain.useQuery(
    {
      id: String(trackId),
    },
    {
      enabled: !!trackId,
    }
  )

  {/* =====================================================
      RELATED TRACKS
  ===================================================== */}
  const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })

  const {
    data: track,
    isLoading: isRelatedLoading,
  } = api.trackRelated.getAll.useQuery(
    {
      spotifyId: getTrack?.spotify_track
        ? getTrack.spotify_track.map(
          (item) => item.spotify.spotifyId
        )
        : [],
      skip: Number(Number(pager) * limit - limit),
      take: limit,
      id: trackId ?? "",
    },
    {
      enabled: !!trackId && !!getTrack,
    }
  )

  const isLoading = isTrackLoading || isRelatedLoading

  return (
    <div className="w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          gap-3
          rounded-xl
          border
          border-white/10
          bg-white/[0.02]
          px-4
          py-3
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#B9FF00]
              shadow-[0_0_8px_rgba(185,255,0,0.7)]
            "
          />

          <div>
            <h3
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Related Tracks
            </h3>

            <p
              className="
                mt-0.5
                text-[9px]
                uppercase
                tracking-wider
                text-zinc-600
              "
            >
              Tracks related to this release
            </p>
          </div>
        </div>

        {!isLoading &&
          track?.count?._count?.id !== undefined && (
            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-700
              "
            >
              {track.count._count.id} Tracks
            </span>
          )}
      </div>
      {/* Track list header */}
      <TrackListHeader 
        visibleColumns={visibleColumns}
      />
      {/* =====================================================
          TRACK LIST
      ===================================================== */}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-0.5 w-full">

          {/* Loading */}
          {isLoading &&
            itemSkeleton.map((_, index) => (
              <LoadingSkeletonComponents
                key={index}
                className="
                  h-16
                  w-full
                  rounded-lg
                  bg-white/[0.025]
                "
              />
            ))}

          {/* Empty */}
          {!isLoading &&
            track?.count._count.id === 0 && (
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  py-10
                "
              >
                <EmptyComponent />
              </div>
            )}

          {/* Related tracks */}
          {!isLoading &&
            track?.tracks.map((trackItem, index) => (
              <TrackItemComponent
                {...trackItem}
                key={trackItem.id ?? index}
                index_key={index}
                id={trackItem.id}
                price={Number(trackItem.price)}
                playlist={buildPlaylist(track.tracks)}
                credits={credits?.credit ?? 0}
                visibleColumns={visibleColumns}
              />
            ))}
        </div>

        {/* Pagination */}
        {session?.user ? (
          <div className="mt-8 flex justify-center rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
            <PaginationNewComponents
              totalItems={Number(track?.count._count.id) ?? 0}
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
    </div>
  )
}

export default TrackDetailRelatedComponent