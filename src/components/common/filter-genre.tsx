import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDown, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { Checkbox } from "../ui/checkbox"
import { genreItemsAtom } from "@/state/genreAtoms"
import { useAtomValue } from "jotai"

const DataGenreComponent = () => {
  // URL state
  const [genres, setGenres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const genreList = useAtomValue(genreItemsAtom)

  const toggleGenre = (slug: string) => {
    // update genres
    void setGenres((prev) => {
      const exists = prev.includes(slug)

      const next = exists
        ? prev.filter((g) => g !== slug)
        : [...prev, slug]

      return next
    })

    // reset page
    void setPage(1)
  }

  // When resetting
  const resetGenres = () => {
    void setGenres([])
    void setPage(1)
  }

  return (
    <Popover>
      <PopoverTrigger
  id="genre"
  aria-label="genre"
  className="
    group
    flex
    h-10
    w-full
    items-center
    justify-between
    gap-3
    rounded-lg
    border
    border-white/10
    bg-white/[0.03]
    px-3
    text-xs
    font-medium
    uppercase
    tracking-wider
    text-zinc-400
    outline-none
    transition-all
    duration-200
    hover:border-white/20
    hover:bg-white/[0.06]
    hover:text-white
    data-[state=open]:border-[#B9FF00]/40
    data-[state=open]:bg-[#B9FF00]/[0.05]
    data-[state=open]:text-[#B9FF00]
  "
>
  <span className="flex items-center gap-2">
    <span>Genre</span>

    {genres.length > 0 && (
      <span
        className="
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          bg-[#B9FF00]
          px-1.5
          py-0.5
          text-[8px]
          font-bold
          text-black
        "
      >
        {genres.length}
      </span>
    )}
  </span>

  <ChevronDown
    className="
      h-3.5
      w-3.5
      text-zinc-500
      transition-transform
      duration-200
      group-data-[state=open]:rotate-180
      group-data-[state=open]:text-[#B9FF00]
    "
  />
</PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          "w-[280px] sm:w-[320px]",
          "overflow-hidden",
          "rounded-xl",
          "border border-zinc-700",
          "bg-zinc-950",
          "p-0",
          "text-zinc-100",
          "shadow-xl shadow-black/40"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Genre
            </h3>

            <p className="mt-0.5 text-[11px] text-zinc-500">
              Select one or more genres
            </p>
          </div>

          {genres.length > 0 && (
            <span
              className="
                rounded-full
                bg-yellow-500/10
                px-2 py-1
                text-[10px]
                font-medium
                text-[#B9FF00]
              "
            >
              {genres.length} selected
            </span>
          )}
        </div>

        {/* Genre list */}
        <div
          className="
            h-[300px]
            overflow-y-auto
            p-3
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-700
          "
        >
          <div className="flex flex-col gap-1">
            {genreList?.map((item) => {
              const active = genres.includes(String(item.slug))

              return (
                <label
                  key={item.id}
                  className={cn(
                    "group flex cursor-pointer items-center gap-3",
                    "rounded-lg px-3 py-2",
                    "text-sm",
                    "transition-all duration-150",
                    "text-zinc-400",
                    "hover:bg-zinc-800",
                    "hover:text-zinc-100",
                    active &&
                      "bg-yellow-500/10 text-[#B9FF00]"
                  )}
                >
                  <Checkbox
                    checked={active}
                    className={cn(
                      "h-4 w-4",
                      "border-zinc-600",
                      "data-[state=checked]:border-yellow-500",
                      "data-[state=checked]:bg-yellow-500",
                      "data-[state=checked]:text-zinc-950"
                    )}
                    onCheckedChange={() =>
                      toggleGenre(item.slug)
                    }
                  />

                  <span
                    className={cn(
                      "flex-1 truncate",
                      "text-zinc-400",
                      active &&
                        "font-medium text-[#B9FF00]"
                    )}
                  >
                    {item.name}
                  </span>

                  {active && (
                    <span
                      className="
                        h-1.5 w-1.5
                        shrink-0
                        rounded-full
                        bg-[#B9FF00]
                      "
                    />
                  )}
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            border-t
            border-zinc-800
            bg-zinc-900/80
            p-3
          "
        >
          <button
            onClick={resetGenres}
            disabled={genres.length === 0}
            className={cn(
              "flex w-full items-center justify-center gap-2",
              "rounded-md",
              "border border-zinc-700",
              "bg-zinc-800",
              "px-3 py-2",
              "text-xs font-medium",
              "text-zinc-300",
              "transition-all duration-200",
              "hover:border-yellow-700",
              "hover:bg-yellow-500/10",
              "hover:text-[#B9FF00]",
              "disabled:pointer-events-none",
              "disabled:opacity-40"
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Genres
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DataGenreComponent