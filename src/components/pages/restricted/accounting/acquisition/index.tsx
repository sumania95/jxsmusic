"use client";

import {
  CreditCard,
  Download,
  FileAudio,
  FileVideo,
  ReceiptText,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAtom } from "jotai";
import {
  parseAsInteger,
  useQueryState,
} from "nuqs";

import SearchComponent from "@/components/common/search";
import PaginationNewComponents from "@/components/common/pagination-new";
import { defaultPageLimit } from "@/state/globalState";
import { api } from "@/utils/api";

const money = (
  cents: number | null | undefined,
  currency = "USD",
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format((cents ?? 0) / 100);

const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function AccountingAcquisition() {
  const [defaultLimit] = useAtom(defaultPageLimit);

  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const [search] = useQueryState("search", {
    defaultValue: "",
  });

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit),
  );

  const {
    data,
    isLoading,
    error,
  } = api.accounting.getAll.useQuery({
    search,
    skip: pager * limit - limit,
    take: limit,
  });

  const totalItems = Number(data?.count ?? 0);

  const skeletonItems = Array.from(
    { length: Math.min(limit, 10) },
    (_, index) => index,
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B9FF00]/10 text-[#B9FF00]">
            <Download className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Track acquisitions
            </h3>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              {totalItems}{" "}
              {totalItems === 1 ? "record" : "records"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AcquisitionLegend
            icon={ShoppingCart}
            label="Cart"
            className="text-[#B9FF00]"
          />

          <AcquisitionLegend
            icon={CreditCard}
            label="Credit"
            className="text-violet-400"
          />
        </div>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-[#B9FF00]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
            Search acquisitions
          </span>
        </div>

        <SearchComponent
          className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 transition-all focus-within:border-[#B9FF00]/30 focus-within:bg-white/[0.04]"
          placeholder="Search by track"
        />
      </section>

      {/* Acquisition list */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-5">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Acquisition history
            </h4>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
              Tracks acquired through cart or credits
            </p>
          </div>

          {!isLoading && totalItems > 0 && (
            <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-zinc-500">
              {totalItems}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 p-2 sm:p-3">
          {/* Loading */}
          {isLoading &&
            skeletonItems.map((item) => (
              <AcquisitionSkeleton key={item} />
            ))}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-red-400/15 bg-red-400/[0.025] p-6 text-center">
              <div>
                <Download className="mx-auto h-6 w-6 text-red-400/50" />

                <p className="mt-3 text-xs font-medium text-red-400">
                  Failed to load acquisitions
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !error &&
            data?.tracks.length === 0 && (
              <div className="flex min-h-[200px] w-full items-center justify-center rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015] p-6 text-center">
                <div>
                  <Download className="mx-auto h-6 w-6 text-zinc-700" />

                  <p className="mt-3 text-xs font-medium text-zinc-500">
                    No acquisitions found
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-700">
                    Try another track search.
                  </p>
                </div>
              </div>
            )}

          {/* Rows */}
          {!isLoading &&
            !error &&
            data?.tracks.map((item) => {
              const isCredit =
                item.acquisitionType === "CREDIT";

              const isVideo =
                item.track.filetype
                  ?.toLowerCase()
                  .includes("video") ?? false;

              const customer =
                item.user.name ??
                item.user.email ??
                "Unknown customer";

              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.015] transition-all duration-200 hover:border-[#B9FF00]/15 hover:bg-white/[0.025]"
                >
                  <span className="absolute left-0 top-1/2 z-10 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[#B9FF00] opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    {/* Track */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          isCredit
                            ? "bg-violet-400/10 text-violet-400"
                            : "bg-[#B9FF00]/10 text-[#B9FF00]",
                        ].join(" ")}
                      >
                        {isVideo ? (
                          <FileVideo className="h-4 w-4" />
                        ) : (
                          <FileAudio className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-100">
                          {item.track.artist} – {item.track.title}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-600">
                          <User className="h-3 w-3 shrink-0" />

                          <span className="truncate">
                            {customer}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="flex items-center justify-between gap-3 sm:justify-start">
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide",
                          isCredit
                            ? "bg-violet-400/10 text-violet-400"
                            : "bg-[#B9FF00]/10 text-[#B9FF00]",
                        ].join(" ")}
                      >
                        {isCredit ? (
                          <CreditCard className="h-3 w-3" />
                        ) : (
                          <ShoppingCart className="h-3 w-3" />
                        )}

                        {item.acquisitionType}
                      </span>

                      <div className="text-right sm:w-32">
                        {isCredit ? (
                          <>
                            <p className="text-xs font-semibold text-zinc-200">
                              {item.creditsSpent}{" "}
                              {item.creditsSpent === 1
                                ? "credit"
                                : "credits"}
                            </p>

                            <p className="mt-0.5 text-[9px] text-zinc-700">
                              No order
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="flex items-center justify-end gap-1 text-xs font-semibold text-zinc-200">
                              <ReceiptText className="h-3 w-3 text-zinc-600" />

                              {item.order?.referenceId ??
                                "Unknown order"}
                            </p>

                            {item.order && (
                              <p className="mt-0.5 text-[9px] text-zinc-700">
                                {money(
                                  item.order.finalAmount,
                                  item.order.currency,
                                )}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="hidden w-32 text-right md:block">
                        <p className="text-[10px] text-zinc-500">
                          {formatDate(item.createdAt)}
                        </p>

                        <p className="mt-0.5 text-[9px] uppercase text-zinc-700">
                          {isVideo ? "Video" : "Audio"}
                          {item.track.is_explicit
                            ? " · Explicit"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        {totalItems > 0 && (
          <div className="border-t border-white/[0.06] bg-[#111518]/10 p-3">
            <PaginationNewComponents
              totalItems={totalItems}
            />
          </div>
        )}
      </section>
    </div>
  );
}

type AcquisitionLegendProps = {
  icon: typeof CreditCard;
  label: string;
  className: string;
};

function AcquisitionLegend({
  icon: Icon,
  label,
  className,
}: AcquisitionLegendProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium text-zinc-500">
      <Icon className={`h-3 w-3 ${className}`} />
      {label}
    </span>
  );
}

function AcquisitionSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.05]" />

        <div className="min-w-0 flex-1">
          <div className="h-3 w-48 max-w-full rounded bg-white/[0.06]" />
          <div className="mt-2 h-2.5 w-32 max-w-full rounded bg-white/[0.04]" />
        </div>

        <div className="hidden h-6 w-16 rounded-full bg-white/[0.05] sm:block" />
        <div className="hidden h-3 w-24 rounded bg-white/[0.04] md:block" />
      </div>
    </div>
  );
}