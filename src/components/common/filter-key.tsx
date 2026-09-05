import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDown, RotateCcw } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"

export const keyData = {
  0: [
    { id: "1", name: "1A" },
    { id: "2", name: "2A" },
    { id: "3", name: "3A" },
    { id: "4", name: "4A" },
    { id: "5", name: "5A" },
    { id: "6", name: "6A" },
    { id: "7", name: "7A" },
    { id: "8", name: "8A" },
    { id: "9", name: "9A" },
    { id: "10", name: "10A" },
    { id: "11", name: "11A" },
    { id: "12", name: "12A" },
  ],
  1: [
    { id: "21", name: "1B" },
    { id: "22", name: "2B" },
    { id: "23", name: "3B" },
    { id: "24", name: "4B" },
    { id: "25", name: "5B" },
    { id: "26", name: "6B" },
    { id: "27", name: "7B" },
    { id: "28", name: "8B" },
    { id: "29", name: "9B" },
    { id: "30", name: "10B" },
    { id: "31", name: "11B" },
    { id: "32", name: "12B" },
  ],
}

const DataKeyComponent = () => {
  // URL state for keys
  const [selectedKeys, setSelectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  // URL state for page
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  // toggle a key and reset page to 1
  const toggleKey = (keyName: string) => {
    void setSelectedKeys((prev) => {
      const newKeys = prev.includes(keyName)
        ? prev.filter((k) => k !== keyName)
        : [...prev, keyName]

      // reset page to 1 whenever key changes
      return newKeys
    })

    void setPage(1)
  }

  const resetKeys = () => {
    void setSelectedKeys([])
    void setPage(1)
  }

  return (
    <Popover>
      <PopoverTrigger
  id="key"
  aria-label="key"
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
    <span>Key</span>

    {selectedKeys.length > 0 && (
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
        {selectedKeys.length}
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
        className="
          w-[220px]
          overflow-hidden
          rounded-xl
          border border-zinc-700
          bg-zinc-950
          p-0
          text-zinc-100
          shadow-xl shadow-black/40
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">
              Musical Key
            </h3>

            <p className="mt-0.5 text-[11px] text-zinc-500">
              Select compatible keys
            </p>
          </div>

          {selectedKeys.length > 0 && (
            <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-[10px] font-medium text-[#B9FF00]">
              {selectedKeys.length} selected
            </span>
          )}
        </div>

        {/* Keys */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-0 rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {/* Column A */}
            <div className="border-r border-zinc-800 p-2">
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Minor
              </div>

              <div className="flex flex-col gap-1">
                {keyData[0].map((item) => {
                  const active = selectedKeys.includes(item.name)

                  return (
                    <label
                      key={item.id}
                      className={`
                        flex cursor-pointer items-center gap-2
                        rounded-md px-2 py-1.5
                        text-xs font-medium
                        transition-all duration-150
                        ${
                          active
                            ? "bg-yellow-500/15 text-[#B9FF00]"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                        }
                      `}
                    >
                      <Checkbox
                        checked={active}
                        className="
                          h-3.5 w-3.5
                          border-zinc-600
                          data-[state=checked]:border-yellow-500
                          data-[state=checked]:bg-yellow-500
                          data-[state=checked]:text-black
                        "
                        onCheckedChange={() =>
                          toggleKey(item.name)
                        }
                      />

                      <span>{item.name}</span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      )}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Column B */}
            <div className="p-2">
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Major
              </div>

              <div className="flex flex-col gap-1">
                {keyData[1].map((item) => {
                  const active = selectedKeys.includes(item.name)

                  return (
                    <label
                      key={item.id}
                      className={`
                        flex cursor-pointer items-center gap-2
                        rounded-md px-2 py-1.5
                        text-xs font-medium
                        transition-all duration-150
                        ${
                          active
                            ? "bg-yellow-500/15 text-[#B9FF00]"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                        }
                      `}
                    >
                      <Checkbox
                        checked={active}
                        className="
                          h-3.5 w-3.5
                          border-zinc-600
                          data-[state=checked]:border-yellow-500
                          data-[state=checked]:bg-yellow-500
                          data-[state=checked]:text-black
                        "
                        onCheckedChange={() =>
                          toggleKey(item.name)
                        }
                      />

                      <span>{item.name}</span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 bg-zinc-900/80 p-3">
          <button
            onClick={resetKeys}
            disabled={selectedKeys.length === 0}
            className="
              flex w-full items-center justify-center gap-2
              rounded-md
              border border-zinc-700
              bg-zinc-800
              px-3 py-2
              text-xs font-medium
              text-zinc-300
              transition-all duration-200
              hover:border-yellow-900
              hover:bg-yellow-950/30
              hover:text-[#B9FF00]
              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Keys
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DataKeyComponent