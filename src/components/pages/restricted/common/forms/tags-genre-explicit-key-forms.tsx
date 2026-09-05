import type { LucideIcon } from "lucide-react";
import {
  Check,
  KeyRound,
  Layers3,
  Mic2,
  Tags as TagsIcon,
} from "lucide-react";

import SectionHeader from "./section-header";

/* =========================================================
   SHARED TYPES
========================================================= */

type SelectItem = {
  id: string | number;
  name: string;
};

type ChangeHandler<T> = (
  value: T,
) => void | Promise<unknown>;

type CommonSectionProps = {
  disabled?: boolean;
  error?: string;
};

/* =========================================================
   VOCAL LYRICS
========================================================= */

type VocalLyricsSectionProps =
  CommonSectionProps & {
    value: boolean;
    onChange: ChangeHandler<boolean>;
  };

export function VocalLyricsSection({
  value,
  onChange,
  disabled = false,
}: VocalLyricsSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <SectionHeader
        icon={Mic2}
        title="Vocal Lyrics"
        description="Choose whether this version is clean or explicit"
        badge={value ? "DIRTY" : "CLEAN"}
      />

      <div className="grid grid-cols-2 gap-3 p-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            void onChange(false);
          }}
          className={`
            flex
            min-h-14
            items-center
            justify-center
            rounded-2xl
            border
            text-xs
            font-semibold
            transition-all
            disabled:cursor-not-allowed
            disabled:opacity-30

            ${
              !value
                ? `
                    border-emerald-500/25
                    bg-emerald-500/[0.1]
                    text-emerald-400
                  `
                : `
                    border-white/[0.06]
                    bg-white/[0.015]
                    text-zinc-500
                    hover:bg-white/[0.04]
                    hover:text-white
                  `
            }
          `}
        >
          {!value && (
            <Check className="mr-2 h-4 w-4" />
          )}

          CLEAN
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            void onChange(true);
          }}
          className={`
            flex
            min-h-14
            items-center
            justify-center
            rounded-2xl
            border
            text-xs
            font-semibold
            transition-all
            disabled:cursor-not-allowed
            disabled:opacity-30

            ${
              value
                ? `
                    border-red-500/25
                    bg-red-500/[0.1]
                    text-red-400
                  `
                : `
                    border-white/[0.06]
                    bg-white/[0.015]
                    text-zinc-500
                    hover:bg-white/[0.04]
                    hover:text-white
                  `
            }
          `}
        >
          {value && (
            <Check className="mr-2 h-4 w-4" />
          )}

          DIRTY
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   CAMELOT KEY DATA
========================================================= */

export const keyData = [
  {
    id: 100,
    name: "--",
    musicKey: "--",
    color: "#000000",
    textColor: "#FFFFFF",
  },
  {
    id: 1,
    name: "1A",
    musicKey: "Ab min",
    color: "#60F5D7",
    textColor: "#000000",
  },
  {
    id: 2,
    name: "1B",
    musicKey: "B maj",
    color: "#21ECBF",
    textColor: "#000000",
  },
  {
    id: 3,
    name: "2A",
    musicKey: "Eb min",
    color: "#7DF5A3",
    textColor: "#000000",
  },
  {
    id: 4,
    name: "2B",
    musicKey: "F# maj",
    color: "#3AF06D",
    textColor: "#000000",
  },
  {
    id: 5,
    name: "3A",
    musicKey: "Bb min",
    color: "#ABF983",
    textColor: "#000000",
  },
  {
    id: 6,
    name: "3B",
    musicKey: "Db maj",
    color: "#7AF53F",
    textColor: "#000000",
  },
  {
    id: 7,
    name: "4A",
    musicKey: "F min",
    color: "#FED97E",
    textColor: "#000000",
  },
  {
    id: 8,
    name: "4B",
    musicKey: "Ab maj",
    color: "#FEC139",
    textColor: "#000000",
  },
  {
    id: 9,
    name: "5A",
    musicKey: "C min",
    color: "#FDB9A0",
    textColor: "#000000",
  },
  {
    id: 10,
    name: "5B",
    musicKey: "Eb maj",
    color: "#FC8D6A",
    textColor: "#000000",
  },
  {
    id: 11,
    name: "6A",
    musicKey: "G min",
    color: "#FDA6B1",
    textColor: "#000000",
  },
  {
    id: 12,
    name: "6B",
    musicKey: "Bb maj",
    color: "#FC7182",
    textColor: "#000000",
  },
  {
    id: 13,
    name: "7A",
    musicKey: "D min",
    color: "#FDA0C7",
    textColor: "#000000",
  },
  {
    id: 14,
    name: "7B",
    musicKey: "F maj",
    color: "#FC67A5",
    textColor: "#000000",
  },
  {
    id: 15,
    name: "8A",
    musicKey: "A min",
    color: "#F0A1E2",
    textColor: "#000000",
  },
  {
    id: 16,
    name: "8B",
    musicKey: "C maj",
    color: "#E768D1",
    textColor: "#000000",
  },
  {
    id: 17,
    name: "9A",
    musicKey: "E min",
    color: "#D9A9FE",
    textColor: "#000000",
  },
  {
    id: 18,
    name: "9B",
    musicKey: "G maj",
    color: "#C075FF",
    textColor: "#000000",
  },
  {
    id: 19,
    name: "10A",
    musicKey: "B min",
    color: "#B8C8FE",
    textColor: "#000000",
  },
  {
    id: 20,
    name: "10B",
    musicKey: "D maj",
    color: "#8EA5FF",
    textColor: "#000000",
  },
  {
    id: 21,
    name: "11A",
    musicKey: "F# min",
    color: "#8BE4F9",
    textColor: "#000000",
  },
  {
    id: 22,
    name: "11B",
    musicKey: "A maj",
    color: "#4BD1F8",
    textColor: "#000000",
  },
  {
    id: 23,
    name: "12A",
    musicKey: "C# min",
    color: "#5EF3EF",
    textColor: "#000000",
  },
  {
    id: 24,
    name: "12B",
    musicKey: "E maj",
    color: "#20EAE6",
    textColor: "#000000",
  },
] as const;

