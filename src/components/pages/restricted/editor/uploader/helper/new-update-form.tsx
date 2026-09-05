import React from "react";
import {
  Check,
  CircleAlert,
  Disc3,
  Gauge,
  LoaderIcon,
  Save,
  AudioLines,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";
import SongPreviewWaveform from "@/components/pages/common/song-preview-wavesurf";
import EmptyComponent from "@/components/pages/common/empty";
import LoadingSkeletonComponents from "@/components/pages/common/loading-skeleton";
import { useAtomValue } from "jotai";
import { genreItemsAtom } from "@/state/genreAtoms";
import { tagItemsAtom } from "@/state/tagAtoms";
import { OriginalCompositionSection } from "../../../common/forms/original-composition-section";
import SectionHeader from "../../../common/forms/section-header";
import { EnergySection, GenresSection, MusicKeySection, TagsSection, VocalLyricsSection } from "../../../common/forms/tags-genre-explicit-key-forms";

/* =========================================================
   VALIDATION
========================================================= */

export const postSchema = Yup.object().shape({
  is_explicit: Yup.boolean(),

  is_opm: Yup.boolean(),

  title: Yup.string().required("Title required"),

  artist: Yup.string().required("Artist required"),

  bpm_start: Yup.number()
    .min(1, "BPM start must be at least 1")
    .required("BPM start required"),

  bpm_end: Yup.number()
    .max(200, "BPM end cannot exceed 200")
    .required("BPM end required"),

  key: Yup.string().required("Music key required"),
  energy: Yup.number().required("Energy required"),

  release_year: Yup.number().required(
    "Release year required"
  ),

  genre: Yup.array()
    .required("Must have genre")
    .min(1, "Minimum of 1 genre")
    .max(3, "Maximum of 3 genres"),

  tag: Yup.array()
    .required("Must have tag")
    .min(1, "Minimum of 1 tag")
    .max(5, "Maximum of 5 tags"),

  isOriginal: Yup.boolean(),

  spotifyTracks: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(
          "REQUIRED"
        ),
        artists: Yup.string().required(
          "REQUIRED"
        ),
        spotifyId: Yup.string().required(
          "REQUIRED"
        ),
        previewUrl: Yup.string().optional(),
        spotifyUrl: Yup.string().optional(),
      })
    )
    .when("isOriginal", {
      is: false,
      then: (schema) =>
        schema.min(
          1,
          "At least one Spotify track is required"
        ),
      otherwise: (schema) =>
        schema.notRequired(),
    }),

  price: Yup.number()
    .min(
      100,
      "Price must be at least $1.00"
    )
    .max(
      50000,
      "Price cannot exceed $500.00"
    )
    .required("Price is required"),

  loopLength: Yup.number()
    .required("Loop length is required")
    .min(
      10,
      "Loop length must be at least 10 seconds"
    )
    .max(
      300,
      "Loop length cannot exceed 300 seconds"
    ),

  regionTime: Yup.object().shape({
    start: Yup.number()
      .required("Region start is required")
      .min(0, "Start cannot be negative"),

    end: Yup.number()
      .required("Region end is required")
      .moreThan(
        Yup.ref("start"),
        "End must be greater than start"
      ),
  }),

  audioBitrate: Yup.string()
    .oneOf(["96", "128"])
    .required("Audio bitrate is required"),
});

/* =========================================================
   TYPES
========================================================= */

interface SpotifyTrackType {
  name: string;
  artists: string;
  spotifyId: string;
  previewUrl?: string;
  spotifyUrl?: string;
}

