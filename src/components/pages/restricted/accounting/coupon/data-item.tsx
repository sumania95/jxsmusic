import React from "react";
import {
  AlertCircle,
  BadgePercent,
  CalendarDays,
  TicketPercent,
} from "lucide-react";

import AdminCouponDelete from "./helper/action-delete";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Props {
  id: string;
  name: string | null;
  code: string;
  year: number;
  type: string;
  value: number;
  isActive: boolean;
  startsAt: Date | null;
  expiresAt: Date | null;
}

const AdminCouponItem = ({
  id,
  name,
  code,
  type,
  value,
  year,
  isActive,
  startsAt,
  expiresAt,
}: Props) => {
  const now = new Date();

  const isExpired =
    !isActive ||
    (expiresAt !== null &&
      new Date(expiresAt) < now);

  const formattedStart = startsAt
    ? new Date(startsAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )
    : "No start date";

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )
    : "No expiry";

  const discountLabel =
    type === "PERCENT"
      ? `${value}% OFF`
      : type === "FIXED"
        ? `${formatCurrency(value)} OFF`
        : String(value);

  return (
    <div
      className={`
        flex
        w-full
        flex-col
        gap-4
        px-4
        py-4
        text-zinc-300
        md:grid
        md:grid-cols-[minmax(220px,1.4fr)_90px_150px_150px_110px_44px]
        md:items-center
        md:gap-4

        ${
          isExpired
            ? "bg-red-500/[0.015]"
            : ""
        }
      `}
    >
      {/* =====================================================
          COUPON
      ===================================================== */}
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border

              ${
                isExpired
                  ? `
                    border-red-500/15
                    bg-red-500/[0.06]
                    text-red-400
                  `
                  : `
                    border-[#B9FF00]/10
                    bg-[#B9FF00]/[0.07]
                    text-[#B9FF00]
                  `
              }
            `}
          >
            <TicketPercent className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3
                className={`
                  truncate
                  text-sm
                  font-semibold

                  ${
                    isExpired
                      ? "text-zinc-500"
                      : "text-zinc-200"
                  }
                `}
              >
                {name ?? "Untitled Coupon"}
              </h3>

              {isExpired && (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="
                  rounded-lg
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-2
                  py-0.5
                  font-mono
                  text-[9px]
                  font-semibold
                  tracking-[0.12em]
                  text-zinc-400
                "
              >
                {code}
              </Badge>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold

                  ${
                    isExpired
                      ? `
                        border-red-500/15
                        bg-red-500/[0.06]
                        text-red-400
                      `
                      : `
                        border-[#B9FF00]/15
                        bg-[#B9FF00]/[0.06]
                        text-[#B9FF00]
                      `
                  }
                `}
              >
                <BadgePercent className="h-3 w-3" />
                {discountLabel}
              </span>
            </div>

            {/* Mobile dates */}
            <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
              <MobileMeta
                label="Starts"
                value={formattedStart}
              />

              <MobileMeta
                label="Expires"
                value={formattedExpiry}
                danger={isExpired}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          YEAR
      ===================================================== */}
      <div className="hidden md:block">
        <MetaLabel>Year</MetaLabel>

        <p className="mt-1 text-xs font-medium text-zinc-400">
          {year}
        </p>
      </div>

      {/* =====================================================
          START
      ===================================================== */}
      <div className="hidden md:block">
        <MetaLabel>Starts</MetaLabel>

        <div className="mt-1 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 text-zinc-700" />

          <span className="text-[10px] text-zinc-500">
            {formattedStart}
          </span>
        </div>
      </div>

      {/* =====================================================
          EXPIRES
      ===================================================== */}
      <div className="hidden md:block">
        <MetaLabel>Expires</MetaLabel>

        <div className="mt-1 flex items-center gap-1.5">
          <CalendarDays
            className={`
              h-3
              w-3
              ${
                isExpired
                  ? "text-red-500"
                  : "text-zinc-700"
              }
            `}
          />

          <span
            className={`
              text-[10px]
              ${
                isExpired
                  ? "text-red-400"
                  : "text-zinc-500"
              }
            `}
          >
            {formattedExpiry}
          </span>
        </div>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}
      <div>
        <MetaLabel>Status</MetaLabel>

        <span
          className={`
            mt-1
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            px-2
            py-1
            text-[9px]
            font-semibold
            uppercase
            tracking-wider

            ${
              isExpired
                ? `
                  border-red-500/15
                  bg-red-500/[0.06]
                  text-red-400
                `
                : `
                  border-emerald-500/15
                  bg-emerald-500/[0.06]
                  text-emerald-400
                `
            }
          `}
        >
          <span
            className={`
              h-1.5
              w-1.5
              rounded-full

              ${
                isExpired
                  ? "bg-red-400"
                  : "bg-emerald-400"
              }
            `}
          />

          {isExpired
            ? "Expired"
            : "Active"}
        </span>
      </div>

      {/* =====================================================
          ACTION
      ===================================================== */}
      <div className="flex justify-end">
        <AdminCouponDelete id={id} />
      </div>
    </div>
  );
};

export default AdminCouponItem;

/* =========================================================
   HELPERS
========================================================= */

const MetaLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p
      className="
        text-[8px]
        font-medium
        uppercase
        tracking-[0.14em]
        text-zinc-700
      "
    >
      {children}
    </p>
  );
};

const MobileMeta = ({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.05]
        bg-white/[0.015]
        p-2.5
      "
    >
      <MetaLabel>{label}</MetaLabel>

      <p
        className={`
          mt-1
          truncate
          text-[10px]
          font-medium

          ${
            danger
              ? "text-red-400"
              : "text-zinc-500"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
};