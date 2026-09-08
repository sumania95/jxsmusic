"use client";

import {
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  useQueryState,
} from "nuqs";

import { getEnergyTheme } from "@/utils/energy-theme";
import { Checkbox } from "../ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

const energyData = Array.from(
  { length: 10 },
  (_, index) => 10 - index,
);

const DataEnergyComponent = () => {
  const [selectedEnergy, setSelectedEnergy] =
    useQueryState(
      "energy",
      parseAsArrayOf(parseAsInteger)
        .withDefault([])
        .withOptions({
          clearOnDefault: true,
        }),
    );

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const toggleEnergy = (energy: number) => {
    void setSelectedEnergy((previous) => {
      if (previous.includes(energy)) {
        return previous.filter(
          (value) => value !== energy,
        );
      }

      return [...previous, energy].sort(
        (first, second) => second - first,
      );
    });

    void setPage(1);
  };

  const resetEnergy = () => {
    void setSelectedEnergy([]);
    void setPage(1);
  };

  return (
    <Popover>
      <PopoverTrigger
        id="energy"
        aria-label="Filter by energy"
        className="
          group flex h-10 w-full items-center
          justify-between gap-3 rounded-lg border
          border-white/10 bg-white/[0.03] px-3
          text-xs font-medium tracking-wider
          text-zinc-400 uppercase outline-none
          transition-all duration-200
          hover:border-white/20 hover:bg-white/[0.06]
          hover:text-white
          data-[state=open]:border-[#B9FF00]/40
          data-[state=open]:bg-[#B9FF00]/[0.05]
          data-[state=open]:text-[#B9FF00]
        "
      >
        <span className="flex items-center gap-2">
          <span>Energy</span>

          {selectedEnergy.length > 0 && (
            <span
              className="
                flex h-5 min-w-5 items-center
                justify-center rounded-full
                bg-[#B9FF00] px-1.5 py-0.5
                text-[8px] font-bold text-black
              "
            >
              {selectedEnergy.length}
            </span>
          )}
        </span>

        <ChevronDown
          className="
            h-3.5 w-3.5 text-zinc-500
            transition-transform duration-200
            group-data-[state=open]:rotate-180
            group-data-[state=open]:text-[#B9FF00]
          "
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="
          w-[250px] overflow-hidden rounded-xl
          border border-zinc-700 bg-zinc-950
          p-0 text-zinc-100 shadow-xl shadow-black/40
        "
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">
              Energy Level
            </h3>

            <p className="mt-0.5 text-[11px] text-zinc-500">
              Mixed In Key · 1–10
            </p>
          </div>

          {selectedEnergy.length > 0 && (
            <span className="rounded-full bg-[#B9FF00]/10 px-2 py-1 text-[10px] font-medium text-[#B9FF00]">
              {selectedEnergy.length} selected
            </span>
          )}
        </div>

        <div className="scrollbar-hide max-h-[390px] space-y-1 overflow-y-auto p-3">
          {energyData.map((energy) => {
            const active =
              selectedEnergy.includes(energy);

            const theme =
              getEnergyTheme(energy);

            return (
              <label
                key={energy}
                className={`
                  flex cursor-pointer items-center
                  gap-3 rounded-lg border px-3 py-2
                  transition-all duration-150
                  ${
                    active
                      ? theme.filterClass
                      : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                  }
                `}
              >
                <Checkbox
                  checked={active}
                  onCheckedChange={() =>
                    toggleEnergy(energy)
                  }
                  className={`
                    h-4 w-4 border-zinc-600
                    data-[state=checked]:border-current
                    data-[state=checked]:bg-current
                    [&>svg]:text-black
                    ${
                      active
                        ? theme.valueClass
                        : "text-zinc-500"
                    }
                  `}
                />

                <span
                  className="
                    flex h-7 w-7 shrink-0
                    items-center justify-center
                    rounded-md bg-white/[0.04]
                    text-xs font-bold tabular-nums
                  "
                >
                  {energy}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-medium">
                    {theme.label}
                  </span>

                  <div className="mt-1 flex gap-0.5">
                    {Array.from(
                      { length: 10 },
                      (_, index) => (
                        <span
                          key={index}
                          className={`
                            h-0.5 flex-1 rounded-full
                            ${
                              index < energy
                                ? `${theme.barClass} ${theme.glowClass}`
                                : "bg-white/10"
                            }
                          `}
                        />
                      ),
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="border-t border-zinc-800 bg-zinc-900/80 p-3">
          <button
            type="button"
            onClick={resetEnergy}
            disabled={
              selectedEnergy.length === 0
            }
            className="
              flex w-full items-center justify-center
              gap-2 rounded-md border border-zinc-700
              bg-zinc-800 px-3 py-2 text-xs
              font-medium text-zinc-300
              transition-all duration-200
              hover:border-[#B9FF00]/30
              hover:bg-[#B9FF00]/5
              hover:text-[#B9FF00]
              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Energy
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DataEnergyComponent;