interface SpotifySearchMultiProps {
  value: SpotifyTrackType[];
  onSelect: (
    track: SpotifyTrackType
  ) => void;
  onRemove: (
    spotifyId: string
  ) => void;
  disabled?: boolean;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const TrackUploaderComponentForm = () => {
  const utils = api.useUtils();

  const router = useRouter();

  const trackId = Array.isArray(
    router.query.id
  )
    ? router.query.id[0]
    : router.query.id;

  const {
    data: track,
    isLoading,
  } = api.track.getIdUpdate.useQuery(
    {
      id: String(trackId),
    },
    {
      enabled: !!trackId,
    }
  );

  const genre = useAtomValue(
    genreItemsAtom
  );

  const tag = useAtomValue(
    tagItemsAtom
  );

  const {
    mutateAsync: uploadUploader,
    isPending: isPublishing,
  } =
    api.track.updateReleases.useMutation({
      onSuccess: async () => {
        resetForm();

        await Promise.all([
          utils.track.getAllReleases.invalidate(),
          utils.track.getAllUploaded.invalidate(),
          utils.track.getIdUpdate.invalidate({
            id: trackId,
          }),
        ]);

        toast.success(
          "Successfully published"
        );

        await router.push(
          "/restricted/editor/uploader"
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
    setFieldValue,
    resetForm,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: track
        ? `${track.title
          ?.replaceAll(
            "[CLEAN]",
            ""
          )
          .replaceAll(
            "[DIRTY]",
            ""
          )
          .trim()}`
        : "",

      artist:
        track?.artist ?? "",

      bpm_start:
        track?.bpm_start ?? 0,

      bpm_end:
        track?.bpm_end ?? 0,
      energy:
        track?.energy ?? 5,

      is_explicit:
        track?.is_explicit ?? false,

      is_opm:
        Boolean(track?.is_opm),

      key:
        track?.in_key ?? "",

      release_year:
        track?.release_year ??
        new Date().getFullYear(),

      genre:
        track?.genre_track.map(
          (item) => item.genreId
        ) ?? [],

      price:
        track?.price ?? 0,

      tag:
        track?.tag_track.map(
          (item) => item.tagId
        ) ?? [],

      loopLength:
        track?.loopLength ?? 120,

      regionTime:
        (track?.regionTime as {
          start: number;
          end: number;
        }) ?? {
          start: 0,
          end: 90,
        },

      spotifyTracks:
        track?.spotify_track?.map(
          (spotifyTrack) => ({
            name:
              spotifyTrack.spotify.name,

            artists:
              spotifyTrack.spotify.artists,

            spotifyId:
              spotifyTrack.spotify
                .spotifyId,

            previewUrl:
              spotifyTrack.spotify
                .previewUrl ??
              undefined,

            spotifyUrl:
              spotifyTrack.spotify
                .spotifyUrl ??
              undefined,
          })
        ) ?? [],

      isOriginal: false,

      audioBitrate: "128",
    },

    validationSchema: postSchema,

    onSubmit: async (
      formValues
    ) => {
      if (
        !formValues.isOriginal &&
        formValues.spotifyTracks
          .length === 0
      ) {
        await setFieldTouched(
          "spotifyTracks",
          true,
          true
        );

        return;
      }

      await uploadUploader({
        id: String(trackId),

        title: formValues.title
          .replaceAll(
            "[CLEAN]",
            ""
          )
          .replaceAll(
            "[DIRTY]",
            ""
          )
          .replaceAll(
            /\(\s+/g,
            "("
          )
          .replaceAll(
            /\s+\)/g,
            ")"
          )
          .replaceAll(
            /\(\(+/g,
            "("
          )
          .replaceAll(
            /\)+\)/g,
            ")"
          )
          .replaceAll(
            /([^\s])\(/g,
            "$1 ("
          )
          .trim(),

        artist:
          formValues.artist,

        bpm_start:
          formValues.bpm_start,

        bpm_end:
          formValues.bpm_end,
        energy:
          formValues.energy,

        in_key:
          formValues.key,

        release_year:
          formValues.release_year,

        loopLength:
          formValues.loopLength,

        regionTime:
          formValues.regionTime,

        price:
          formValues.price,

        is_opm:
          formValues.is_opm,

        is_explicit:
          formValues.is_explicit,

        genre:
          formValues.genre,

        tag:
          formValues.tag,

        download_key:
          track?.download_key ?? "",

        spotifyTracks:
          formValues.spotifyTracks.map(
            (spotifyTrack) => ({
              name:
                spotifyTrack.name,

              artists:
                spotifyTrack.artists,

              spotifyId:
                spotifyTrack.spotifyId,

              previewUrl:
                spotifyTrack.previewUrl ??
                undefined,

              spotifyUrl:
                spotifyTrack.spotifyUrl ??
                undefined,
            })
          ),

        is_published: true,

        enabledSnippet: true,

        audioBitrate:
          formValues.audioBitrate,
      });
    },
  });

  const busy =
    isSubmitting ||
    isPublishing;

  if (isLoading) {
    return (
      <LoadingSkeletonComponents
        className="
          mt-5
          h-96
          w-full
          rounded-3xl
        "
      />
    );
  }

  if (!track) {
    return (
      <EmptyComponent
        title="404 Not Found"
        className="mt-5"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        w-full
        flex-col
        gap-5
        pt-3
      "
    >
      {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        <SectionHeader
          icon={Disc3}
          title="Track Information"
          description="Title, artist, release details and pricing"
          badge="01"
        />

        <div className="space-y-5 p-4 sm:p-5">
          {/* TITLE */}
          <FieldGroup
            label="Title"
            error={
              touched.title
                ? errors.title
                : undefined
            }
          >
            <Input
              type="text"
              placeholder="Track title"
              disabled={busy}
              id="title"
              name="title"
              value={values.title}
              onChange={
                handleChange
              }
              onBlur={handleBlur}
              className={inputClassName}
            />
          </FieldGroup>

          {/* ARTIST */}
          <FieldGroup
            label="Artist"
            error={
              touched.artist
                ? errors.artist
                : undefined
            }
          >
            <div
              className="
                mb-2
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-[#B9FF00]/10
                bg-[#B9FF00]/[0.035]
                px-3
                py-2.5
              "
            >
              <CircleAlert
                className="
                  mt-0.5
                  h-3.5
                  w-3.5
                  shrink-0
                  text-[#B9FF00]
                "
              />

              <p className="text-[10px] leading-5 text-zinc-500">
                Keep the original
                artist information
                accurate. Avoid
                replacing the
                original artist name
                with your DJ name.
              </p>
            </div>

            <Input
              type="text"
              placeholder="Artist"
              disabled={busy}
              id="artist"
              name="artist"
              value={values.artist}
              onChange={
                handleChange
              }
              onBlur={handleBlur}
              className={inputClassName}
            />
          </FieldGroup>

          {/* YEAR + BPM */}
          <div className="grid gap-4 md:grid-cols-3">
            <FieldGroup
              label="Release Year"
              error={
                touched.release_year
                  ? errors.release_year
                  : undefined
              }
            >
              <Input
                type="number"
                placeholder="Release year"
                disabled={busy}
                id="release_year"
                name="release_year"
                autoComplete="off"
                value={
                  values.release_year
                }
                onChange={
                  handleChange
                }
                onBlur={
                  handleBlur
                }
                className={
                  inputClassName
                }
              />
            </FieldGroup>

            <FieldGroup
              label="BPM Start"
              error={
                touched.bpm_start
                  ? errors.bpm_start
                  : undefined
              }
            >
              <div className="relative">
                <Gauge
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-zinc-600
                  "
                />

                <Input
                  type="number"
                  placeholder="BPM start"
                  disabled={busy}
                  id="bpm_start"
                  name="bpm_start"
                  autoComplete="off"
                  value={
                    values.bpm_start
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </FieldGroup>

            <FieldGroup
              label="BPM End"
              error={
                touched.bpm_end
                  ? errors.bpm_end
                  : undefined
              }
            >
              <div className="relative">
                <Gauge
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-zinc-600
                  "
                />

                <Input
                  type="number"
                  placeholder="BPM end"
                  disabled={busy}
                  id="bpm_end"
                  name="bpm_end"
                  autoComplete="off"
                  value={
                    values.bpm_end
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handleBlur
                  }
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </FieldGroup>
          </div>

          {/* PRICE */}
          <FieldGroup
            label="Price"
            error={
              touched.price
                ? errors.price
                : undefined
            }
          >
            <div
              className="
                grid
                gap-2
                sm:grid-cols-[1fr_auto]
              "
            >
              <div className="relative">
                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    text-zinc-600
                  "
                >
                  $
                </span>

                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Price"
                  disabled={busy}
                  id="price"
                  name="price"
                  autoComplete="off"
                  value={
                    values.price >
                      0
                      ? values.price /
                      100
                      : ""
                  }
                  onChange={(
                    event
                  ) => {
                    const raw =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (
                      raw === ""
                    ) {
                      void setFieldValue(
                        "price",
                        0
                      );

                      return;
                    }

                    void setFieldValue(
                      "price",
                      parseInt(
                        raw,
                        10
                      ) * 100
                    );
                  }}
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "." ||
                      event.key ===
                      ","
                    ) {
                      event.preventDefault();
                    }
                  }}
                  onBlur={
                    handleBlur
                  }
                  className={`${inputClassName} pl-8`}
                />
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                  px-4
                  py-2
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-zinc-600
                  "
                >
                  Selling Price
                </p>

                <p
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  {Number(
                    values.price /
                    100
                  ).toLocaleString(
                    "en-US",
                    {
                      style:
                        "currency",
                      currency:
                        "USD",
                    }
                  )}
                </p>
              </div>
            </div>
          </FieldGroup>
        </div>
      </section>

      <VocalLyricsSection
        value={values.is_explicit}
        disabled={busy}
        onChange={(value) =>
          void setFieldValue("is_explicit", value)
        }
      />

      <EnergySection
        value={values.energy}
        disabled={busy}
        error={touched.energy ? errors.energy : undefined}
        onChange={async (value) => {
          await setFieldTouched("energy", true, false);
          await setFieldValue("energy", value);
        }}
      />

      <MusicKeySection
        value={values.key}
        disabled={busy}
        error={touched.key ? errors.key : undefined}
        onChange={async (value) => {
          await setFieldTouched("key", true, false);
          await setFieldValue("key", value);
        }}
      />

      <GenresSection
        items={genre}
        value={values.genre}
        disabled={busy}
        error={
          touched.genre &&
            typeof errors.genre === "string"
            ? errors.genre
            : undefined
        }
        onChange={async (value) => {
          await setFieldTouched("genre", true, false);
          await setFieldValue("genre", value);
        }}
      />

      <TagsSection
        items={tag}
        value={values.tag}
        disabled={busy}
        error={
          touched.tag && typeof errors.tag === "string"
            ? errors.tag
            : undefined
        }
        onChange={async (value) => {
          await setFieldTouched("tag", true, false);
          await setFieldValue("tag", value);
        }}
      />

      {/* =====================================================
                ORIGINAL COMPOSITION
            ===================================================== */}



      {/* =====================================================
          SNIPPET
      ===================================================== */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        <SectionHeader
          icon={AudioLines}
          title="Audio Snippet"
          description="Choose the preview region and bitrate"
          badge={`${values.audioBitrate} kbps`}
        />

        <div className="space-y-5 p-4 sm:p-5">
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#111518]/20
              p-2
            "
          >
            <SongPreviewWaveform
              id={String(trackId)}
              loopLength={
                values.loopLength
              }
              regionTime={
                values.regionTime
              }
              onRegionChange={(
                value
              ) =>
                void setFieldValue(
                  "regionTime",
                  value
                )
              }
              onLoopLengthChange={(
                value
              ) =>
                void setFieldValue(
                  "loopLength",
                  value
                )
              }
            />
          </div>

          {/* BITRATE */}
          <div>
            <p
              className="
                mb-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.15em]
                text-zinc-600
              "
            >
              Snippet Bitrate
            </p>

            <div className="grid grid-cols-2 gap-2 sm:max-w-[360px]">
              {["96", "128"].map(
                (bitrate) => {
                  const selected =
                    values.audioBitrate ===
                    bitrate;

                  return (
                    <button
                      type="button"
                      key={bitrate}
                      disabled={busy}
                      onClick={() =>
                        void setFieldValue(
                          "audioBitrate",
                          bitrate
                        )
                      }
                      className={`
                        flex
                        h-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        text-xs
                        font-semibold
                        transition-all

                        ${selected
                          ? `
                              border-[#B9FF00]/30
                              bg-[#B9FF00]
                              text-black
                            `
                          : `
                              border-white/[0.06]
                              bg-white/[0.015]
                              text-zinc-500
                              hover:bg-white/[0.04]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {selected && (
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                      )}

                      {bitrate} kbps
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORIGINAL COMPOSITION / SPOTIFY
      ===================================================== */}
      <OriginalCompositionSection
        artist={values.artist}
        title={values.title}
        isExplicit={values.is_explicit}
        isOriginal={values.isOriginal}
        spotifyTracks={values.spotifyTracks}
        disabled={busy}
        error={
          touched.spotifyTracks &&
            typeof errors.spotifyTracks === "string"
            ? errors.spotifyTracks
            : undefined
        }
        onOriginalChange={(value) => {
          void setFieldValue("isOriginal", value);
        }}
        onSpotifyTracksChange={(tracks) => {
          void setFieldValue("spotifyTracks", tracks);
        }}
      />

      {/* =====================================================
          PUBLISH
      ===================================================== */}
      <section
        className="
          flex
          flex-col
          gap-3
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-4
        "
      >
        <div className="px-1">
          <p className="text-xs font-medium text-zinc-300">
            Ready to publish?
          </p>

          <p
            className="
              mt-1
              max-w-xl
              text-[10px]
              leading-5
              text-zinc-600
            "
          >
            Review the metadata,
            snippet, key, genres,
            tags and source
            information before
            publishing this track.
          </p>
        </div>

        <Button
          type="submit"
          disabled={busy}
          className="
            h-11
            min-w-[190px]
            rounded-xl
            bg-[#B9FF00]
            px-5
            text-xs
            font-semibold
            text-black
            hover:bg-[#B9FF00]
            disabled:bg-[#B9FF00]/40
            disabled:text-black/60
          "
        >
          {busy ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Publish Track
            </>
          )}
        </Button>
      </section>
    </form>
  );
};

export default TrackUploaderComponentForm;

const inputClassName = `
  h-11
  rounded-xl
  border-white/[0.2]
  bg-white/[0.025]
  px-3
  text-sm
  text-zinc-200
  placeholder:text-zinc-700
  focus-visible:border-[#B9FF00]/30
  selection:bg-yellow-100
  selection:text-black
  focus-visible:ring-[#B9FF00]/10
`;


type FieldGroupProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FieldGroup = ({
  label,
  error,
  children,
}: FieldGroupProps) => {
  return (
    <div className="grid gap-2">
      <NamingWithError
        title={label}
        message={error}
      />

      {children}

      {error && (
        <FieldError
          message={error}
        />
      )}
    </div>
  );
};

const FieldError = ({
  message,
}: {
  message: string;
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        text-[10px]
        font-medium
        text-red-400
      "
    >
      <CircleAlert className="h-3 w-3 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

const NamingWithError = ({
  title,
  message,
}: {
  title: string;
  message?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] font-medium text-zinc-400">
        {title}
      </label>

      {message && (
        <span className="text-[11px] font-medium bg-red-500 text-red-100 px-2">REQUIRED</span>
      )}
    </div>
  );
};
