import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { ChevronDown, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { Checkbox } from "../ui/checkbox"
import { useAtomValue } from "jotai"
import { tagItemsAtom } from "@/state/tagAtoms"


const DataTagComponent = () => {
  // URL state
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const tagList = useAtomValue(tagItemsAtom)


  const toggleTag = (slug: string) => {
    void setTags((prev) => {
      const exists = prev.includes(slug)

      const next = exists
        ? prev.filter((g) => g !== slug)
        : [...prev, slug]

      return next
    })

    void setPage(1)
  }


  const resetTags = () => {
    void setTags([])
    void setPage(1)
  }


  return (
    <Popover>
      {/* =====================================================
          TRIGGER
      ===================================================== */}
      <PopoverTrigger
        id="tag"
        aria-label="tag"
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
          <span>Tag</span>

          {tags.length > 0 && (
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
              {tags.length}
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


      {/* =====================================================
          POPOVER
      ===================================================== */}
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          "w-[280px] sm:w-[320px]",
          "overflow-hidden",
          "rounded-xl",
          "border border-white/10",
          "bg-zinc-950",
          "p-0",
          "text-zinc-100",
          "shadow-2xl shadow-black/60"
        )}
      >
        {/* =================================================
            HEADER
        ================================================= */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-white/[0.07]
            bg-white/[0.02]
            px-4
            py-3
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Tags
            </h3>

            <p
              className="
                mt-0.5
                text-[10px]
                uppercase
                tracking-wider
                text-zinc-600
              "
            >
              Select one or more tags
            </p>
          </div>


          {tags.length > 0 && (
            <span
              className="
                shrink-0
                rounded-full
                border
                border-[#B9FF00]/15
                bg-[#B9FF00]/[0.07]
                px-2.5
                py-1
                text-[9px]
                font-medium
                uppercase
                tracking-wide
                text-[#B9FF00]
              "
            >
              {tags.length} selected
            </span>
          )}
        </div>


        {/* =================================================
            TAG LIST
        ================================================= */}
        <div
          className="
            h-[300px]
            overflow-y-auto
            p-2
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-800
          "
        >
          <div className="flex flex-col gap-1">
            {tagList?.map((item) => {
              const active = tags.includes(
                String(item.slug)
              )

              return (
                <label
                  key={item.id}
                  className={cn(
                    `
                      group
                      relative
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-lg
                      border
                      border-transparent
                      px-3
                      py-2.5
                      text-sm
                      transition-all
                      duration-150
                      hover:border-white/[0.06]
                      hover:bg-white/[0.04]
                    `,
                    active &&
                      `
                        border-[#B9FF00]/10
                        bg-[#B9FF00]/[0.06]
                      `
                  )}
                >
                  {/* Active left indicator */}
                  <span
                    className={cn(
                      `
                        absolute
                        left-0
                        top-1/2
                        h-5
                        w-0.5
                        -translate-y-1/2
                        rounded-full
                        bg-[#B9FF00]
                        transition-opacity
                      `,
                      active
                        ? `
                            opacity-100
                            shadow-[0_0_8px_rgba(185,255,0,0.55)]
                          `
                        : "opacity-0"
                    )}
                  />


                  <Checkbox
                    checked={active}
                    className={cn(
                      `
                        h-4
                        w-4
                        border-zinc-700
                        bg-[#111518]/20
                        data-[state=checked]:border-[#B9FF00]
                        data-[state=checked]:bg-[#B9FF00]
                        data-[state=checked]:text-black
                      `
                    )}
                    onCheckedChange={() =>
                      toggleTag(item.slug)
                    }
                  />


                  <span
                    className={cn(
                      `
                        flex-1
                        truncate
                        text-zinc-500
                        transition-colors
                        duration-150
                        group-hover:text-zinc-200
                      `,
                      active &&
                        `
                          font-medium
                          text-[#B9FF00]
                        `
                    )}
                  >
                    {item.name}
                  </span>


                  {active && (
                    <span
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-[#B9FF00]
                        shadow-[0_0_6px_rgba(185,255,0,0.65)]
                      "
                    />
                  )}
                </label>
              )
            })}
          </div>
        </div>


        {/* =================================================
            FOOTER
        ================================================= */}
        <div
          className="
            border-t
            border-white/[0.07]
            bg-[#111518]/30
            p-3
          "
        >
          <button
            type="button"
            onClick={resetTags}
            disabled={tags.length === 0}
            className={cn(
              `
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-3
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-zinc-500
                transition-all
                duration-200
                hover:border-red-500/20
                hover:bg-red-500/[0.06]
                hover:text-red-400
                disabled:pointer-events-none
                disabled:opacity-30
              `
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />

            Reset Tags
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}


export default DataTagComponent