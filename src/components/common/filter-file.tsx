"use client"

import { Checkbox } from "../ui/checkbox"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

const filetypeOptions = ["audio", "video"] as const
const explicitOptions = ["clean", "dirty"] as const

type Filetype = (typeof filetypeOptions)[number]
type ExplicitOption = (typeof explicitOptions)[number]
type ExplicitValue = ExplicitOption | "all"

const FilterFileTypeComponent = () => {
  const [filetypes, setFiletypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum([...filetypeOptions])
    )
      .withDefault([...filetypeOptions])
      .withOptions({ clearOnDefault: true })
  )

  const [explicit, setExplicit] = useQueryState(
    "explicit",
    parseAsStringEnum<ExplicitValue>([
      "all",
      "clean",
      "dirty",
    ])
      .withDefault("all")
      .withOptions({ clearOnDefault: true })
  )

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const isExplicitChecked = (
    value: ExplicitOption
  ) => {
    return explicit === "all" || explicit === value
  }

  const updateFiletype = (
    value: Filetype,
    checked: boolean
  ) => {
    void setFiletypes((previous) => {
      const selected = new Set(previous)

      if (checked) {
        selected.add(value)
      } else {
        selected.delete(value)
      }

      // Audio or Video must always remain checked.
      if (selected.size === 0) {
        return previous
      }

      // Preserve the original order.
      return filetypeOptions.filter((option) =>
        selected.has(option)
      )
    })

    void setPage(1)
  }

  const updateExplicit = (
    value: ExplicitOption,
    checked: boolean
  ) => {
    const selected =
      explicit === "all"
        ? new Set<ExplicitOption>(explicitOptions)
        : new Set<ExplicitOption>([explicit])

    if (checked) {
      selected.add(value)
    } else {
      selected.delete(value)
    }

    // Clean or Dirty must always remain checked.
    if (selected.size === 0) return

    let nextValue: ExplicitValue

    if (selected.size === explicitOptions.length) {
      nextValue = "all"
    } else if (selected.has("clean")) {
      nextValue = "clean"
    } else {
      nextValue = "dirty"
    }

    void setExplicit(nextValue)
    void setPage(1)
  }

  const options = [
    ...filetypeOptions.map((value) => ({
      value,
      label: value,
      checked: filetypes.includes(value),
      onChange: (checked: boolean) =>
        updateFiletype(value, checked),
    })),

    ...explicitOptions.map((value) => ({
      value,
      label: value,
      checked: isExplicitChecked(value),
      onChange: (checked: boolean) =>
        updateExplicit(value, checked),
    })),
  ]

  return (
    <div className="flex md:grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex cursor-pointer items-center gap-2 my-1 rounded-lg border
            px-3 py-2 text-[10px] font-medium uppercase tracking-wider
            transition-all duration-200
            ${
              option.checked
                ? "border-[#B9FF00]/30 bg-[#B9FF00]/[0.06] text-[#B9FF00]"
                : "border-white/10 bg-white/[0.02] text-zinc-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-zinc-200"
            }
          `}
        >
          <Checkbox
            checked={option.checked}
            onCheckedChange={(checked) => {
              option.onChange(checked === true)
            }}
            className="
              h-3.5 w-3.5 border-white/20
              data-[state=checked]:border-[#B9FF00]
              data-[state=checked]:bg-[#B9FF00]
              data-[state=checked]:text-black
            "
          />

          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default FilterFileTypeComponent