import { api } from '@/utils/api';
import {
  Loader2,
  Pause,
  Play,
  Scissors,
  TimerReset,
  Waves,
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, {
  type Region
} from 'wavesurfer.js/dist/plugins/regions';


interface SongPreviewWaveformProps {
  id: string;
  loopLength: number;
  regionTime: {
    start: number;
    end: number;
  };
  onRegionChange: (v: {
    start: number;
    end: number;
  }) => void;
  onLoopLengthChange: (v: number) => void;
}


const SongPreviewWaveform: React.FC<SongPreviewWaveformProps> = ({
  id,
  loopLength,
  regionTime,
  onRegionChange,
  onLoopLengthChange,
}) => {
  const [isReady, setIsReady] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);

  const wsRef = useRef<WaveSurfer | null>(null);

  const regionsPluginRef =
    useRef<ReturnType<typeof RegionsPlugin.create> | null>(
      null
    );

  const regionRef = useRef<Region | null>(null);


  const { data: mp3Url } =
    api.signedUrl.getObject.useQuery(
      { id },
      { enabled: !!id }
    );


  const [isPlaying, setIsPlaying] =
    useState(false);


  // ============================================================
  // CREATE REGION
  // ============================================================
  const createRegion = (
    start: number,
    length: number
  ) => {
    if (!regionsPluginRef.current)
      return;


    regionRef.current?.remove();


    const region =
      regionsPluginRef.current.addRegion({
        start,
        end: start + length,
        color: 'rgba(37, 99, 235, 0.3)',
        drag: true,
        resize: false,
      });


    regionRef.current = region;


    // Update Formik parent
    onRegionChange({
      start: Math.round(start),
      end: Math.round(start + length)
    });


    // Handler for drag / update
    const attachRegionHandler = (
      r: Region
    ) => {
      r.on('update-end', () => {
        if (
          !wsRef.current ||
          !regionsPluginRef.current
        )
          return;


        const duration =
          wsRef.current.getDuration();

        let newStart =
          Math.round(r.start);

        let newEnd =
          newStart + loopLength;


        // Clamp to audio duration
        if (newEnd > duration) {
          newStart = Math.max(
            0,
            duration - loopLength
          );

          newEnd = duration;
        }


        // Remove old region
        r.remove();


        // Recreate region
        const plugin =
          regionsPluginRef.current;

        const newRegion =
          plugin.addRegion({
            start: newStart,
            end: newEnd,
            color: 'rgba(37, 99, 235, 0.3)',
            drag: true,
            resize: false
          });


        regionRef.current =
          newRegion;


        // Reattach handler
        attachRegionHandler(
          newRegion
        );


        // Update parent/Formik
        onRegionChange({
          start: newStart,
          end: newEnd
        });
      });
    };


    attachRegionHandler(region);
  };


  // ============================================================
  // INIT WAVESURFER
  // ============================================================
  useEffect(() => {
    if (
      !waveformRef.current ||
      !mp3Url
    )
      return;


    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#6b7280',
      progressColor: '#6b7280',
      cursorColor: '#ff0000',
      cursorWidth: 2,
      height: 100,
      normalize: true,
      interact: true,
      plugins: [
        (
          regionsPluginRef.current =
            RegionsPlugin.create()
        )
      ],
    });


    wsRef.current = ws;

    let mounted = true;


    ws.on(
      'error',
      (err: unknown) => {
        // Type guard: check if err is an Error
        if (err instanceof Error) {
          if (
            err.name !==
            'AbortError'
          ) {
            console.error(
              "ABORTED SIGNAL",
              err
            );
          }
        } else {
          // fallback for non-Error objects
          console.error(
            "ABORTED SIGNAL (non-error)",
            err
          );
        }
      }
    );


    ws.load(mp3Url)
      .then(() => {
        if (!mounted)
          return;

        setIsReady(true);

        createRegion(
          regionTime.start,
          regionTime.end -
            regionTime.start
        );
      })
      .catch((err) => {
        if (
          (err as DOMException)
            .name === 'AbortError'
        ) {
          // Safe to ignore
          console.log(
            'WaveSurfer load aborted, ignoring.'
          );
        } else {
          console.error(err);
        }
      });


    ws.on('ready', () => {
      setIsReady(true);


      createRegion(
        regionTime.start,
        regionTime.end -
          regionTime.start
      );


      // Loop logic
      ws.on('audioprocess', () => {
        if (
          !regionRef.current ||
          !ws
        )
          return;


        const current =
          ws.getCurrentTime();

        const {
          start,
          end
        } = regionRef.current;

        const duration =
          ws.getDuration();


        if (
          current < start ||
          current >= end
        ) {
          ws.seekTo(
            start / duration
          );
        }
      });
    });


    return () => {
      mounted = false;

      setIsReady(false);

      ws?.destroy();
    };

  }, [mp3Url, id]);


  // ============================================================
  // LOOP LENGTH CHANGE
  // ============================================================
  useEffect(() => {
    if (regionRef.current) {
      createRegion(
        regionRef.current.start,
        loopLength
      );
    }
  }, [loopLength]);


  // ============================================================
  // PLAY / PAUSE
  // ============================================================
  const togglePlay = () => {
    if (
      !wsRef.current ||
      !regionRef.current
    )
      return;


    const current =
      wsRef.current.getCurrentTime();

    const {
      start,
      end
    } = regionRef.current;


    if (
      current < start ||
      current >= end
    ) {
      wsRef.current.seekTo(
        start /
          wsRef.current.getDuration()
      );
    }


    void wsRef.current.playPause();

    setIsPlaying(
      (p) => !p
    );
  };


  // ============================================================
  // FORMAT TIME
  // ============================================================
  const formatTime = (
    sec: number
  ) => {
    const m =
      Math.floor(sec / 60);

    const s =
      Math.floor(sec % 60);

    return `${
      m
        .toString()
        .padStart(2, '0')
    }:${
      s
        .toString()
        .padStart(2, '0')
    }`;
  };


  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.025]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}
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
            <Waves className="h-4 w-4" />
          </div>

          <div>
            <h3
              className="
                text-sm
                font-semibold
                text-zinc-100
              "
            >
              Preview Snippet
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
              Select the audio preview region
            </p>
          </div>
        </div>

        <span
          className="
            hidden
            rounded-full
            border
            border-white/[0.07]
            bg-white/[0.025]
            px-3
            py-1
            text-[9px]
            font-medium
            uppercase
            tracking-wider
            text-zinc-600
            sm:block
          "
        >
          {loopLength}s Preview
        </span>
      </div>


      <div className="flex flex-col gap-4 p-3 sm:p-5">

        {/* =====================================================
            WAVEFORM
        ===================================================== */}
        <div
          className="
            flex
            min-h-[128px]
            w-full
            items-stretch
            gap-2
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.06]
            bg-[#111518]/20
            p-2
          "
        >
          {/* PLAY BUTTON */}
          <button
            onClick={togglePlay}
            disabled={!isReady}
            type="button"
            className={`
              flex
              w-20
              shrink-0
              flex-col
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              transition-all
              sm:w-24

              ${
                isReady
                  ? `
                    border-[#B9FF00]/15
                    bg-[#B9FF00]
                    text-black
                    hover:bg-[#B9FF00]
                  `
                  : `
                    cursor-not-allowed
                    border-white/[0.04]
                    bg-white/[0.025]
                    text-zinc-700
                  `
              }
            `}
          >
            {isPlaying ? (
              <>
                <Pause
                  className="
                    h-5
                    w-5
                    fill-current
                  "
                />
                Pause
              </>
            ) : (
              <>
                <Play
                  className="
                    h-5
                    w-5
                    fill-current
                  "
                />
                Play
              </>
            )}
          </button>


          {/* WAVE */}
          <div
            className="
              relative
              flex
              min-w-0
              flex-1
              items-center
              overflow-hidden
              rounded-xl
              border
              border-white/[0.04]
              bg-white/[0.015]
              px-2
            "
          >
            {!isReady && (
              <div
                className="
                  absolute
                  inset-0
                  z-50
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-zinc-950/70
                  backdrop-blur-sm
                "
              >
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                    text-[#B9FF00]
                  "
                />

                <h3
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-zinc-500
                  "
                >
                  Preparing Preview
                </h3>
              </div>
            )}

            <div
              ref={waveformRef}
              className="
                relative
                w-full
              "
            />
          </div>
        </div>


        {/* =====================================================
            SNIPPET TIME
        ===================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-2
          "
        >
          {/* START / END */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.015]
              px-4
              py-3
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
                bg-[#B9FF00]/[0.07]
                text-[#B9FF00]
              "
            >
              <Scissors className="h-3.5 w-3.5" />
            </div>

            <div>
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Snippet
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-xs
                  font-semibold
                  text-zinc-300
                "
              >
                {formatTime(
                  regionTime.start
                )}
                {' — '}
                {formatTime(
                  regionTime.end
                )}
              </p>
            </div>
          </div>


          {/* LENGTH */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.015]
              px-4
              py-3
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
                bg-white/[0.025]
                text-zinc-500
              "
            >
              <TimerReset className="h-3.5 w-3.5" />
            </div>

            <div>
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Length
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-zinc-300
                "
              >
                {loopLength} seconds
              </p>
            </div>
          </div>
        </div>


        {/* =====================================================
            SNIPPET LENGTH
        ===================================================== */}
        <div
          className="
            rounded-2xl
            border
            border-white/[0.05]
            bg-white/[0.015]
            p-3
          "
        >
          <div className="mb-3">
            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-zinc-600
              "
            >
              Snippet Length
            </span>
          </div>

          <div
            className="
              grid
              grid-cols-3
              gap-2
            "
          >
            {[60, 90, 120].map(
              (sec) => (
                <label
                  key={sec}
                  className={`
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    px-3
                    py-3
                    text-xs
                    font-semibold
                    transition-all

                    ${
                      loopLength === sec
                        ? `
                          border-[#B9FF00]/20
                          bg-[#B9FF00]/[0.08]
                          text-[#B9FF00]
                        `
                        : `
                          border-white/[0.06]
                          bg-white/[0.02]
                          text-zinc-500
                          hover:border-white/[0.1]
                          hover:bg-white/[0.04]
                          hover:text-zinc-300
                        `
                    }

                    ${
                      !isReady
                        ? `
                          cursor-not-allowed
                          opacity-40
                        `
                        : ""
                    }
                  `}
                >
                  <input
                    type="radio"
                    disabled={!isReady}
                    checked={
                      loopLength === sec
                    }
                    onChange={() =>
                      onLoopLengthChange(
                        sec
                      )
                    }
                    className="
                      sr-only
                    "
                  />

                  <span
                    className={`
                      h-2
                      w-2
                      rounded-full
                      ${
                        loopLength === sec
                          ? `
                            bg-[#B9FF00]
                            shadow-[0_0_8px_rgba(185,255,0,0.6)]
                          `
                          : `
                            bg-zinc-700
                          `
                      }
                    `}
                  />

                  {sec}s
                </label>
              )
            )}
          </div>
        </div>


        {/* =====================================================
            HELP TEXT
        ===================================================== */}
        <div
          className="
            flex
            items-start
            gap-2
            rounded-xl
            border
            border-[#B9FF00]/10
            bg-[#B9FF00]/[0.025]
            px-3
            py-3
          "
        >
          <span
            className="
              mt-1.5
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-[#B9FF00]
              shadow-[0_0_6px_rgba(185,255,0,0.4)]
            "
          />

          <p
            className="
              text-[10px]
              leading-5
              text-zinc-600
            "
          >
            Drag the highlighted waveform region to choose the part
            of the track that will be used as the public preview.
          </p>
        </div>
      </div>
    </div>
  );
};


export default SongPreviewWaveform;