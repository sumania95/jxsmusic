import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Kbd } from "@/components/ui/kbd";
import { Keyboard } from "lucide-react";

const KeyboardShortcutsPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts"
          className="
            flex h-9 w-9 cursor-pointer
            items-center justify-center
            rounded-xl border
            border-white/[0.06]
            bg-white/[0.02]
            text-zinc-500 outline-none
            transition-all duration-200
            hover:border-[#B9FF00]/20
            hover:bg-[#B9FF00]/[0.06]
            hover:text-[#B9FF00]
            focus-visible:ring-2
            focus-visible:ring-[#B9FF00]/30
          "
        >
          <Keyboard className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="
          w-72 overflow-hidden rounded-2xl
          border border-white/10
          bg-zinc-950 p-0 text-zinc-200
          shadow-[0_20px_60px_rgba(0,0,0,0.65)]
        "
      >
        {/* HEADER */}
        <div
          className="
            relative overflow-hidden
            border-b border-white/[0.06]
            px-4 py-3.5
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -right-8 -top-10 h-24 w-24
              rounded-full bg-[#B9FF00]/[0.06]
              blur-3xl
            "
          />

          <div className="relative flex items-center gap-2.5">
            <div
              className="
                flex h-8 w-8 items-center
                justify-center rounded-lg
                border border-[#B9FF00]/15
                bg-[#B9FF00]/[0.06]
                text-[#B9FF00]
              "
            >
              <Keyboard className="h-4 w-4" />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-100">
                Keyboard shortcuts
              </h4>

              <p className="mt-0.5 text-[10px] text-zinc-600">
                Control playback from your keyboard
              </p>
            </div>
          </div>
        </div>

        {/* SHORTCUTS */}
        <div className="space-y-1 p-2">
          <ShortcutRow label="Play / Pause">
            <ShortcutKey>Space</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Seek forward">
            <ShortcutKey>→</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Seek backward">
            <ShortcutKey>←</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Next track">
            <ShortcutKey>N</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Previous track">
            <ShortcutKey>P</ShortcutKey>
          </ShortcutRow>

          <div className="mx-2 my-2 h-px bg-white/[0.06]" />

          <ShortcutRow label="Volume up">
            <ShortcutKey>↑</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Volume down">
            <ShortcutKey>↓</ShortcutKey>
          </ShortcutRow>

          <ShortcutRow label="Mute / Unmute">
            <ShortcutKey>M</ShortcutKey>
          </ShortcutRow>
        </div>

        {/* FOOTER */}
        <div
          className="
            border-t border-white/[0.06]
            bg-white/[0.015] px-4 py-2.5
          "
        >
          <p className="text-center text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-700">
            Shortcuts work while the player is open
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type ShortcutRowProps = {
  label: string;
  children: React.ReactNode;
};

const ShortcutRow = ({
  label,
  children,
}: ShortcutRowProps) => {
  return (
    <div
      className="
        group flex items-center
        justify-between rounded-lg
        px-2.5 py-2 transition-colors
        hover:bg-white/[0.035]
      "
    >
      <span
        className="
          text-[11px] text-zinc-500
          transition-colors
          group-hover:text-zinc-300
        "
      >
        {label}
      </span>

      <div className="flex items-center gap-1">
        {children}
      </div>
    </div>
  );
};

type ShortcutKeyProps = {
  children: React.ReactNode;
};

const ShortcutKey = ({
  children,
}: ShortcutKeyProps) => {
  return (
    <Kbd
      className="
        min-w-7 border border-white/10
        bg-white/[0.05] px-2 py-1
        text-center text-[10px]
        font-semibold text-zinc-300
        shadow-[0_1px_0_rgba(255,255,255,0.08)]
      "
    >
      {children}
    </Kbd>
  );
};

export default KeyboardShortcutsPopover;