import type { LucideIcon } from "lucide-react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: string | number;
  error?: string;
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
  badge,
  error,
}: SectionHeaderProps) => {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        border-b
        border-white/[0.06]
        bg-white/[0.015]
        px-4
        py-4
        sm:px-5
      "
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-[#B9FF00]/15
            bg-[#B9FF00]/[0.08]
            text-[#B9FF00]
          "
        >
          <Icon
            aria-hidden="true"
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
                className="
                text-sm
                font-semibold
                tracking-wide
                text-zinc-100
                "
            >
                {title}
            </h3>
                {error && (
            <span className="text-[11px] font-medium bg-red-500 text-red-100 px-2">REQUIRED</span>
        )}

          </div>
          {description && (
            <p
              className="
                mt-1
                text-xs
                leading-relaxed
                text-zinc-600
              "
            >
              {description}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="
                mt-1.5
                text-xs
                font-medium
                text-red-400
              "
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {badge !== undefined &&
        badge !== null &&
        badge !== "" && (
          <span
            className="
              shrink-0
              rounded-full
              border
              border-[#B9FF00]/15
              bg-[#B9FF00]/[0.08]
              px-2.5
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-[#B9FF00]
            "
          >
            {badge}
          </span>
        )}
    </div>
  );
};

export default SectionHeader;