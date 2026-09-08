"use client";

import {
  CalendarDays,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import {
  parseAsInteger,
  useQueryState,
  useQueryStates,
} from "nuqs";
import {
  useEffect,
  useState,
} from "react";

import { Slider } from "@/components/ui/slider-bpm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MINIMUM_YEAR = 1950;
const CURRENT_YEAR = new Date().getFullYear();

const DataYearComponent = () => {
  const [{ yearFrom, yearTo }, setYears] =
    useQueryStates({
      yearFrom:
        parseAsInteger.withDefault(MINIMUM_YEAR),
      yearTo:
        parseAsInteger.withDefault(CURRENT_YEAR),
    });

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const [range, setRange] = useState([
    yearFrom,
    yearTo,
  ]);

  useEffect(() => {
    setRange([yearFrom, yearTo]);
  }, [yearFrom, yearTo]);

  const isDefaultRange =
    yearFrom === MINIMUM_YEAR &&
    yearTo === CURRENT_YEAR;

  const updateYears = async (
    values: number[],
  ) => {
    const from = values[0];
    const to = values[1];

    if (
      from === undefined ||
      to === undefined ||
      from > to
    ) {
      return;
    }

    await Promise.all([
      setYears({
        yearFrom: from,
        yearTo: to,
      }),
      setPage(1),
    ]);
  };

  const resetYears = async () => {
    setRange([MINIMUM_YEAR, CURRENT_YEAR]);

    await Promise.all([
      setYears({
        yearFrom: null,
        yearTo: null,
      }),
      setPage(1),
    ]);
  };

  return (
    <Popover>
      <PopoverTrigger
        id="year"
        aria-label="Filter by release year"
        className="
          group flex h-10 w-full items-center justify-between
          gap-3 rounded-lg border border-white/10
          bg-white/[0.03] px-3 text-xs font-medium
          tracking-wider text-zinc-400 uppercase outline-none
          transition-all duration-200 hover:border-white/20
          hover:bg-white/[0.06] hover:text-white
          data-[state=open]:border-[#B9FF00]/40
          data-[state=open]:bg-[#B9FF00]/[0.05]
          data-[state=open]:text-[#B9FF00]
        "
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />

          <span>Year</span>

          {!isDefaultRange && (
            <span className="rounded-full bg-[#B9FF00] px-2 py-0.5 text-[8px] font-bold text-black normal-case">
              {yearFrom}–{yearTo}
            </span>
          )}
        </span>

        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#B9FF00]" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="
          w-[300px] overflow-hidden rounded-xl
          border border-zinc-700 bg-zinc-950
          p-0 text-zinc-100 shadow-xl shadow-black/40
        "
      >
        <div className="border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold">
            Release year
          </h3>

          <p className="mt-0.5 text-[11px] text-zinc-500">
            Choose a release-year range
          </p>
        </div>

        <div className="px-5 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="block text-[9px] font-semibold tracking-wider text-zinc-600 uppercase">
                From
              </span>

              <span className="mt-1 block text-lg font-bold text-[#B9FF00] tabular-nums">
                {range[0]}
              </span>
            </div>

            <div className="h-px flex-1 bg-zinc-800 mx-4" />

            <div className="text-right">
              <span className="block text-[9px] font-semibold tracking-wider text-zinc-600 uppercase">
                To
              </span>

              <span className="mt-1 block text-lg font-bold text-[#B9FF00] tabular-nums">
                {range[1]}
              </span>
            </div>
          </div>

          <Slider
            value={range}
            min={MINIMUM_YEAR}
            max={CURRENT_YEAR}
            step={1}
            minStepsBetweenThumbs={0}
            onValueChange={(values) => {
              const from = values[0];
              const to = values[1];

              if (
                from === undefined ||
                to === undefined ||
                from > to
              ) {
                return;
              }

              setRange(values);
            }}
            onValueCommit={(values) => {
              void updateYears(values);
            }}
            className="w-full cursor-pointer"
          />

          <div className="mt-3 flex justify-between text-[9px] font-medium text-zinc-600">
            <span>{MINIMUM_YEAR}</span>
            <span>{CURRENT_YEAR}</span>
          </div>

          <div className="mt-5 rounded-lg border border-[#B9FF00]/10 bg-[#B9FF00]/5 px-3 py-2">
            <p className="m-0 text-center text-[11px] text-zinc-400">
              Showing releases from{" "}
              <span className="font-semibold text-[#B9FF00]">
                {range[0]}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#B9FF00]">
                {range[1]}
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-900/80 p-3">
          <button
            type="button"
            onClick={() => {
              void resetYears();
            }}
            disabled={isDefaultRange}
            className="
              flex w-full items-center justify-center gap-2
              rounded-md border border-zinc-700 bg-zinc-800
              px-3 py-2 text-xs font-medium text-zinc-300
              transition-all duration-200
              hover:border-[#B9FF00]/30
              hover:bg-[#B9FF00]/5
              hover:text-[#B9FF00]
              disabled:pointer-events-none disabled:opacity-40
            "
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Years
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DataYearComponent;