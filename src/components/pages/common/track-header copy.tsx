import {
  getActiveTrackColumns,
  type TrackColumnKey,
} from "./header-filter";

type TrackListHeaderProps = {
  visibleColumns: readonly TrackColumnKey[];
};

const TrackListHeader = ({ visibleColumns }: TrackListHeaderProps) => {
  const activeColumns = getActiveTrackColumns(visibleColumns);

  return (
    <div
      className="hidden w-full items-center gap-4 border-b border-white/[0.06] bg-white/[0.015] px-4 py-3 md:grid"
      style={{
        gridTemplateColumns: activeColumns
          .map(({ width }) => width)
          .join(" "),
      }}
    >
      {activeColumns.map((column) => (
        <div
          key={column.key}
          className={
            column.align === "center"
              ? "text-center"
              : column.align === "right"
                ? "mr-2 text-right"
                : undefined
          }
        >
          {column.label && (
            <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              {column.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackListHeader;