export type MusicKeyItem =
  (typeof keyData)[number];

/* =========================================================
   MUSIC KEY
========================================================= */

type MusicKeySectionProps =
  CommonSectionProps & {
    items?: readonly MusicKeyItem[];
    value: string;
    onChange: ChangeHandler<string>;
  };

export function MusicKeySection({
  items = keyData,
  value,
  onChange,
  disabled = false,
  error,
}: MusicKeySectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <SectionHeader
        icon={KeyRound}
        title="Music Key"
        description="Select one Camelot key"
        badge={value || "Key"}
        error={error}
      />

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-6">
        {items
          .filter((item) => item.name !== "--")
          .map((item) => {
            const selected =
              value === item.name;

            return (
              <button
                type="button"
                key={item.id}
                disabled={disabled}
                onClick={() => {
                  void onChange(item.name);
                }}
                className={`
                  relative
                  flex
                  min-h-[58px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-2
                  py-2
                  transition-all
                  duration-200

                  ${
                    selected
                      ? `
                          scale-[1.02]
                        `
                      : `
                          border-white/[0.06]
                          bg-white/[0.015]
                          text-zinc-500
                          hover:border-[#B9FF00]/15
                          hover:bg-white/[0.04]
                          hover:text-white
                        `
                  }

                  disabled:cursor-not-allowed
                  disabled:opacity-30
                  disabled:hover:translate-y-0
                `}
                style={
                  selected
                    ? {
                        backgroundColor:
                          item.color,
                        borderColor:
                          item.color,
                        color:
                          item.textColor,
                        boxShadow: `0 0 20px ${item.color}35`,
                      }
                    : undefined
                }
              >
                <span className="text-sm font-bold">
                  {item.name}
                </span>

                <span
                  className={`
                    mt-0.5
                    text-[10px]

                    ${
                      selected
                        ? ""
                        : "text-zinc-400"
                    }
                  `}
                  style={
                    selected
                      ? {
                          color:
                            item.textColor,
                          opacity: 0.6,
                        }
                      : undefined
                  }
                >
                  {item.musicKey}
                </span>

                {selected && (
                  <Check
                    className="absolute right-2 top-2 h-3 w-3"
                    style={{
                      color:
                        item.textColor,
                    }}
                  />
                )}
              </button>
            );
          })}
      </div>
    </section>
  );
}
/* =========================================================
   SHARED MULTI-SELECT
========================================================= */

type MultiSelectSectionProps =
  CommonSectionProps & {
    items?: readonly SelectItem[];
    value: string[];
    limit: number;
    title: string;
    description: string;
    icon: LucideIcon;
    onChange: ChangeHandler<string[]>;
  };

