"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import {
  IoMdCloseCircleOutline,
  IoMdRefresh,
} from "react-icons/io";

import { getEnergyTheme } from "@/utils/energy-theme";

const MINIMUM_YEAR = 1950;
const CURRENT_YEAR = new Date().getFullYear();

const FilterActiveResetComponents = () => {
  const [bpm, setBpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger)
      .withDefault([0, 200])
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [genres, setGenres] = useQueryState(
    "genres",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [selectedKeys, setSelectedKeys] =
    useQueryState(
      "key",
      parseAsArrayOf(parseAsString)
        .withDefault([])
        .withOptions({
          clearOnDefault: true,
        }),
    );

  const [selectedEnergy, setSelectedEnergy] =
    useQueryState(
      "energy",
      parseAsArrayOf(parseAsInteger)
        .withDefault([])
        .withOptions({
          clearOnDefault: true,
        }),
    );

  const [yearFrom, setYearFrom] = useQueryState(
    "yearFrom",
    parseAsInteger
      .withDefault(MINIMUM_YEAR)
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [yearTo, setYearTo] = useQueryState(
    "yearTo",
    parseAsInteger
      .withDefault(CURRENT_YEAR)
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [filetypes, setFiletypes] = useQueryState(
    "filetype",
    parseAsArrayOf(
      parseAsStringEnum(["audio", "video"]),
    )
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const [explicit, setExplicit] = useQueryState(
    "explicit",
    parseAsStringEnum([
      "all",
      "clean",
      "dirty",
    ])
      .withDefault("all")
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const toggleFiletype = (type: string) => {
    void setFiletypes((previous) => {
      const exists = previous.includes(type);

      return exists
        ? previous.filter(
            (item) => item !== type,
          )
        : [...previous, type];
    });
  };

  const toggleGenre = (slug: string) => {
    void setGenres((previous) =>
      previous.includes(slug)
        ? previous.filter(
            (genre) => genre !== slug,
          )
        : [...previous, slug],
    );
  };

  const toggleTag = (slug: string) => {
    void setTags((previous) =>
      previous.includes(slug)
        ? previous.filter(
            (tag) => tag !== slug,
          )
        : [...previous, slug],
    );
  };

  const toggleKey = (keyName: string) => {
    void setSelectedKeys((previous) =>
      previous.includes(keyName)
        ? previous.filter(
            (key) => key !== keyName,
          )
        : [...previous, keyName],
    );
  };

  const toggleEnergy = (energy: number) => {
    void setSelectedEnergy((previous) =>
      previous.includes(energy)
        ? previous.filter(
            (value) => value !== energy,
          )
        : [...previous, energy].sort(
            (first, second) =>
              second - first,
          ),
    );
  };

  const resetBpm = () => {
    void setBpm([0, 200]);
  };

  const resetEnergy = () => {
    void setSelectedEnergy([]);
  };

  const resetYears = () => {
    void setYearFrom(MINIMUM_YEAR);
    void setYearTo(CURRENT_YEAR);
  };

  const resetExplicit = () => {
    void setExplicit("all");
  };

  const toggleResetAll = () => {
    void setBpm([0, 200]);
    void setGenres([]);
    void setTags([]);
    void setSelectedKeys([]);
    void setSelectedEnergy([]);
    void setFiletypes([]);
    void setExplicit("all");
    void setYearFrom(MINIMUM_YEAR);
    void setYearTo(CURRENT_YEAR);
  };

  const bpmStart = bpm[0] ?? 0;
  const bpmEnd = bpm[1] ?? 200;

  const hasCustomYearRange =
    yearFrom !== MINIMUM_YEAR ||
    yearTo !== CURRENT_YEAR;

  const hasActiveFilters =
    bpmStart > 0 ||
    bpmEnd < 200 ||
    genres.length > 0 ||
    tags.length > 0 ||
    selectedKeys.length > 0 ||
    selectedEnergy.length > 0 ||
    filetypes.length > 0 ||
    explicit !== "all" ||
    hasCustomYearRange;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div
      className="
        flex w-full flex-col gap-3 rounded-xl
        border border-white/10 bg-white/[0.02] p-3
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="mr-1 flex items-center gap-2">
          <span
            className="
              h-1.5 w-1.5 rounded-full
              bg-[#B9FF00]
              shadow-[0_0_8px_rgba(185,255,0,0.6)]
            "
          />

          <span
            className="
              text-[9px] font-medium tracking-[0.15em]
              text-zinc-600 uppercase
            "
          >
            Active Filters
          </span>
        </div>

        {/* FILE TYPE */}
        {filetypes.map((type) => (
          <FilterButton
            key={type}
            label={
              type === "audio"
                ? "Audio"
                : "Video"
            }
            onRemove={() =>
              toggleFiletype(type)
            }
          />
        ))}

        {/* EXPLICIT */}
        {explicit !== "all" && (
          <FilterButton
            label={
              explicit === "clean"
                ? "Clean"
                : "Dirty"
            }
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
            onRemove={() =>
              toggleGenre(genre)
            }
          />
        ))}

        {/* TAGS */}
        {tags.map((tag) => (
          <FilterButton
            key={tag}
            label={Unslug(tag)}
            onRemove={() =>
              toggleTag(tag)
            }
          />
        ))}

        {/* MUSICAL KEYS */}
        {selectedKeys.map((keyName) => (
          <FilterButton
            key={keyName}
            label={Unslug(keyName)}
            onRemove={() =>
              toggleKey(keyName)
            }
          />
        ))}

        {/* ENERGY */}
        {selectedEnergy.map((energy) => {
          const energyTheme =
            getEnergyTheme(energy);

          return (
            <FilterButton
              key={energy}
              label={`Energy ${energy} · ${energyTheme.label}`}
              onRemove={() =>
                toggleEnergy(energy)
              }
              colorClass={
                energyTheme.filterClass
              }
            />
          );
        })}

        {/* RESET ALL ENERGY LEVELS */}
        {selectedEnergy.length > 1 && (
          <FilterButton
            label="All Energy"
            onRemove={resetEnergy}
          />
        )}

        {/* BPM */}
        {(bpmStart > 0 || bpmEnd < 200) && (
          <FilterButton
            label={`${bpmStart}–${bpmEnd} BPM`}
            onRemove={resetBpm}
          />
        )}

        {/* YEAR */}
        {hasCustomYearRange && (
          <FilterButton
            label={`${yearFrom}–${yearTo}`}
            onRemove={resetYears}
            variant="year"
          />
        )}
      </div>

      <div className="shrink-0">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleResetAll();
          }}
          className="
            group flex w-full items-center
            justify-center gap-1.5 rounded-lg
            border border-white/10 bg-white/[0.03]
            px-3 py-2 text-[10px] font-medium
            tracking-wider text-zinc-500 uppercase
            transition-all duration-200
            hover:border-red-400/20
            hover:bg-red-400/[0.06]
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
  );
};

type FilterButtonVariant =
  | "default"
  | "success"
  | "danger"
  | "year";

type FilterButtonProps = {
  label: string;
  onRemove: () => void;
  variant?: FilterButtonVariant;
  colorClass?: string;
};

const FilterButton = ({
  label,
  onRemove,
  variant = "default",
  colorClass,
}: FilterButtonProps) => {
  const colors: Record<
    FilterButtonVariant,
    string
  > = {
    default:
      "border-[#B9FF00]/15 bg-[#B9FF00]/[0.05] text-[#B9FF00]",

    success:
      "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400",

    danger:
      "border-red-400/20 bg-red-400/[0.06] text-red-400",
    year:
      "border-violet-400/20 bg-violet-400/[0.06] text-violet-300",
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onRemove();
      }}
      className={`
        group inline-flex items-center gap-1.5
        rounded-full border px-3 py-1.5
        text-[10px] font-medium
        transition-all duration-200
        hover:border-red-400/25
        hover:bg-red-400/[0.06]
        hover:text-red-300
        ${colorClass ?? colors[variant]}
      `}
    >
      <IoMdCloseCircleOutline
        className="
          h-3.5 w-3.5 shrink-0 opacity-60
          transition-colors
          group-hover:text-red-400
        "
      />

      {label}
    </button>
  );
};

const SPECIAL_SLUGS: Record<string, string> = {
  randb: "R&B",
};

function Unslug(slug: string) {
  const decoded = decodeURIComponent(slug);

  return (
    SPECIAL_SLUGS[decoded] ??
    decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase(),
      )
  );
}

export default FilterActiveResetComponents;