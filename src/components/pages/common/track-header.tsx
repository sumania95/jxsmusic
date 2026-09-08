"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import {
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";

import {
  getActiveTrackColumns,
  type TrackColumnKey,
  type TrackSortKey,
} from "./header-filter";

type TrackListHeaderProps = {
  visibleColumns?: readonly TrackColumnKey[];

  /*
   * Pass true to disable sorting.
   * Default: false
   */
  sortDisabled?: boolean;
};

type SortOrder = "asc" | "desc";

const SORTABLE_COLUMNS: TrackSortKey[] = [
  "track",
  "key",
  "bpm",
  "energy",
  "release_year",
  "price",
];

const isSortableColumn = (
  key: TrackColumnKey,
): key is TrackSortKey => {
  return SORTABLE_COLUMNS.includes(
    key as TrackSortKey,
  );
};

const TrackListHeader = ({
  visibleColumns,
  sortDisabled = false,
}: TrackListHeaderProps) => {
  const activeColumns =
    getActiveTrackColumns(visibleColumns);

  const [{ sort, order }, setSorting] =
    useQueryStates({
      sort: parseAsStringEnum<TrackSortKey>(
        SORTABLE_COLUMNS,
      ),

      order: parseAsStringEnum<SortOrder>([
        "asc",
        "desc",
      ]),
    });

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const handleSort = async (
    column: TrackSortKey,
  ) => {
    if (sortDisabled) {
      return;
    }

    const nextOrder: SortOrder =
      sort === column
        ? order === "asc"
          ? "desc"
          : "asc"
        : getDefaultOrder(column);

    await setSorting({
      sort: column,
      order: nextOrder,
    });

    await setPage(1);
  };

  return (
    <div
      className="
        hidden w-full items-center gap-4
        border-b border-white/[0.06]
        bg-white/[0.015] px-4 py-3 md:grid
      "
      style={{
        gridTemplateColumns: activeColumns
          .map(({ width }) => width)
          .join(" "),
      }}
    >
      {activeColumns.map((column) => {
        const sortable =
          !sortDisabled &&
          column.sortable &&
          isSortableColumn(column.key);

        const active =
          sortable && sort === column.key;

        const alignmentClass =
          column.align === "center"
            ? "justify-center text-center"
            : column.align === "right"
              ? "mr-2 justify-end text-right"
              : "justify-start text-left";

        return (
          <div
            key={column.key}
            className={`flex ${alignmentClass}`}
          >
            {column.label &&
              (sortable ? (
                <button
                  type="button"
                  onClick={() =>
                    void handleSort(column.key)
                  }
                  aria-label={`Sort by ${column.label}`}
                  aria-pressed={active}
                  className={`
                    group inline-flex h-6
                    cursor-pointer items-center
                    gap-1.5 whitespace-nowrap
                    rounded-md px-1.5 py-1
                    text-[9px] font-medium
                    uppercase tracking-[0.14em]
                    transition-colors
                    ${
                      active
                        ? "text-[#B9FF00]"
                        : "text-zinc-600 hover:text-zinc-300"
                    }
                  `}
                >
                  <span>{column.label}</span>

                  <SortIcon
                    active={active}
                    order={order}
                  />
                </button>
              ) : (
                <span
                  className="
                    inline-flex h-6 items-center
                    whitespace-nowrap rounded-md
                    px-1.5 py-1 text-[9px]
                    font-medium uppercase
                    tracking-[0.14em]
                    text-zinc-600
                  "
                >
                  {column.label}
                </span>
              ))}
          </div>
        );
      })}
    </div>
  );
};

type SortIconProps = {
  active: boolean;
  order: SortOrder | null;
};

const SortIcon = ({
  active,
  order,
}: SortIconProps) => {
  return (
    <span className="flex h-3 w-3 shrink-0 items-center justify-center">
      {!active ? (
        <ArrowUpDown className="h-3 w-3 text-zinc-700 transition-colors group-hover:text-zinc-400" />
      ) : order === "asc" ? (
        <ArrowDown className="h-3 w-3 text-[#B9FF00]" />
      ) : (
        <ArrowUp className="h-3 w-3 text-[#B9FF00]" />
      )}
    </span>
  );
};

function getDefaultOrder(
  column: TrackSortKey,
): SortOrder {
  if (
    column === "release_year" ||
    column === "energy" ||
    column === "bpm" ||
    column === "price"
  ) {
    return "desc";
  }

  return "asc";
}

export default TrackListHeader;