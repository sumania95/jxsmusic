import formatDuration from 'format-duration';
import React, { useEffect, useRef } from 'react'
import { api } from '@/utils/api';
import { playerState, playlist } from '@/state/globalState';
import { useAtom } from 'jotai';
import { useWavesurfer } from '@wavesurfer/react'
import { Loader2Icon, SkipBackIcon, SkipForwardIcon, X } from 'lucide-react';
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import VolumePlayer from './helper/volume';
import { RiPauseLargeFill, RiPlayLargeFill } from 'react-icons/ri';
import LoaderSVG from './helper/loader';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ImageThumbnailComponent from '../common/image-thumbnail';

declare global {
  interface Window {
    MSStream?: unknown;
  }
}

const MediaPlayerComponent = () => {
  const { mutateAsync: signSource } = api.signedUrl.signUrlKeyBucket.useMutation()
  const containerRef = useRef(null)
  // ✅ ADDED — shared media element for audio/video
  const mediaRef = useRef<HTMLVideoElement | null>(null)

  const [state, setState] = useAtom(playerState)
  const [playlistData] = useAtom(playlist)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


  // ✅ ADDED — simple video detection
  const isVideoSource = (url?: string) => {
    if (!url) return false
    return (
      url.endsWith('.mp4') ||
      url.includes('video')
    )
  }

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 55,
    progressColor: '#6b8590',
    waveColor: '#6b7280',
    cursorWidth: 2,
    url: state.source,
    autoplay: false,
    backend: 'MediaElement',
    // ✅ ADDED — connect WaveSurfer to <video>
    media: mediaRef.current ?? undefined,
  })
  // VOLUME
  useEffect(() => {
    const volume = async () => {
      wavesurfer?.setVolume(state.volume)
    }
    void volume()
  }, [state.volume, wavesurfer])
  // AUTO PLAY WHEN READY
  const autoPlay = async () => {
    if (!state.playing && isReady) {
      return wavesurfer?.pause()
    } else if (state.playing && isReady) {
      return await wavesurfer?.play()
    }
  }
  useEffect(() => {
    if (!wavesurfer || !isReady) return;
    console.log('AUTO PLAY')
    void autoPlay()
  }, [isReady])
  // PLAY & PAUSE
  useEffect(() => {
    if (!wavesurfer || !isReady) return;
    if (!state.playing) return wavesurfer?.pause();
    else return void wavesurfer?.play();
  }, [state.playing]);
  // HANDLE WHEN FINISHED SONG => LOAD NEXT SONG
  useEffect(() => {
    if (!wavesurfer || !state.id) return;
    wavesurfer.on('error', (err: unknown) => {
      // Type guard: check if err is an Error
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          console.error("ABORTED SIGNAL", err);
        }
      } else {
        // fallback for non-Error objects
        console.error("ABORTED SIGNAL (non-error)", err);
      }
    })
    wavesurfer.on("finish", () => void loadTrack(+1));
    return () => {
      console.log('RETURN FINISH')
      wavesurfer.un("finish", () => void loadTrack(+1));
    };
  }, [wavesurfer, state]);
  // HANDLE FORWARD >>
  const handleForward = (seconds: number) => {
    if (wavesurfer?.getCurrentTime) {
      const currentTime = wavesurfer?.getCurrentTime();
      wavesurfer?.seekTo((currentTime + seconds) / wavesurfer?.getDuration());
    }
  };
  // HANDLE BACKWARD <<
  const handleBackward = (seconds: number) => {
    if (wavesurfer?.getCurrentTime) {
      const currentTime = wavesurfer?.getCurrentTime();
      wavesurfer?.seekTo((currentTime - seconds) / wavesurfer?.getDuration());
    }
  };

  // LOADNEXT TRACK
  const loadTrack = async (direction = +1) => {
    console.log("TRACK CHANGE:", direction);

    const currentIndex = playlistData.find(item => item.id === state.id)?.index;
    if (currentIndex == null) return;

    const nextIndex = currentIndex + direction;

    // Out of bounds → stop player
    if (nextIndex < 0 || nextIndex >= playlistData.length) {
      setState(prev => ({ ...prev, playing: false }));
      return;
    }

    const nextTrack = playlistData[nextIndex];
    if (!nextTrack) return;

    const source = await signSource({
      id: String(nextTrack.id),
      key: String(nextTrack.key),
      bucketName: String(nextTrack.bucketName),
    });
    console.log(source.url)
    // Update state

    setState(prev => ({
      ...prev,
      id: String(nextTrack.id),
      source: String(source.url),
      playing: true,
      next: false,
    }));
    console.log("IOS DECTECTION ::::", isIOS)
    if (isIOS) return void autoPlay()

  };
  const enterFullscreen = () => {
    const video = mediaRef.current
    if (!video) return

    if (video.requestFullscreen) {
      void video.requestFullscreen()
    } else if ("webkitEnterFullscreen" in video) {
      ; (video as HTMLVideoElement & {
        webkitEnterFullscreen: () => void
      }).webkitEnterFullscreen()
    }
  }

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);
  return (
    <>
      {/* =====================================================
        MINI VIDEO PLAYER
    ===================================================== */}
      {isVideoSource(state.source) && (
        <div
          className="
          group
          fixed
          bottom-40
          right-3
          z-50
          aspect-video
          w-72
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-black
          shadow-[0_20px_60px_rgba(0,0,0,0.65)]
          md:bottom-24
          md:right-5
        "
        >
          {/* Yellow glow */}
          <div
            className="
            pointer-events-none
            absolute
            right-[-60px]
            top-[-70px]
            z-10
            h-32
            w-32
            rounded-full
            bg-[#B9FF00]/[0.05]
            blur-[60px]
          "
          />

          <video
            ref={mediaRef}
            className="
            h-full
            w-full
            object-cover
          "
            playsInline
            preload="metadata"
          />

          {/* Video overlay */}
          <div
            className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/40
            via-transparent
            to-black/10
          "
          />

          {/* Jeff92 & Ayan Sumania video indicator */}
          <div
            className="
            pointer-events-none
            absolute
            left-3
            top-3
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-black/60
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
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-zinc-300
            "
            >
              Video Preview
            </span>
          </div>

          {/* FULLSCREEN */}
          <button
            type="button"
            onClick={enterFullscreen}
            aria-label="Fullscreen"
            className="
            absolute
            bottom-3
            right-3
            z-20
            flex
            h-9
            w-9
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-black/70
            text-zinc-400
            backdrop-blur-md
            transition-all
            hover:border-[#B9FF00]/20
            hover:bg-[#B9FF00]
            hover:text-black
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        </div>
      )}

      {/* =====================================================
        MAIN PLAYER
    ===================================================== */}
      <footer
        className="
        fixed
        bottom-0
        left-0
        z-40
        flex
        h-36
        w-full
        select-none
        flex-col
        items-start
        justify-evenly
        gap-1
        overflow-hidden
        border-t
        border-white/10
        bg-zinc-950/95
        px-3
        text-zinc-200
        shadow-[0_-15px_50px_rgba(0,0,0,0.4)]
        backdrop-blur-xl
        md:h-20
        md:flex-row
        md:items-center
        md:gap-8
        md:px-5
      "
      >
        {/* Ambient player glow */}
        <div
          className="
          pointer-events-none
          absolute
          left-1/2
          top-full
          h-48
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#B9FF00]/[0.025]
          blur-[100px]
        "
        />

        {/* =====================================================
          TRACK INFORMATION
      ===================================================== */}
        <div
          className="
          relative
          flex
          w-auto
          min-w-0
          items-center
          gap-3
          text-sm
        "
        >
          {/* Artwork */}
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] sm:block">
            <ImageThumbnailComponent
              image={String(
                playlistData.find(
                  (item) =>
                    item.id === state.id
                )?.islink
              )}
            />
          </div>

          {playlistData.find(
            (item) =>
              item.id === state.id
          )?.isFull ? (
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="
                  h-1
                  w-1
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_6px_rgba(185,255,0,0.6)]
                "
                />

                <span
                  className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-zinc-600
                "
                >
                  Now Playing
                </span>
              </div>

              <h3
                className="
                w-[90vw]
                truncate
                text-xs
                font-semibold
                text-zinc-200
                md:w-[340px]
              "
              >
                {
                  playlistData.find(
                    (item) =>
                      item.id === state.id
                  )?.title
                }
              </h3>
            </div>
          ) : (
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="
                  h-1
                  w-1
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_6px_rgba(185,255,0,0.6)]
                "
                />

                <span
                  className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-zinc-600
                "
                >
                  Now Playing
                </span>
              </div>

              <h3
                className="
                w-[330px]
                truncate
                text-xs
                font-semibold
                text-zinc-200
                md:max-w-[400px]
              "
              >
                {
                  playlistData.find(
                    (item) =>
                      item.id === state.id
                  )?.title
                }
              </h3>

              <h3
                className="
                mt-0.5
                w-[330px]
                truncate
                text-[10px]
                text-zinc-600
              "
              >
                {
                  playlistData.find(
                    (item) =>
                      item.id === state.id
                  )?.artist
                }
              </h3>
            </div>
          )}
        </div>

        {/* =====================================================
          PLAYBACK CONTROLS
      ===================================================== */}
        <div
          className="
          relative
          flex
          w-full
          items-center
          justify-center
          gap-5
          md:w-auto
          md:gap-2
        "
        >
          {/* MOBILE -10 */}
          <button
            type="button"
            onClick={() =>
              handleBackward(10)
            }
            className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            text-zinc-600
            transition-all
            hover:bg-white/[0.05]
            hover:text-[#B9FF00]
            md:hidden
          "
          >
            <TbRewindBackward10 className="h-5 w-5" />
          </button>

          {/* PREVIOUS */}
          <button
            type="button"
            onClick={() => {
              void loadTrack(-1)
            }}
            className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            text-zinc-500
            transition-all
            hover:bg-white/[0.05]
            hover:text-[#B9FF00]
          "
          >
            <SkipBackIcon className="h-5 w-5" />
          </button>

          {/* PLAY / PAUSE */}
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#B9FF00]/20
            bg-[#B9FF00]
            text-black
            shadow-[0_0_20px_rgba(185,255,0,0.12)]
            transition-all
            hover:bg-[#B9FF00]
          "
          >
            {state.playing ? (
              <>
                {!isReady ? (
                  <Loader2Icon
                    className="
                    h-5
                    w-5
                    animate-spin
                    text-black
                  "
                  />
                ) : (
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
                  "
                  />
                )}
              </>
            ) : (
              <>
                {!isReady ? (
                  <Loader2Icon
                    className="
                    h-5
                    w-5
                    animate-spin
                    text-black
                  "
                  />
                ) : (
                  <RiPlayLargeFill
                    onClick={() => {
                      setState({
                        ...state,
                        playing: true
                      })
                    }}
                    className="
                    ml-0.5
                    h-5
                    w-5
                    cursor-pointer
                  "
                  />
                )}
              </>
            )}
          </div>

          {/* NEXT */}
          <button
            type="button"
            onClick={() => {
              void loadTrack(+1)
            }}
            className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            text-zinc-500
            transition-all
            hover:bg-white/[0.05]
            hover:text-[#B9FF00]
          "
          >
            <SkipForwardIcon className="h-5 w-5" />
          </button>

          {/* MOBILE +10 */}
          <button
            type="button"
            onClick={() =>
              handleForward(10)
            }
            className="
            flex
            h-8
            w-8
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            text-zinc-600
            transition-all
            hover:bg-white/[0.05]
            hover:text-[#B9FF00]
            md:hidden
          "
          >
            <TbRewindForward10 className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================================
          PROGRESS
      ===================================================== */}
        <div
          className="
          relative
          flex
          w-full
          items-center
          justify-between
          gap-4
          lg:flex-1
        "
        >
          <div className="flex w-full items-center justify-between">
            {/* CURRENT TIME */}
            <div className="w-12 shrink-0">
              <h3
                className="
                text-[10px]
                tabular-nums
                text-zinc-500
              "
              >
                {formatDuration(
                  Number(currentTime) * 1000,
                  { leading: true }
                )}
              </h3>
            </div>

            {/* WAVEFORM */}
            <div
              className="
              relative
              hidden
              w-full
              items-center
              justify-center
              lg:flex
            "
            >
              <div
                ref={containerRef}
                className="
                mx-4
                h-full
                w-full
                overflow-hidden
                rounded-full
                bg-white/[0.04]
              "
              />

              {!isReady && (
                <div
                  className="
                  absolute
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-zinc-950/40
                  backdrop-blur-sm
                "
                >
                  <LoaderSVG />
                </div>
              )}
            </div>

            {/* DURATION */}
            <div className="w-12 shrink-0 text-right">
              <h3
                className="
                text-[10px]
                tabular-nums
                text-zinc-500
              "
              >
                {formatDuration(
                  Number(
                    wavesurfer?.getDuration()
                  ) * 1000,
                  { leading: true }
                )}
              </h3>
            </div>
          </div>

          {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}
          <div
            className="
            hidden
            shrink-0
            items-center
            gap-2
            lg:flex
          "
          >
            {/* VOLUME */}
            <div
              className="
              flex
              h-9
              items-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-2
            "
            >
              <VolumePlayer />
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => {
                wavesurfer?.destroy()

                setState({
                  ...state,
                  id: '',
                  source: '',
                  playing: false,
                  controls: false,
                  volume: 1,
                  muted: false,
                  played: 0,
                  loaded: 0,
                  duration: 0,
                  playbackRate: 1.0,
                  loop: false,
                  seek: 0,
                  progress: 0,
                  durationv2: 0,
                  next: false
                })
              }}
              className="
              flex
              h-9
              w-9
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-600
              transition-all
              hover:border-red-500/20
              hover:bg-red-500/[0.06]
              hover:text-red-400
            "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
};

export default MediaPlayerComponent