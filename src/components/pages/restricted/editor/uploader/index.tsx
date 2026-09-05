import React, { useEffect } from "react";
import EmptyComponent from "../../../common/empty";
import { api } from "@/utils/api";
import PaginationNewComponents from "@/components/common/pagination-new";
import { defaultPageLimit } from "@/state/globalState";
import { useAtom } from "jotai";
import { parseAsInteger, useQueryState } from "nuqs";
import { ProfileMeta } from "@/components/common/metadata";
import NewDropzoneTrackComponent from "@/components/common/dropzone-new";
import { uploadedTracksAtom } from "@/state/uploadAtoms";
import BannerTitleComponent from "@/components/common/banner-title";
import TrackUploadedItemComponent from "./data-item";

const UploaderComponent = () => {
  const itemSkeleton: number[] = Array.from(
    { length: 20 },
    (_, index) => index + 1
  );

  const [defaultLimit] = useAtom(defaultPageLimit);

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  );

  const [uploadedTracks, setUploadedTracks] = useAtom(
    uploadedTracksAtom
  );

  const { data, isLoading } =
    api.track.getAllUploaded.useQuery({
      search: "",
      genre: [],
      key: [],
      bpm_start: 0,
      bpm_end: 200,
      skip: Number(Number(pager) * limit - limit),
      take: limit,
    });

  useEffect(() => {
    if (!data) return;

    setUploadedTracks({
      count: data.count,
      tracks: data.tracks,
    });
  }, [data, setUploadedTracks]);

  const playlist = uploadedTracks.tracks?.map(
    ({ id, filename, download_key }, index) => ({
      index,
      id,
      title: String(filename),
      artist: "",
      version: "",
      key: String(download_key),
      bucketName: "jxs-music",
      isFull: true,
    })
  );

  return (
    <div className="flex w-full flex-col gap-5 text-zinc-300">
      <ProfileMeta
        title="Uploader"
        description="Collection of DJ Music"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      {/* <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-180px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Jeff92 & Ayan Sumania Uploader
            </span>
          </div>

          <BannerTitleComponent
            title="Uploaded Tracks"
            description="Upload, review, and manage your DJ music before publishing."
          />
        </div>
      </section> */}

      {/* =====================================================
          DROPZONE
      ===================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-3
          sm:p-4
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-[-100px]
            bottom-[-180px]
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#B9FF00]/[0.02]
            blur-[100px]
          "
        />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00]" />

                <h2 className="text-sm font-semibold text-white">
                  Upload Music
                </h2>
              </div>

              <p className="mt-1 text-[11px] text-zinc-600">
                Add new tracks to your Jeff92 & Ayan Sumania uploader library.
              </p>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                px-3
                py-1
                text-[9px]
                font-medium
                uppercase
                tracking-[0.15em]
                text-zinc-600
                sm:block
              "
            >
              Upload
            </span>
          </div>
            <NewDropzoneTrackComponent />
        </div>
      </section>

      {/* =====================================================
          TRACK LIBRARY
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
        {/* Section heading */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-white/[0.06]
            px-4
            py-4
            sm:px-5
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00]" />

              <h2 className="text-sm font-semibold text-white">
                Track Library
              </h2>
            </div>

            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Your uploaded music
            </p>
          </div>

          <div
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-1.5
              text-[10px]
              font-medium
              text-zinc-500
            "
          >
            {uploadedTracks.count._count.id}{" "}
            {uploadedTracks.count._count.id === 1
              ? "Track"
              : "Tracks"}
          </div>
        </div>

        {/* Track content */}
        <div className="flex flex-col gap-2 p-2 sm:p-3">
          {/* Loading */}
          {isLoading &&
            itemSkeleton.map((_, index) => (
              <div
                key={index}
                className="
                  flex
                  min-h-16
                  w-full
                  animate-pulse
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.02]
                  px-3
                "
              >
                <div className="h-4 w-4 shrink-0 rounded bg-white/5" />

                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5" />

                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-3 w-40 rounded bg-white/5" />
                  <div className="h-2.5 w-24 rounded bg-white/5" />
                </div>

                <div className="hidden h-3 w-16 rounded bg-white/5 md:block" />
              </div>
            ))}

          {/* Empty */}
          {!isLoading &&
            uploadedTracks.count._count.id === 0 && (
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
                  p-4
                "
              >
                <EmptyComponent />
              </div>
            )}

          {/* Uploaded tracks */}
          {!isLoading &&
            uploadedTracks.tracks?.map((track, index) => (
              <div
                key={track.id}
                className="
                  group
                  relative
                  w-full
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
                {/* Active-style hover indicator */}
                <div
                  className="
                    absolute
                    left-0
                    top-1/2
                    z-10
                    h-8
                    w-0.5
                    -translate-y-1/2
                    rounded-full
                    bg-[#B9FF00]
                    opacity-0
                    shadow-[0_0_10px_rgba(185,255,0,0.4)]
                    transition-opacity
                    duration-200
                    group-hover:opacity-100
                  "
                />

                <TrackUploadedItemComponent
                  {...track}
                  index_key={index}
                  playlist={playlist}
                  postNumber={
                    limit * Number(pager) -
                    limit +
                    index +
                    1
                  }
                />
              </div>
            ))}
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}
        {uploadedTracks.count._count.id > 0 && (
          <div
            className="
              border-t
              border-white/[0.06]
              bg-[#111518]/10
              px-3
              py-3
              sm:px-4
            "
          >
            <PaginationNewComponents
              totalItems={Number(
                uploadedTracks.count._count.id
              )}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default UploaderComponent;