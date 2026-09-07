"use client";

import type { ReactNode } from "react";
import {
  CreditCard,
  Download,
  Package,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { api } from "@/utils/api";

const money = (
  cents: number | null | undefined,
  currency = "USD",
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format((cents ?? 0) / 100);

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

const statusClass: Record<string, string> = {
  PAID: "bg-[#B9FF00]/10 text-[#B9FF00]",
  PENDING: "bg-amber-400/10 text-amber-400",
  REFUNDED: "bg-blue-400/10 text-blue-400",
  CANCELLED: "bg-zinc-400/10 text-zinc-400",
  FAILED: "bg-red-400/10 text-red-400",
};

export default function AdminDashboardData() {
  const reduceMotion = useReducedMotion();

  const {
    data,
    isLoading,
    error,
  } = api.accounting.overview.useQuery();

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-zinc-500">
        Loading accounting…
      </p>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-sm text-red-400">
        Failed to load accounting: {error.message}
      </p>
    );
  }

  if (!data) {
    return null;
  }

  const cards = [
    {
      label: "Paid revenue",
      value: money(
        (data.paid._sum.finalAmount ?? 0) -
          (data.paid._sum.paypalFee ?? 0),
      ),
      meta:
        `${money(data.paid._sum.finalAmount)} gross − ` +
        `${money(data.paid._sum.paypalFee)} PayPal fees`,
      icon: WalletCards,
    },
    {
      label: "Pending",
      value: money(data.pending._sum.finalAmount),
      meta: `${data.pending._count.id} orders`,
      icon: RefreshCw,
    },
    {
      label: "Refunded",
      value: money(data.refunded._sum.finalAmount),
      meta: `${data.refunded._count.id} orders`,
      icon: RotateCcw,
    },
    {
      label: "Credit-pack sales",
      value: money(data.creditSales._sum.finalAmount),
      meta:
        `${data.creditSales._count.id} packs / ` +
        `${data.creditSales._sum.creditAmount ?? 0} credits`,
      icon: CreditCard,
    },
    {
      label: "Active Credit Users",
      value: data.activeUserCredits._count.id,
      meta:
        `${data.activeUserCredits._sum.credit ?? 0} Remaining Credits`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({ label, value, meta, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.05,
              }}
              className="rounded-2xl border border-white/10 bg-[#171d20] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
            >
              <Icon className="h-5 w-5 text-[#B9FF00]" />

              <p className="mt-4 text-xs text-zinc-500">
                {label}
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {value}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {meta}
              </p>
            </motion.div>
          ),
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <DashboardPanel
          title="Recent orders"
          description="Latest store and credit-pack orders"
          icon={ReceiptText}
        >
          {data.recentOrders.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              message="No recent orders"
            />
          ) : (
            <div className="max-h-[500px] divide-y divide-white/[0.06] overflow-y-auto pr-1 scrollbar-hide">
              {data.recentOrders.map((order) => {
                const isCreditPack =
                  order.purpose === "CREDIT_PACK";

                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                      {isCreditPack ? (
                        <CreditCard className="h-4 w-4 text-violet-400" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 text-[#B9FF00]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {order.user?.name ??
                            order.user?.email ??
                            "Guest customer"}
                        </p>

                        <span
                          className={[
                            "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold",
                            statusClass[order.status] ??
                              "bg-white/5 text-zinc-400",
                          ].join(" ")}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-600">
                        {order.referenceId} ·{" "}
                        {isCreditPack
                          ? `${order.creditAmount} credits`
                          : "Store order"}{" "}
                        · {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-white">
                        {money(
                          order.finalAmount,
                          order.currency,
                        )}
                      </p>

                      {order.paypalFee > 0 && (
                        <p className="mt-1 text-[10px] text-zinc-600">
                          Fee {money(order.paypalFee, order.currency)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Recent track acquisitions"
          description="Tracks acquired using cart or credits"
          icon={Download}
        >
          {data.recentAcquisitions.length === 0 ? (
            <EmptyState
              icon={Download}
              message="No recent track acquisitions"
            />
          ) : (
            <div className="max-h-[500px] divide-y divide-white/[0.06] overflow-y-auto pr-1 scrollbar-hide">
              {data.recentAcquisitions.map((acquisition) => {
                const isCredit =
                  acquisition.acquisitionType === "CREDIT";

                return (
                  <div
                    key={acquisition.id}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        isCredit
                          ? "bg-violet-400/10"
                          : "bg-[#B9FF00]/10",
                      ].join(" ")}
                    >
                      {isCredit ? (
                        <CreditCard className="h-4 w-4 text-violet-400" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 text-[#B9FF00]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {acquisition.track.artist} –{" "}
                          {acquisition.track.title}
                        </p>

                        <span
                          className={[
                            "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold",
                            isCredit
                              ? "bg-violet-400/10 text-violet-400"
                              : "bg-[#B9FF00]/10 text-[#B9FF00]",
                          ].join(" ")}
                        >
                          {acquisition.acquisitionType}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-600">
                        {acquisition.user.name ??
                          acquisition.user.email ??
                          "Unknown customer"}{" "}
                        · {formatDate(acquisition.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}

type DashboardPanelProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
};

function DashboardPanel({
  title,
  description,
  icon: Icon,
  children,
}: DashboardPanelProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-[#171d20] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9FF00]/10">
          <Icon className="h-4 w-4 text-[#B9FF00]" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-zinc-600">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

type EmptyStateProps = {
  icon: LucideIcon;
  message: string;
};

function EmptyState({
  icon: Icon,
  message,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10">
      <Icon className="h-6 w-6 text-zinc-700" />

      <p className="mt-3 text-xs text-zinc-600">
        {message}
      </p>
    </div>
  );
}