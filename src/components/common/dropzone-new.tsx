import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { api } from '@/utils/api'
import axios from 'axios'
import { UploadIcon } from 'lucide-react'
import { isVideoUploaderAtom } from '@/state/userRoleAtoms'
import { useAtom } from 'jotai'
import { uploadInBatches } from '@/utils/uploadBatch'
import {
  uploadListAtom,
  addUploadsAtom,
  updateUploadAtom,
  removeUploadAtom,
  type UploadItem,
  addUploadedTrackAtom,
} from '@/state/uploadAtoms'
import { Card } from '../ui/card'
import { parseAsInteger, useQueryState } from 'nuqs'
import { defaultPageLimit } from '@/state/globalState'

const MAX_AUDIO_SIZE = 30 * 1024 * 1024
const MAX_VIDEO_SIZE = 400 * 1024 * 1024
// const MAX_FILES = 30
const BATCH_SIZE = 3

const DropzoneTrackComponent = () => {
  const [isVideoUploader] = useAtom(isVideoUploaderAtom)
  const [, addUploads] = useAtom(addUploadsAtom)
  const [, updateUpload] = useAtom(updateUploadAtom)
  const [, removeUpload] = useAtom(removeUploadAtom)
  const [uploads] = useAtom(uploadListAtom)
  const [,addUploadedTrack] = useAtom(addUploadedTrackAtom)
  const utils = api.useUtils()
  const [defaultLimit] = useAtom(defaultPageLimit)
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(defaultLimit))
  const { mutateAsync: putObject } = api.signedUrl.putObject.useMutation()
  const { mutateAsync: updateTrack } = api.track.create.useMutation({
    onError: (e: unknown) => {
      let failedId: string | null = null;
      let errorMessage = "Unknown error";

      // Narrow e to object with a message string
      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
        errorMessage = e.message;

        // Try parsing JSON if backend encoded id and originalError
        try {
          const parsed = JSON.parse(e.message) as unknown;

          if (parsed && typeof parsed === "object") {
            // Safe type checks
            if ("id" in parsed && typeof (parsed as Record<string, unknown>).id === "string") {
              failedId = (parsed as { id: string }).id;
            }
            if ("originalError" in parsed && typeof (parsed as Record<string, unknown>).originalError === "string") {
              errorMessage = (parsed as { originalError: string }).originalError;
            }
          }
        } catch {
          // Not JSON, leave errorMessage as-is
        }
      }

      // Optional: check for duplicates
      if (errorMessage.toLowerCase().includes("unique")) {
        errorMessage = "Duplicated track";
      }

      // Update state safely
      updateUpload({
        id: failedId ?? "",
        status: "error",
        error: errorMessage,
      });
    }



  })

  return (
  <div className="my-5 w-full">
    <Dropzone
      multiple
      accept={
        isVideoUploader
          ? {
              "audio/mpeg": [".mp3"],
              "video/mp4": [".mp4"],
            }
          : {
              "audio/mpeg": [".mp3"],
            }
      }
      onDrop={async (acceptedFiles) => {
        const validFiles: { file: File; id: string }[] = []
        const newUploads: UploadItem[] = []

        // VALIDATION
        for (const file of acceptedFiles) {
          const id =
            globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random()}`

          const original = file.name

          try {
            /* ---------- EXTENSION VALIDATION ---------- */
            const extRegex = /\.(mp3|mp4)$/i
            const extMatch = extRegex.exec(original)

            if (!extMatch) {
              throw new Error(
                "Only .mp3 or .mp4 files are allowed."
              )
            }

            const extension =
              extMatch[1]?.toLowerCase()

            if (
              extension === "mp4" &&
              !isVideoUploader
            ) {
              throw new Error(
                "MP4 uploads are only allowed for video editors."
              )
            }

            if (
              extension === "mp3" &&
              file.size > MAX_AUDIO_SIZE
            ) {
              throw new Error(
                "MP3 file exceeds 30MB limit."
              )
            }

            if (
              extension === "mp4" &&
              file.size > MAX_VIDEO_SIZE
            ) {
              throw new Error(
                "MP4 file exceeds 400MB limit."
              )
            }

            /* ---------- FILENAME NORMALIZATION ---------- */
            let base = original
              .replace(/\.(mp3|mp4)$/i, "")
              .trim()

            base = base.replace(/\s+/g, " ")

            /* ---------- TAG VALIDATION ---------- */
            if (!/\[(CLEAN|DIRTY)\]$/i.test(base)) {
              base = `${base} [CLEAN]`
            }

            const tagMatch =
              /\[(CLEAN|DIRTY)\]$/i.exec(base)!

            const tag =
              tagMatch[0].toUpperCase()

            const nameWithoutTag = base
              .replace(/\[(CLEAN|DIRTY)\]$/i, "")
              .trim()

            const finalName =
              `${nameWithoutTag} ${tag}.${extension}`

            Object.defineProperty(
              file,
              "name",
              {
                value: finalName,
                writable: false,
              }
            )

            validFiles.push({
              file,
              id,
            })

            newUploads.push({
              id,
              name: finalName,
              progress: 0,
              status: "pending",
            })
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : "Invalid file"

            newUploads.push({
              id,
              name: original,
              progress: 0,
              status: "error",
              error: message,
            })
          }
        }

        // Add to Jotai
        addUploads(newUploads)

        // Batch upload
        await uploadInBatches(
          validFiles,
          BATCH_SIZE,
          async ({ file, id }) => {
            updateUpload({
              id,
              status: "uploading",
            })

            const ext =
              file.name.split(".").pop()!

            const isVideo =
              ext === "mp4"

            const key =
              `${
                isVideo
                  ? "jxs/video/download"
                  : "jxs/download"
              }/${id}.${ext}`

            const upload =
              await putObject({
                key,
                type: file.type,
              })

            try {
              await axios.put(
                upload.url,
                file,
                {
                  onUploadProgress: ({
                    loaded,
                    total,
                  }) => {
                    const percent =
                      Math.floor(
                        (loaded * 100) /
                          (total ?? 1)
                      )

                    updateUpload({
                      id,
                      progress:
                        percent,
                    })
                  },
                }
              )

              const data =
                await updateTrack({
                  bucketName:
                    upload.bucket,
                  key:
                    upload.key,
                  size:
                    file.size,
                  fileType:
                    file.type,
                  fileName:
                    file.name,
                  id:
                    id,
                })

              addUploadedTrack({
                track: {
                  id:
                    data.id,
                  download_key:
                    data.download_key,
                  title:
                    data.title,
                  artist:
                    data.artist,
                  filename:
                    data.filename,
                  description:
                    data.description,
                  duration:
                    data.duration,
                  bpm_start:
                    data.bpm_start,
                  bpm_end:
                    data.bpm_end,
                  in_key:
                    data.in_key,
                  releaseAt:
                    new Date(
                      data.releaseAt
                    ),
                },
                limit,
                page,
              })

              updateUpload({
                id,
                status: "done",
                progress: 100,
              })
            } catch {
              updateUpload({
                id,
                status: "error",
              })
            }
          }
        )
      }}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
      }) => (
        <div
          {...getRootProps()}
          className={`
            group
            relative
            flex
            min-h-44
            w-full
            cursor-pointer
            items-center
            justify-center
            overflow-hidden
            rounded-3xl
            border
            border-dashed
            px-6
            py-8
            transition-all
            duration-200
            ${
              isDragActive
                ? `
                    border-[#B9FF00]/40
                    bg-[#B9FF00]/[0.05]
                  `
                : `
                    border-white/10
                    bg-white/[0.02]
                    hover:border-[#B9FF00]/20
                    hover:bg-white/[0.035]
                  `
            }
          `}
        >
          <input
            {...getInputProps()}
          />

          {/* Ambient glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-64
              w-64
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#B9FF00]/[0.025]
              blur-[90px]
            "
          />

          <div
            className="
              relative
              flex
              max-w-lg
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            {/* Icon */}
            <div
              className="
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                text-zinc-500
                transition-all
                group-hover:border-[#B9FF00]/20
                group-hover:bg-[#B9FF00]/[0.06]
                group-hover:text-[#B9FF00]
              "
            >
              <UploadIcon className="h-6 w-6" />
            </div>

            {/* Label */}
            <div className="mb-2 flex items-center gap-2">
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
                Jeff92 & Ayan Sumania Upload
              </span>
            </div>

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-zinc-300
              "
            >
              {isDragActive
                ? "Drop files here"
                : "Drag & drop files here"}
            </p>

            <p
              className="
                mt-2
                max-w-md
                text-[10px]
                leading-5
                text-zinc-600
              "
            >
              {isVideoUploader
                ? "MP3 up to 30MB or MP4 up to 400MB"
                : "MP3 files up to 30MB"}
            </p>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-zinc-700
              "
            >
              Click to browse or drag files into this area
            </p>
          </div>
        </div>
      )}
    </Dropzone>

    {/* =====================================================
        UPLOAD PROGRESS
    ===================================================== */}
    {uploads.length > 0 && (
      <Card
        className="
          mt-4
          w-full
          space-y-2
          rounded-3xl
          border
          border-white/10
          bg-white/[0.02]
          p-3
          shadow-none
          sm:p-4
        "
      >
        {/* Progress header */}
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
            pb-3
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.6)]
                "
              />

              <h3
                className="
                  text-xs
                  font-semibold
                  text-zinc-300
                "
              >
                Upload Queue
              </h3>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-zinc-600
              "
            >
              {uploads.length}
              {" "}
              {uploads.length === 1
                ? "file"
                : "files"}
            </p>
          </div>
        </div>

        {/* Upload rows */}
        {uploads.map(
          (u, index) => (
            <div
              key={u.id}
              className={`
                rounded-2xl
                border
                px-4
                py-3
                transition-all
                duration-300
                ${
                  u.status === "error"
                    ? `
                        border-red-500/15
                        bg-red-500/[0.035]
                      `
                    : u.status === "done"
                    ? `
                        border-green-500/10
                        bg-green-500/[0.025]
                      `
                    : `
                        border-white/[0.06]
                        bg-white/[0.015]
                      `
                }
              `}
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  {/* Number */}
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      text-[9px]
                      font-semibold
                      text-zinc-600
                    "
                  >
                    {index + 1}
                  </span>

                  {/* Filename */}
                  <span
                    className="
                      truncate
                      text-xs
                      font-medium
                      text-zinc-400
                    "
                  >
                    {u.name}
                  </span>
                </div>

                {/* Right */}
                {u.status === "error" ? (
                  <button
                    type="button"
                    onClick={() =>
                      removeUpload(
                        u.id
                      )
                    }
                    className="
                      shrink-0
                      cursor-pointer
                      rounded-lg
                      border
                      border-red-500/10
                      bg-red-500/[0.05]
                      px-2.5
                      py-1.5
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-wider
                      text-red-400
                      transition-all
                      hover:border-red-500/20
                      hover:bg-red-500/10
                    "
                  >
                    Remove
                  </button>
                ) : (
                  <span
                    className="
                      shrink-0
                      text-[10px]
                      font-medium
                      tabular-nums
                      text-zinc-500
                    "
                  >
                    {u.progress}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div
                className="
                  mt-3
                  h-1.5
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-white/[0.06]
                "
              >
                <div
                  className={`
                    h-full
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      u.status === "error"
                        ? "bg-red-500"
                        : u.status === "done"
                        ? "bg-green-400"
                        : "bg-[#B9FF00]"
                    }
                  `}
                  style={{
                    width:
                      `${u.progress}%`,
                  }}
                />
              </div>

              {/* Status / Error */}
              {u.status === "error" ? (
                <p
                  className="
                    mt-2
                    text-[10px]
                    leading-5
                    text-red-400
                  "
                >
                  {u.error ??
                    "Upload failed. Please remove or retry."}
                </p>
              ) : (
                <p
                  className="
                    mt-2
                    text-[9px]
                    uppercase
                    tracking-[0.1em]
                    text-zinc-700
                  "
                >
                  {u.status === "pending" &&
                    "Waiting"}

                  {u.status === "uploading" &&
                    "Uploading"}

                  {u.status === "done" &&
                    "Upload complete"}
                </p>
              )}
            </div>
          )
        )}
      </Card>
    )}
  </div>
)
}

export default DropzoneTrackComponent
