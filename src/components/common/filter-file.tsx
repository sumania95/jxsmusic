import React from "react"
import { Checkbox } from "../ui/checkbox"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

const FilterFileTypeComponent = () => {
  const [filetypes, setFiletypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum(["audio", "video"])
    ).withDefault([])
  )

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  return (
    <div className="flex w-full items-center gap-2">
      {/* AUDIO */}
      <label
        className="
          group
          flex
          flex-1
          cursor-pointer
          items-center
          gap-2
          rounded-lg
          border
          border-white/10
          bg-white/[0.02]
          px-3
          py-2
          text-[10px]
          font-medium
          uppercase
          tracking-wider
          text-zinc-500
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.05]
          hover:text-zinc-200
          has-[:checked]:border-[#B9FF00]/30
          has-[:checked]:bg-[#B9FF00]/[0.06]
          has-[:checked]:text-[#B9FF00]
        "
      >
        <Checkbox
          checked={filetypes.includes("audio")}
          onCheckedChange={(checked) => {
            void setFiletypes((prev) =>
              checked
                ? [...prev, "audio"]
                : prev.filter((v) => v !== "audio")
            )

            void setPage(1)
          }}
          className="
            h-3.5
            w-3.5
            border-white/20
            data-[state=checked]:border-[#B9FF00]
            data-[state=checked]:bg-[#B9FF00]
            data-[state=checked]:text-black
          "
        />

        <span>Audio</span>
      </label>

      {/* VIDEO */}
      <label
        className="
          group
          flex
          flex-1
          cursor-pointer
          items-center
          gap-2
          rounded-lg
          border
          border-white/10
          bg-white/[0.02]
          px-3
          py-2
          text-[10px]
          font-medium
          uppercase
          tracking-wider
          text-zinc-500
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.05]
          hover:text-zinc-200
          has-[:checked]:border-[#B9FF00]/30
          has-[:checked]:bg-[#B9FF00]/[0.06]
          has-[:checked]:text-[#B9FF00]
        "
      >
        <Checkbox
          checked={filetypes.includes("video")}
          onCheckedChange={(checked) => {
            void setFiletypes((prev) =>
              checked
                ? [...prev, "video"]
                : prev.filter((v) => v !== "video")
            )

            void setPage(1)
          }}
          className="
            h-3.5
            w-3.5
            border-white/20
            data-[state=checked]:border-[#B9FF00]
            data-[state=checked]:bg-[#B9FF00]
            data-[state=checked]:text-black
          "
        />

        <span>Video</span>
      </label>
    </div>
  )
}

export default FilterFileTypeComponent