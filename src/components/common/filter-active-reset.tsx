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

  // Clean and Dirty filter
  const [explicit, setExplicit] = useQueryState(
    "explicit",
    parseAsStringEnum(["all", "clean", "dirty"])
      .withDefault("all")
      .withOptions({
        clearOnDefault: true,
      })
  )

  const toggleFiletype = (type: string) => {
    void setFiletypes((prev) => {
      const exists = prev.includes(type)

      return exists
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    })
  }

  const toggleGenre = (slug: string) => {
    void setGenres((prev) =>
      prev.includes(slug)
        ? prev.filter((genre) => genre !== slug)
        : [...prev, slug]
    )
  }

  const toggleTag = (slug: string) => {
    void setTags((prev) =>
      prev.includes(slug)
        ? prev.filter((tag) => tag !== slug)
        : [...prev, slug]
    )
  }

  const toggleKey = (keyName: string) => {
    void setSelectedKeys((prev) =>
      prev.includes(keyName)
        ? prev.filter((key) => key !== keyName)
        : [...prev, keyName]
    )
  }

  const resetBpm = () => {
    void setBpm([0, 200])
  }

  const resetExplicit = () => {
    void setExplicit("all")
  }

  const toggleResetAll = () => {
    void setBpm([0, 200])
    void setGenres([])
    void setTags([])
    void setSelectedKeys([])
    void setFiletypes([])
    void setExplicit("all")
  }

  const hasActiveFilters =
    Number(bpm[0]) > 0 ||
    Number(bpm[1]) < 200 ||
    genres.length > 0 ||
    tags.length > 0 ||
    selectedKeys.length > 0 ||
    filetypes.length > 0 ||
    explicit !== "all"

  return (
    <>
      {hasActiveFilters && (
        <div
          className="
            flex w-full flex-col gap-3 rounded-xl border
            border-white/10 bg-white/[0.02] p-3
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-2">
              <span
                className="
                  h-1.5 w-1.5 rounded-full bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.6)]
                "
              />

              <span
                className="
                  text-[9px] font-medium uppercase
                  tracking-[0.15em] text-zinc-600
                "
              >
                Active Filters
              </span>
            </div>

            {/* FILETYPE */}
            {filetypes.map((type) => (
              <FilterButton
                key={type}
                label={type === "audio" ? "Audio" : "Video"}
                onRemove={() => toggleFiletype(type)}
              />
            ))}

            {/* CLEAN OR DIRTY */}
            {explicit !== "all" && (
              <FilterButton
                label={explicit === "clean" ? "Clean" : "Dirty"}
                onRemove={resetExplicit}
                variant={
                  explicit === "dirty"
                    ? "danger"
                    : "success"
                }
              />
            )}

            {/* GENRES */}
            {genres.map((genre) => (
              <FilterButton
                key={genre}
                label={Unslug(genre)}
                onRemove={() => toggleGenre(genre)}
              />
            ))}

            {/* TAGS */}
            {tags.map((tag) => (
              <FilterButton
                key={tag}
                label={Unslug(tag)}
                onRemove={() => toggleTag(tag)}
              />
            ))}

            {/* KEYS */}
            {selectedKeys.map((keyName) => (
              <FilterButton
                key={keyName}
                label={Unslug(keyName)}
                onRemove={() => toggleKey(keyName)}
              />
            ))}

            {/* BPM */}
            {(Number(bpm[0]) > 0 ||
              Number(bpm[1]) < 200) && (
              <FilterButton
                label={`${bpm[0]}-${bpm[1]} BPM`}
                onRemove={resetBpm}
              />
            )}
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                toggleResetAll()
              }}
              className="
                group flex w-full items-center justify-center gap-1.5
                rounded-lg border border-white/10 bg-white/[0.03]
                px-3 py-2 text-[10px] font-medium uppercase
                tracking-wider text-zinc-500 transition-all duration-200
                hover:border-red-400/20 hover:bg-red-400/[0.06]
                hover:text-red-400 sm:w-auto
              "
            >
              Reset All

              <IoMdRefresh
                className="
                  h-3.5 w-3.5 transition-transform
                  duration-300 group-hover:rotate-180
                "
              />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

type FilterButtonProps = {
  label: string
  onRemove: () => void
  variant?: "default" | "success" | "danger"
}

const FilterButton = ({
  label,
  onRemove,
  variant = "default",
}: FilterButtonProps) => {
  const colors = {
    default:
      "border-[#B9FF00]/15 bg-[#B9FF00]/[0.05] text-[#B9FF00]",
    success:
      "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400",
    danger:
      "border-red-400/20 bg-red-400/[0.06] text-red-400",
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        onRemove()
      }}
      className={`
        group inline-flex items-center gap-1.5 rounded-full border
        px-3 py-1.5 text-[10px] font-medium
        transition-all duration-200
        hover:border-red-400/25 hover:bg-red-400/[0.06]
        hover:text-red-300
        ${colors[variant]}
      `}
    >
      <IoMdCloseCircleOutline
        className="
          h-3.5 w-3.5 shrink-0 opacity-60
          transition-colors group-hover:text-red-400
        "
      />

      {label}
    </button>
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
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      )
  )
}