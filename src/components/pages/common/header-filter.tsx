"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type TrackColumnKey =
  | "play"
  | "avatar"
  | "track"
  | "key"
  | "bpm"
  | "genre"
  | "type"
  | "duration"
  | "price";

export const TRACK_COLUMNS = [
  {
    key: "play",
    label: "",
    width: "40px",
    align: "left",
    configurable: false,
  },
  {
    key: "avatar",
    label: "",
    width: "40px",
    align: "left",
    configurable: false,
  },
  {
    key: "track",
    label: "Track",
    width: "minmax(180px, 1fr)",
    align: "left",
    configurable: false,
  },
  {
    key: "key",
    label: "Key",
    width: "56px",
    align: "center",
    configurable: true,
  },
  {
    key: "bpm",
    label: "BPM",
    width: "80px",
    align: "center",
    configurable: true,
  },
  {
    key: "genre",
    label: "Genre",
    width: "128px",
    align: "left",
    configurable: true,
  },
  {
    key: "type",
    label: "Type",
    width: "64px",
    align: "left",
    configurable: true,
  },
  {
    key: "duration",
    label: "Time",
    width: "56px",
    align: "center",
    configurable: true,
  },
  {
    key: "price",
    label: "Price",
    width: "154px",
    align: "right",
    configurable: false,
  },
] as const;

const STORAGE_KEY = "track-list-visible-columns";
const REQUIRED_TRACK_COLUMNS: TrackColumnKey[] = [
  "play",
  "avatar",
  "track",
  "price",
];

export const DEFAULT_TRACK_COLUMNS: TrackColumnKey[] = TRACK_COLUMNS.map(
  ({ key }) => key,
);

export const getActiveTrackColumns = (
  visibleColumns: readonly TrackColumnKey[] = DEFAULT_TRACK_COLUMNS,
) => {
  const visible = new Set(visibleColumns);
  return TRACK_COLUMNS.filter(
    ({ key }) => REQUIRED_TRACK_COLUMNS.includes(key) || visible.has(key),
  );
};

export const useTrackColumns = () => {
  const [visibleColumns, setVisibleColumns] = useState<TrackColumnKey[]>(
    DEFAULT_TRACK_COLUMNS,
  );
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;

      const validKeys = new Set(DEFAULT_TRACK_COLUMNS);
      const savedColumns = parsed.filter(
        (key): key is TrackColumnKey =>
          typeof key === "string" && validKeys.has(key as TrackColumnKey),
      );

      setVisibleColumns([
        ...new Set([...REQUIRED_TRACK_COLUMNS, ...savedColumns]),
      ]);
    } catch {
      // Fall back to the default columns.
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch {
      // Keep working when localStorage is unavailable.
    }
  }, [hasLoaded, visibleColumns]);

  const toggleColumn = (key: TrackColumnKey) => {
    if (REQUIRED_TRACK_COLUMNS.includes(key)) return;

    setVisibleColumns((current) =>
      current.includes(key)
        ? current.filter((column) => column !== key)
        : DEFAULT_TRACK_COLUMNS.filter(
            (column) => current.includes(column) || column === key,
          ),
    );
  };

  const resetColumns = () => setVisibleColumns(DEFAULT_TRACK_COLUMNS);

  return { visibleColumns, toggleColumn, resetColumns };
};

type TrackColumnFilterProps = {
  visibleColumns: readonly TrackColumnKey[];
  onToggle: (key: TrackColumnKey) => void;
  onReset: () => void;
};

const TrackColumnFilter = ({
  visibleColumns,
  onToggle,
  onReset,
}: TrackColumnFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          Columns
          <span aria-hidden className="text-[10px] text-zinc-600">
            ▾
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-52 border-white/10 bg-zinc-950 p-2 text-zinc-300 shadow-2xl"
      >
        <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          Show columns
        </p>

        {TRACK_COLUMNS.filter(({ label }) => label).map((column) => {
          const isLocked = column.configurable === false;
          const isChecked = isLocked || visibleColumns.includes(column.key);

          return (
            <label
              key={column.key}
              className={`flex items-center justify-between rounded-lg px-2 py-2 text-xs ${
                isLocked
                  ? "cursor-not-allowed text-zinc-600"
                  : "cursor-pointer hover:bg-white/[0.05]"
              }`}
            >
              <span>{column.label}</span>
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isLocked}
                onChange={() => onToggle(column.key)}
                className="h-4 w-4 accent-[#B9FF00]"
              />
            </label>
          );
        })}

        <button
          type="button"
          onClick={onReset}
          className="mt-2 w-full rounded-lg border border-white/10 px-2 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
        >
          Reset columns
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default TrackColumnFilter;