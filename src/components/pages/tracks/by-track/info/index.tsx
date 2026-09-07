import LoadingSkeletonComponents from '@/components/pages/common/loading-skeleton'
import { playerState, playlist } from '@/state/globalState'
import { api } from '@/utils/api'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import React from 'react'
import { RiPauseLargeFill, RiPlayLargeFill } from 'react-icons/ri'
import AddCartComponent from '../../helper/add-cart'
import Link from 'next/link'
import ShareLink from '@/components/common/share-link'
import { formatCurrency, formatTrackTitle } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

const TrackDetailInfoComponent = () => {
  const [state, setState] = useAtom(playerState)
  const [, setData] = useAtom(playlist)
  const { data: session } = useSession();

  const router = useRouter()

  const trackId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id

  const { data: track, isLoading } = api.track.getIdMain.useQuery(
    {
      id: String(trackId),
    },
    {
      enabled: !!trackId,
    }
  )
      const { data: credits } = api.credits.balance.useQuery(undefined, { enabled: Boolean(session?.user) })
  
  const { mutateAsync: signSource } =
    api.signedUrl.signUrlKeyBucket.useMutation()

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
    if (state.id === String(trackId)) {
      setState({
        ...state,
        playing: true,
      })

      return
    }

    setState({
      ...state,
      next: true,
    })

    const source = await signSource({
      id: String(trackId),
      key: String(track?.preview_key),
      bucketName: 'jxs-music',
    })

    setState({
      ...state,
      id: String(trackId),
      source: String(source.url),
      playing: true,
      next: false,
    })

    setData([
      {
        id: String(trackId),
        index: 0,
        title: formatTrackTitle(
          String(track?.title),
          track?.is_explicit
        ),
        artist: String(track?.artist),
        key: String(track?.in_key),
        isFull: false,
        islink: String(track?.user.image),
      },
    ])
  }

  const isOpenParenthesis = String(track?.title?.trim()).includes('(')
  const explicit = `${track?.is_explicit ? 'Dirty' : 'Clean'}`

  if (isLoading) {
    return (
      <LoadingSkeletonComponents className="h-96 w-full rounded-2xl" />
    )
  }

  return (
    <div className="mt-3 flex w-full flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      {/* Main track row */}
      <div className="flex w-full items-center justify-between gap-4">

        {/* Play button */}
        <button
          type="button"
          onClick={
            state.playing && state.id === String(trackId)
              ? () =>
                  setState({
                    ...state,
                    playing: false,
                  })
              : playButton
          }
          className="
            flex shrink-0 items-center justify-center
            rounded-full
            border border-[#B9FF00]/30
            bg-[#B9FF00]
            p-1
            shadow-[0_0_20px_rgba(185,255,0,0.12)]
            transition-all
            hover:bg-[#B9FF00]
            hover:shadow-[0_0_25px_rgba(185,255,0,0.2)]
          "
        >
          {state.playing && state.id === String(trackId) ? (
            <RiPauseLargeFill
              className="
                h-6 w-6
                cursor-pointer
                text-zinc-950
                md:h-12 md:w-12
                lg:p-3
              "
            />
          ) : (
            <RiPlayLargeFill
              className="
                h-6 w-6
                cursor-pointer
                text-zinc-950
                md:h-12 md:w-12
                lg:p-3
              "
            />
          )}
        </button>

        {/* Track information */}
        <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
          <div className='flex min-w-0 items-center gap-2'>
            <h3 className="w-full truncate text-sm font-medium text-white">
              {track?.title}
            </h3>
            <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase leading-none ${track?.is_explicit ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}>{track?.is_explicit ? "Dirty" : "Clean"}</span>

          </div>
          <h3 className="w-full truncate text-sm text-zinc-400">
            {track?.artist}
          </h3>

          <h3 className="flex pt-1 text-sm font-bold text-[#B9FF00] md:hidden">
            {track?.price===0?"FREE":formatCurrency(track?.price)}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex w-14 shrink-0 flex-col items-end justify-end gap-2 lg:w-40 lg:flex-row lg:items-center lg:gap-2">
          <AddCartComponent
            trackId={String(track?.id)}
            albumId={null}
            price={Number(track?.price)}
            id={String(track?.user.id)}
            credits={credits?.credit ?? 0}
          />

          <div className="flex w-9 mr-2 lg:mr-o items-center justify-center">
            <ShareLink/>
          </div>
        </div>
      </div>

      {/* Track metadata */}
      <div className="flex w-full flex-wrap items-start gap-2">

        <div className="whitespace-nowrap rounded-sm border border-white/10 bg-white/[0.04] px-5 py-2 text-xs text-zinc-400">
          {track?.bpm_start} BPM
        </div>

        <div className="whitespace-nowrap rounded-sm border border-white/10 bg-white/[0.04] px-5 py-2 text-xs text-zinc-400">
          {track?.release_year}
        </div>

        <div className="whitespace-nowrap rounded-sm border border-white/10 bg-white/[0.04] px-5 py-2 text-xs text-zinc-400">
          {track?.in_key}
        </div>
      </div>

      {/* Genres / Tags */}
      <div className="flex w-full flex-wrap items-start gap-2">

        {track?.genre_track.map((item, index) => (
          <Link
            href={`/charts/genre/${item.genre.slug}`}
            key={index}
            className="
              whitespace-nowrap rounded-sm
              border border-[#B9FF00]/20
              bg-[#B9FF00]/[0.06]
              px-3 py-2
              text-xs text-[#B9FF00]
              transition-all
              hover:bg-[#B9FF00]
              hover:text-zinc-950
            "
          >
            {item.genre.name}
          </Link>
        ))}

        {track?.tag_track.map((item, index) => (
          <Link
            href={`/charts/tag/${item.tag.slug}`}
            key={index}
            className="
              whitespace-nowrap rounded-sm
              border border-white/10
              bg-white/[0.04]
              px-3 py-2
              text-xs text-zinc-400
              transition-all
              hover:border-[#B9FF00]/40
              hover:bg-[#B9FF00]/[0.06]
              hover:text-[#B9FF00]
            "
          >
            {item.tag.name}
          </Link>
        ))}
      </div>

      {/* Original work */}
      <div className="flex w-full flex-col items-start gap-4 border-t border-white/10 pt-5">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Original Work In This Composition
          </h3>

          <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
            Original tracks used in this remix
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-4">
          {track?.spotify_track.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-white/10 bg-[#111518]"
            >
              <iframe
                src={`https://open.spotify.com/embed/track/${item.spotify.spotifyId}`}
                width="300"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrackDetailInfoComponent