"use client";

import formatDuration from "format-duration";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAtom } from "jotai";
import { useWavesurfer } from "@wavesurfer/react";
import {
  Loader2Icon,
  MonitorPlay,
  SkipBackIcon,
  SkipForwardIcon,
  X,
} from "lucide-react";
import {
  TbRewindBackward10,
  TbRewindForward10,
} from "react-icons/tb";
import {
  RiPauseLargeFill,
  RiPlayLargeFill,
} from "react-icons/ri";

import { api } from "@/utils/api";
import {
  playerState,
  playlist,
} from "@/state/globalState";

import VolumePlayer from "./helper/volume";
import LoaderSVG from "./helper/loader";
import ImageThumbnailComponent from "../common/image-thumbnail";
import KeyboardShortcutsPopover from "./helper/keyboard-shortcut";

declare global {
  interface Window {
    MSStream?: unknown;
  }
}

const MediaPlayerComponent = () => {
  const { mutateAsync: signSource } =
    api.signedUrl.signUrlKeyBucket.useMutation();

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const mediaRef =
    useRef<HTMLVideoElement | null>(null);

  const [mediaElement, setMediaElement] =
    useState<HTMLVideoElement | null>(
      null,
    );

  const [
    videoFrameOpen,
    setVideoFrameOpen,
  ] = useState(true);

  const [state, setState] =
    useAtom(playerState);

  const [playlistData] =
    useAtom(playlist);

  const handleMediaRef = useCallback(
    (
      element: HTMLVideoElement | null,
    ) => {
      mediaRef.current = element;
      setMediaElement(element);
    },
    [],
  );

  const isIOS =
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(
      navigator.userAgent,
    ) &&
    !window.MSStream;

  const isVideoSource = (
    url?: string,
  ) => {
    if (!url) {
      return false;
    }

    const normalizedUrl =
      url.toLowerCase();

    return (
      normalizedUrl.includes(".mp4") ||
      normalizedUrl.includes(".webm") ||
      normalizedUrl.includes(".mov") ||
      normalizedUrl.includes("video")
    );
  };

  const isCurrentTrackVideo =
    isVideoSource(state.source);

  const currentTrack =
    playlistData.find(
      (item) =>
        item.id === state.id,
    );

  /*
   * The video element stays mounted for both
   * audio and video. This prevents WaveSurfer
   * from losing its media element while changing
   * from video to audio.
   */
  const {
    wavesurfer,
    isReady,
    currentTime,
  } = useWavesurfer({
    container: containerRef,
    height: 55,
    progressColor: "#6b8590",
    waveColor: "#6b7280",
    cursorWidth: 2,
    autoplay: false,
    backend: "MediaElement",
    media:
      mediaElement ?? undefined,
  });

  /*
   * Automatically open the video frame when
   * a new video track is selected.
   */
  useEffect(() => {
    if (isVideoSource(state.source)) {
      setVideoFrameOpen(true);
    }
  }, [state.source]);

  /*
   * Load media manually so the AbortError
   * generated while replacing a source is caught.
   */
  useEffect(() => {
    if (
      !wavesurfer ||
      !mediaElement ||
      !state.source
    ) {
      return;
    }

    let cancelled = false;

    const loadSource = async () => {
      try {
        wavesurfer.pause();
        mediaElement.pause();

        await wavesurfer.load(
          state.source,
        );

        if (
          !cancelled &&
          state.playing
        ) {
          await wavesurfer.play();
        }
      } catch (error: unknown) {
        if (isAbortError(error)) {
          return;
        }

        console.error(
          "Loading media failed",
          error,
        );
      }
    };

    void loadSource();

    return () => {
      cancelled = true;

      /*
       * Pause the current media. Do not manually
       * destroy WaveSurfer during a source change.
       */
      try {
        wavesurfer.pause();
        mediaElement.pause();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, [
    wavesurfer,
    mediaElement,
    state.source,
  ]);

  /*
   * Volume synchronization.
   */
  useEffect(() => {
    if (!wavesurfer) {
      return;
    }

    wavesurfer.setVolume(
      state.volume,
    );
  }, [state.volume, wavesurfer]);

  /*
   * Play/pause synchronization.
   */
  useEffect(() => {
    if (!wavesurfer || !isReady) {
      return;
    }

    if (!state.playing) {
      wavesurfer.pause();
      return;
    }

    const play = async () => {
      try {
        await wavesurfer.play();
      } catch (error: unknown) {
        if (isAbortError(error)) {
          return;
        }

        console.error(
          "Playing media failed",
          error,
        );
      }
    };

    void play();
  }, [
    wavesurfer,
    isReady,
    state.playing,
  ]);

  const handleForward = (
    seconds: number,
  ) => {
    if (!wavesurfer) {
      return;
    }

    const duration =
      wavesurfer.getDuration();

    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return;
    }

    const current =
      wavesurfer.getCurrentTime();

    const next =
      Math.min(
        current + seconds,
        duration,
      );

    wavesurfer.seekTo(
      next / duration,
    );
  };

  const handleBackward = (
    seconds: number,
  ) => {
    if (!wavesurfer) {
      return;
    }

    const duration =
      wavesurfer.getDuration();

    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return;
    }

    const current =
      wavesurfer.getCurrentTime();

    const next =
      Math.max(
        current - seconds,
        0,
      );

    wavesurfer.seekTo(
      next / duration,
    );
  };

  const loadTrack = async (
    direction = 1,
  ) => {
    /*
     * Stop the current media before requesting
     * and loading the next source.
     */
    try {
      wavesurfer?.pause();
      mediaRef.current?.pause();
    } catch {
      // Ignore pause errors during switching.
    }

    const currentIndex =
      playlistData.find(
        (item) =>
          item.id === state.id,
      )?.index;

    if (currentIndex == null) {
      return;
    }

    const nextIndex =
      currentIndex + direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
      playlistData.length
    ) {
      setState((previous) => ({
        ...previous,
        playing: false,
      }));

      return;
    }

    const nextTrack =
      playlistData[nextIndex];

    if (!nextTrack) {
      return;
    }

    try {
      const source =
        await signSource({
          id: String(nextTrack.id),
          key: String(nextTrack.key),
          bucketName: String(
            nextTrack.bucketName,
          ),
        });

      setState((previous) => ({
        ...previous,
        id: String(nextTrack.id),
        source: String(source.url),
        playing: true,
        next: false,
      }));
    } catch (error: unknown) {
      if (isAbortError(error)) {
        return;
      }

      console.error(
        "Changing track failed",
        error,
      );
    }
  };

  /*
   * Register finish/error events using the
   * exact same callbacks for cleanup.
   */
  useEffect(() => {
    if (!wavesurfer || !state.id) {
      return;
    }

    const handleError = (
      error: unknown,
    ) => {
      if (isAbortError(error)) {
        return;
      }

      console.error(
        "WaveSurfer error",
        error,
      );
    };

    const handleFinish = () => {
      void loadTrack(1);
    };

    wavesurfer.on(
      "error",
      handleError,
    );

    wavesurfer.on(
      "finish",
      handleFinish,
    );

    return () => {
      wavesurfer.un(
        "error",
        handleError,
      );

      wavesurfer.un(
        "finish",
        handleFinish,
      );
    };
  }, [
    wavesurfer,
    state.id,
    playlistData,
  ]);

  const enterFullscreen = () => {
    const video =
      mediaRef.current;

    if (!video) {
      return;
    }

    if (video.requestFullscreen) {
      void video.requestFullscreen();
      return;
    }

    if (
      "webkitEnterFullscreen" in video
    ) {
      (
        video as HTMLVideoElement & {
          webkitEnterFullscreen:
          () => void;
        }
      ).webkitEnterFullscreen();
    }
  };

  /*
   * Hides only the floating video frame.
   * Playback continues.
   */
  const closeVideoFrame = () => {
    setVideoFrameOpen(false);
  };

  /*
   * Shows the floating video frame again.
   */
  const showVideoFrame = () => {
    if (!isCurrentTrackVideo) {
      return;
    }

    setVideoFrameOpen(true);
  };

  /*
   * Closes the complete media player.
   *
   * Do not manually destroy WaveSurfer here.
   * The hook will destroy it when this component
   * unmounts. Manually destroying it while a load
   * is pending can create the AbortError.
   */
  const closePlayer = () => {
    try {
      wavesurfer?.pause();
      mediaRef.current?.pause();
    } catch {
      // Ignore close cleanup errors.
    }

    setState({
      ...state,
      id: "",
      source: "",
      playing: false,
      controls: false,
      volume: 1,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1,
      loop: false,
      seek: 0,
      progress: 0,
      durationv2: 0,
      next: false,
    });
  };

  useEffect(() => {
    document.body.classList.add(
      "no-scroll",
    );

    return () => {
      document.body.classList.remove(
        "no-scroll",
      );
    };
  }, []);


  const clamp = (value: number, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value))

  const changeVolume = (delta: number) => {
    const nextVolume = clamp(state.volume+delta)
    setState({
          ...state,
          volume:Number(nextVolume)
      })
  }
  const handleMute = () => {
      if(Math.round(state.volume*100)>0){
          setState({
              ...state,
              volume:0
          })
      }else{
          setState({
              ...state,
              volume:1
          })
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don’t hijack typing
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          setState(prev => ({ ...prev, playing: !prev.playing }))
          break

        case "ArrowRight":
          handleForward(5)
          break

        case "ArrowLeft":
          handleBackward(5)
          break

        case "KeyN":
          void loadTrack(+1)
          break

        case "KeyP":
          void loadTrack(-1)
          break
        case "ArrowUp":
          changeVolume(0.1)
          break

        case "ArrowDown":
          changeVolume(-0.1)
          break

        case "KeyM":
          handleMute()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [wavesurfer,state])

  return (
    <>
      {/* =====================================================
          PERSISTENT VIDEO ELEMENT

          Keep this mounted even when the current source is
          audio or the video frame has been closed.
      ===================================================== */}
      <div
        aria-hidden={
          !isCurrentTrackVideo ||
          !videoFrameOpen
        }
        className={`
          group fixed bottom-40 right-3
          z-50 aspect-video w-72
          overflow-hidden rounded-2xl
          border border-white/10 bg-black
          shadow-[0_20px_60px_rgba(0,0,0,0.65)]
          transition-opacity duration-200
          md:bottom-24 md:right-5 md:w-150
          ${isCurrentTrackVideo &&
            videoFrameOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
          }
        `}
      >
        {/* Yellow glow */}
        <div
          className="
            pointer-events-none absolute
            right-[-60px] top-[-70px]
            z-10 h-32 w-32
            rounded-full
            bg-[#B9FF00]/[0.05]
            blur-[60px]
          "
        />

        <video
          ref={handleMediaRef}
          className="
            h-full w-full object-cover
          "
          playsInline
          preload="metadata"
        />

        {/* Video overlay */}
        <div
          className="
            pointer-events-none absolute
            inset-0 bg-linear-to-t
            from-black/40 via-transparent
            to-black/10
          "
        />

        {/* Video indicator */}
        <div
          className="
            pointer-events-none absolute
            left-3 top-3 flex items-center
            gap-2 rounded-full border
            border-white/10 bg-black/60
            px-2.5 py-1.5 backdrop-blur-md
          "
        >
          <span
            className="
              h-1.5 w-1.5 rounded-full
              bg-[#B9FF00]
              shadow-[0_0_8px_rgba(185,255,0,0.7)]
            "
          />

          <span
            className="
              text-[8px] font-medium
              uppercase tracking-[0.16em]
              text-zinc-300
            "
          >
            Video Preview
          </span>
        </div>

        {/* CLOSE VIDEO FRAME ONLY */}
        <button
          type="button"
          onClick={closeVideoFrame}
          aria-label="Close video frame"
          title="Close video"
          className="
            absolute right-3 top-3 z-30
            flex h-9 w-9 cursor-pointer
            items-center justify-center
            rounded-xl border
            border-white/10 bg-black/70
            text-zinc-400 backdrop-blur-md
            transition-all
            hover:border-red-500/30
            hover:bg-red-500
            hover:text-white
          "
        >
          <X className="h-4 w-4" />
        </button>

        {/* FULLSCREEN */}
        <button
          type="button"
          onClick={enterFullscreen}
          aria-label="Fullscreen"
          title="Fullscreen"
          className="
            absolute bottom-3 right-3
            z-20 flex h-9 w-9
            cursor-pointer items-center
            justify-center rounded-xl
            border border-white/10
            bg-black/70 text-zinc-400
            backdrop-blur-md transition-all
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

      {/* =====================================================
          MAIN PLAYER
      ===================================================== */}
      <footer
        className="
          fixed bottom-0 left-0 z-40
          flex h-36 w-full select-none
          flex-col items-start
          justify-evenly gap-1
          overflow-hidden border-t
          border-white/10 bg-zinc-950/95
          px-3 text-zinc-200
          shadow-[0_-15px_50px_rgba(0,0,0,0.4)]
          backdrop-blur-xl
          md:h-20 md:flex-row
          md:items-center md:gap-8 md:px-5
        "
      >
        {/* Ambient player glow */}
        <div
          className="
            pointer-events-none absolute
            left-1/2 top-full h-48
            w-[500px] -translate-x-1/2
            -translate-y-1/2 rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[100px]
          "
        />

        {/* TRACK INFORMATION */}
        <div
          className="
            relative flex w-auto min-w-0
            items-center gap-3 text-sm
          "
        >
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] sm:block">
            <ImageThumbnailComponent
              image={String(
                currentTrack?.islink,
              )}
            />
          </div>

          {currentTrack?.isFull ? (
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#B9FF00] shadow-[0_0_6px_rgba(185,255,0,0.6)]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Now Playing
                </span>
              </div>

              <h3 className="w-[90vw] truncate text-xs font-semibold text-zinc-200 md:w-[340px]">
                {currentTrack?.title}
              </h3>
            </div>
          ) : (
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#B9FF00] shadow-[0_0_6px_rgba(185,255,0,0.6)]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Now Playing
                </span>
              </div>

              <h3 className="w-[330px] truncate text-xs font-semibold text-zinc-200 md:max-w-[400px]">
                {currentTrack?.title}
              </h3>

              <h3 className="mt-0.5 w-[330px] truncate text-[10px] text-zinc-600">
                {currentTrack?.artist}
              </h3>
            </div>
          )}
        </div>

        {/* PLAYBACK CONTROLS */}
        <div
          className="
    relative flex w-full items-center
    justify-center gap-2.5
    md:w-auto md:gap-1.5
  "
        >
          {/* MOBILE BACKWARD 10 SECONDS */}
          <PlaybackButton
            label="Rewind 10 seconds"
            onClick={() =>
              handleBackward(10)
            }
            className="md:hidden"
          >
            <TbRewindBackward10 className="h-[18px] w-[18px]" />
          </PlaybackButton>

          {/* PREVIOUS TRACK */}
          <PlaybackButton
            label="Previous track"
            onClick={() => {
              void loadTrack(-1);
            }}
          >
            <SkipBackIcon
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />
          </PlaybackButton>

          {/* PLAY / PAUSE */}
          <div className="relative mx-1 flex items-center justify-center">
            {/* Ambient glow */}
            <span
              aria-hidden="true"
              className={`
        pointer-events-none absolute
        h-14 w-14 rounded-full
        bg-[#B9FF00]/15 blur-xl
        transition-all duration-500
        ${state.playing
                  ? "scale-110 opacity-100"
                  : "scale-75 opacity-40"
                }
      `}
            />

            {/* Outer ring */}
            <span
              aria-hidden="true"
              className={`
        pointer-events-none absolute
        h-[52px] w-[52px] rounded-full
        border transition-all duration-300
        ${state.playing
                  ? "scale-100 border-[#B9FF00]/30"
                  : "scale-90 border-white/10"
                }
      `}
            />

            <button
              type="button"
              disabled={!isReady}
              onClick={() => {
                if (!isReady) {
                  return;
                }

                setState({
                  ...state,
                  playing: !state.playing,
                });
              }}
              aria-label={
                state.playing
                  ? "Pause track"
                  : "Play track"
              }
              title={
                state.playing
                  ? "Pause"
                  : "Play"
              }
              className={`
        group relative z-10 flex
        h-12 w-12 cursor-pointer
        items-center justify-center
        overflow-hidden rounded-full
        border text-black outline-none
        transition-all duration-200
        focus-visible:ring-2
        focus-visible:ring-[#B9FF00]/60
        focus-visible:ring-offset-2
        focus-visible:ring-offset-zinc-950
        active:scale-95
        disabled:cursor-wait
        disabled:opacity-70
        ${state.playing
                  ? `
              border-[#B9FF00]/50
              bg-[#B9FF00]
              shadow-[0_0_24px_rgba(185,255,0,0.22)]
              hover:shadow-[0_0_30px_rgba(185,255,0,0.32)]
            `
                  : `
              border-white/15
              bg-zinc-100
              shadow-[0_8px_24px_rgba(0,0,0,0.35)]
              hover:border-[#B9FF00]/40
              hover:bg-[#B9FF00]
              hover:shadow-[0_0_26px_rgba(185,255,0,0.25)]
            `
                }
      `}
            >
              {/* Button highlight */}
              <span
                aria-hidden="true"
                className="
          pointer-events-none absolute
          inset-x-1 top-1 h-1/2
          rounded-full
          bg-linear-to-b
          from-white/35 to-transparent
          opacity-60
        "
              />

              <span className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                {!isReady ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : state.playing ? (
                  <RiPauseLargeFill className="h-[19px] w-[19px]" />
                ) : (
                  <RiPlayLargeFill className="ml-0.5 h-5 w-5" />
                )}
              </span>
            </button>

            {/* Playing indicator */}
            {/* {isReady && state.playing && (
              <span
                aria-hidden="true"
                className="
          absolute -bottom-2
          flex items-end gap-0.5
        "
              >
                <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-[#B9FF00]" />
                <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-[#B9FF00] [animation-delay:120ms]" />
                <span className="h-1 w-0.5 animate-pulse rounded-full bg-[#B9FF00] [animation-delay:240ms]" />
              </span>
            )} */}
          </div>

          {/* NEXT TRACK */}
          <PlaybackButton
            label="Next track"
            onClick={() => {
              void loadTrack(1);
            }}
          >
            <SkipForwardIcon
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />
          </PlaybackButton>

          {/* MOBILE FORWARD 10 SECONDS */}
          <PlaybackButton
            label="Forward 10 seconds"
            onClick={() =>
              handleForward(10)
            }
            className="md:hidden"
          >
            <TbRewindForward10 className="h-[18px] w-[18px]" />
          </PlaybackButton>
        </div>

        {/* PROGRESS */}
        <div className="relative flex w-full items-center justify-between gap-4 lg:flex-1">
          <div className="flex w-full items-center justify-between">
            {/* CURRENT TIME */}
            <div className="w-12 shrink-0">
              <h3 className="text-[10px] tabular-nums text-zinc-500">
                {formatDuration(
                  Number(currentTime) *
                  1000,
                  {
                    leading: true,
                  },
                )}
              </h3>
            </div>

            {/* WAVEFORM */}
            <div className="relative hidden w-full items-center justify-center lg:flex">
              <div
                ref={containerRef}
                className="
                  mx-4 h-full w-full
                  overflow-hidden rounded-full
                  bg-white/[0.04]
                "
              />

              {!isReady && (
                <div className="absolute flex h-full w-full items-center justify-center bg-zinc-950/40 backdrop-blur-sm">
                  <LoaderSVG />
                </div>
              )}
            </div>

            {/* DURATION */}
            <div className="w-12 shrink-0 text-right">
              <h3 className="text-[10px] tabular-nums text-zinc-500">
                {formatDuration(
                  Number(
                    wavesurfer?.getDuration(),
                  ) * 1000,
                  {
                    leading: true,
                  },
                )}
              </h3>
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {/* VOLUME */}
            <KeyboardShortcutsPopover/>
            <div className="flex h-9 items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-2">
              <VolumePlayer />
            </div>

            {/* SHOW VIDEO AGAIN */}
            {isCurrentTrackVideo &&
              !videoFrameOpen && (
                <button
                  type="button"
                  onClick={showVideoFrame}
                  aria-label="Show video"
                  title="Show video"
                  className="
                    flex h-9 w-9
                    cursor-pointer items-center
                    justify-center rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.02]
                    text-zinc-600
                    transition-all
                    hover:border-[#B9FF00]/20
                    hover:bg-[#B9FF00]/[0.06]
                    hover:text-[#B9FF00]
                  "
                >
                  <MonitorPlay className="h-4 w-4" />
                </button>
              )}

            {/* CLOSE COMPLETE PLAYER */}
            <button
              type="button"
              onClick={closePlayer}
              aria-label="Close media player"
              title="Close player"
              className="
                flex h-9 w-9 cursor-pointer
                items-center justify-center
                rounded-xl border
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
  );
};

function isAbortError(
  error: unknown,
): boolean {
  if (
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return true;
  }

  if (
    error instanceof Error &&
    error.name === "AbortError"
  ) {
    return true;
  }

  return false;
}

export default MediaPlayerComponent;


type PlaybackButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const PlaybackButton = ({
  label,
  onClick,
  children,
  className = "",
  disabled = false,
}: PlaybackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        group flex h-9 w-9
        cursor-pointer items-center
        justify-center rounded-xl
        border border-transparent
        bg-transparent text-zinc-500
        outline-none transition-all
        duration-200
        hover:border-white/[0.08]
        hover:bg-white/[0.05]
        hover:text-[#B9FF00]
        hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]
        focus-visible:border-[#B9FF00]/30
        focus-visible:ring-2
        focus-visible:ring-[#B9FF00]/20
        active:scale-90
        disabled:pointer-events-none
        disabled:opacity-30
        ${className}
      `}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {children}
      </span>
    </button>
  );
};