function MultiSelectSection({
  items = [],
  value,
  limit,
  title,
  description,
  icon,
  onChange,
  disabled = false,
  error,
}: MultiSelectSectionProps) {
  const toggleItem = (itemId: string) => {
    const selected = value.includes(itemId);

    if (selected) {
      void onChange(
        value.filter(
          (selectedId) =>
            selectedId !== itemId,
        ),
      );

      return;
    }

    if (value.length < limit) {
      void onChange([...value, itemId]);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
        badge={`${value.length}/${limit}`}
        error={error}
      />

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-6">
        {items.map((item) => {
          const itemId = String(item.id);
          const selected =
            value.includes(itemId);

          const blocked =
            !selected &&
            value.length >= limit;

          return (
            <button
              type="button"
              key={item.id}
              disabled={disabled || blocked}
              onClick={() => {
                toggleItem(itemId);
              }}
              className={`
                min-h-11
                rounded-xl
                border
                px-3
                text-xs
                font-medium
                transition-all
                disabled:cursor-not-allowed
                disabled:opacity-30

                ${
                  selected
                    ? `
                        border-[#B9FF00]/40
                        bg-[#B9FF00]
                        text-black
                      `
                    : `
                        border-white/[0.06]
                        bg-white/[0.015]
                        text-zinc-500
                        hover:border-[#B9FF00]/15
                        hover:bg-white/[0.04]
                        hover:text-white
                      `
                }
              `}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   GENRES
========================================================= */

type GenresSectionProps =
  CommonSectionProps & {
    items?: readonly SelectItem[];
    value: string[];
    max?: number;
    onChange: ChangeHandler<string[]>;
  };

export function GenresSection({
  items,
  value,
  max = 3,
  onChange,
  disabled = false,
  error,
}: GenresSectionProps) {
  return (
    <MultiSelectSection
      items={items}
      value={value}
      limit={max}
      title="Genres"
      description={`Select up to ${max} genres`}
      icon={Layers3}
      onChange={onChange}
      disabled={disabled}
      error={error}
    />
  );
}

/* =========================================================
   TAGS
========================================================= */

type TagsSectionProps =
  CommonSectionProps & {
    items?: readonly SelectItem[];
    value: string[];
    max?: number;
    onChange: ChangeHandler<string[]>;
  };

export function TagsSection({
  items,
  value,
  max = 5,
  onChange,
  disabled = false,
  error,
}: TagsSectionProps) {
  return (
    <MultiSelectSection
      items={items}
      value={value}
      limit={max}
      title="Tags"
      description={`Select up to ${max} tags`}
      icon={TagsIcon}
      onChange={onChange}
      disabled={disabled}
      error={error}
    />
  );
}


/* =========================================================
   ENERGY DATA
========================================================= */

export const energyData = [
  {
    id: 1,
    name: "Energy 1",
  },
  {
    id: 2,
    name: "Energy 2",
  },
  {
    id: 3,
    name: "Energy 3",
  },
  {
    id: 4,
    name: "Energy 4",
  },
  {
    id: 5,
    name: "Energy 5",
  },
  {
    id: 6,
    name: "Energy 6",
  },
  {
    id: 7,
    name: "Energy 7",
  },
  {
    id: 8,
    name: "Energy 8",
  },
  {
    id: 9,
    name: "Energy 9",
  },
  {
    id: 10,
    name: "Energy 10",
  },
] as const;

export type EnergyItem =
  (typeof energyData)[number];

/* =========================================================
   MUSIC KEY
========================================================= */

type EnergySectionProps =
  CommonSectionProps & {
    items?: readonly EnergyItem[];
    value: number;
    onChange: ChangeHandler<number>;
  };

export function EnergySection({
  items = energyData,
  value,
  onChange,
  disabled = false,
  error,
}: EnergySectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <SectionHeader
        icon={KeyRound}
        title="Energy"
        description="Select one Energy"
        badge={value || "Key"}
        error={error}
      />

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-6">
        {items
          .map((item) => {
            const selected =
              value === item.id;

            return (
              <button
                type="button"
                key={item.id}
                disabled={disabled}
                onClick={() => {
                  void onChange(item.id);
                }}
                className={`
                  relative
                  flex
                  min-h-[58px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-2
                  py-2
                  transition-all
                  duration-200

                  ${
                    selected
                      ? `
                          scale-[1.02]
                        `
                      : `
                          border-white/[0.06]
                          bg-white/[0.015]
                          text-zinc-500
                          hover:border-[#B9FF00]/15
                          hover:bg-white/[0.04]
                          hover:text-white
                        `
                  }

                  disabled:cursor-not-allowed
                  disabled:opacity-30
                  disabled:hover:translate-y-0
                `}
                
              >
                <span className="text-sm font-bold">
                  {item.name}
                </span>

                <span
                  className={`
                    mt-0.5
                    text-[10px]

                    ${
                      selected
                        ? ""
                        : "text-zinc-400"
                    }
                  `}
                  
                >
                  {item.name}
                </span>

                {selected && (
                  <Check
                    className="absolute right-2 top-2 h-3 w-3"
                  />
                )}
              </button>
            );
          })}
      </div>
    </section>
  );
}