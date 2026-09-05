import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"
import React from "react"
import {
  IoMdCloseCircleOutline,
  IoMdRefresh,
} from "react-icons/io"

const FilterActiveResetComponents = () => {
  const [bpm, setBpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200])
  )

  const [genres, setGenres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [selectedKeys, setSelectedKeys] = useQueryState(
    "key",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [filetypes, setFiletypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum(["audio", "video"])
    ).withDefault([])
  )

  const toggleFiletype = (type: string) => {
    void setFiletypes((prev) => {
      const exists = prev.includes(type)
      return exists
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    })
  }

  const toggleGenre = (slug: string) => {
    void setGenres((prev) => {
      const exists = prev.includes(slug)
      const next = exists
        ? prev.filter((g) => g !== slug)
        : [...prev, slug]

      return next
    })
  }

  const toggleTag = (slug: string) => {
    void setTags((prev) => {
      const exists = prev.includes(slug)
      const next = exists
        ? prev.filter((g) => g !== slug)
        : [...prev, slug]

      return next
    })
  }

  const toggleKey = (keyName: string) => {
    void setSelectedKeys((prev) => {
      const newKeys = prev.includes(keyName)
        ? prev.filter((k) => k !== keyName)
        : [...prev, keyName]

      return newKeys
    })
  }

  const resetBpm = () => {
    void setBpm([0, 200])
  }

  const toggleResetAll = () => {
    void setBpm([0, 200])
    void setGenres([])
    void setTags([])
    void setSelectedKeys([])
    void setFiletypes([])
  }

  return (
    <>
      {Boolean(
        Number(bpm[0]) > 0 ||
          Number(bpm[1]) < 200 ||
          genres.length > 0 ||
          tags.length > 0 ||
          selectedKeys.length > 0 ||
          filetypes.length > 0
      ) && (
        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            rounded-xl
            border
            border-white/10
            bg-white/[0.02]
            p-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* =====================================================
              ACTIVE FILTERS
          ===================================================== */}
          <div
            className="
              flex
              min-w-0
              flex-1
              flex-wrap
              items-center
              gap-2
            "
          >
            {/* FILTER LABEL */}
            <div
              className="
                mr-1
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.6)]
                "
              />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-zinc-600
                "
              >
                Active Filters
              </span>
            </div>

            {/* =================================================
                FILETYPE
            ================================================= */}
            {filetypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFiletype(type)
                }}
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#B9FF00]/15
                  bg-[#B9FF00]/[0.05]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-[#B9FF00]
                  transition-all
                  duration-200
                  hover:border-red-400/25
                  hover:bg-red-400/[0.06]
                  hover:text-red-300
                "
              >
                <IoMdCloseCircleOutline
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#B9FF00]/60
                    transition-colors
                    group-hover:text-red-400
                  "
                />

                {type === "audio"
                  ? "Audio Only"
                  : "Video Only"}
              </button>
            ))}

            {/* =================================================
                GENRE
            ================================================= */}
            {genres.map((item, index) => (
              <button
                key={index}
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#B9FF00]/15
                  bg-[#B9FF00]/[0.05]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-[#B9FF00]
                  transition-all
                  duration-200
                  hover:border-red-400/25
                  hover:bg-red-400/[0.06]
                  hover:text-red-300
                "
                onClick={(e) => {
                  e.preventDefault()
                  toggleGenre(String(item))
                }}
              >
                <IoMdCloseCircleOutline
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#B9FF00]/60
                    transition-colors
                    group-hover:text-red-400
                  "
                />

                {Unslug(item)}
              </button>
            ))}

            {/* =================================================
                TAG
            ================================================= */}
            {tags.map((item, index) => (
              <button
                key={index}
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#B9FF00]/15
                  bg-[#B9FF00]/[0.05]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-[#B9FF00]
                  transition-all
                  duration-200
                  hover:border-red-400/25
                  hover:bg-red-400/[0.06]
                  hover:text-red-300
                "
                onClick={(e) => {
                  e.preventDefault()
                  toggleTag(String(item))
                }}
              >
                <IoMdCloseCircleOutline
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#B9FF00]/60
                    transition-colors
                    group-hover:text-red-400
                  "
                />

                {Unslug(item)}
              </button>
            ))}

            {/* =================================================
                KEY
            ================================================= */}
            {selectedKeys.map((item, index) => (
              <button
                key={index}
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#B9FF00]/15
                  bg-[#B9FF00]/[0.05]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-[#B9FF00]
                  transition-all
                  duration-200
                  hover:border-red-400/25
                  hover:bg-red-400/[0.06]
                  hover:text-red-300
                "
                onClick={(e) => {
                  e.preventDefault()
                  toggleKey(String(item))
                }}
              >
                <IoMdCloseCircleOutline
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#B9FF00]/60
                    transition-colors
                    group-hover:text-red-400
                  "
                />

                {Unslug(item)}
              </button>
            ))}

            {/* =================================================
                BPM
            ================================================= */}
            {(Number(bpm[0]) > 0 ||
              Number(bpm[1]) < 200) && (
              <button
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#B9FF00]/15
                  bg-[#B9FF00]/[0.05]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-[#B9FF00]
                  transition-all
                  duration-200
                  hover:border-red-400/25
                  hover:bg-red-400/[0.06]
                  hover:text-red-300
                "
                onClick={resetBpm}
              >
                <IoMdCloseCircleOutline
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-[#B9FF00]/60
                    transition-colors
                    group-hover:text-red-400
                  "
                />

                {`${bpm[0]}-${bpm[1]} BPM`}
              </button>
            )}
          </div>

          {/* =====================================================
              RESET ALL
          ===================================================== */}
          <div className="shrink-0">
            <button
              type="button"
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-1.5
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                px-3
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-zinc-500
                transition-all
                duration-200
                hover:border-red-400/20
                hover:bg-red-400/[0.06]
                hover:text-red-400
                sm:w-auto
              "
              onClick={(e) => {
                e.preventDefault()
                toggleResetAll()
              }}
            >
              Reset All

              <IoMdRefresh
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-300
                  group-hover:rotate-180
                "
              />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterActiveResetComponents

const SPECIAL_SLUGS: Record<string, string> = {
  randb: "R&B",
}

const Unslug = (slug: string) => {
  const decoded = decodeURIComponent(slug)

  return (
    SPECIAL_SLUGS[decoded] ??
    decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}