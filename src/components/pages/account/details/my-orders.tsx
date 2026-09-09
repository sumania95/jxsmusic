import React, { useState } from "react";
import { api } from "@/utils/api";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrency, formatDateShort, formatTrackTitle } from "@/lib/utils";
import PaginationNewFixedLimitComponents from "@/components/common/pagination-new-fixed-limit";
import { PayPalCheckoutProvider } from "@/components/common/paypal-sdk-provider";
import EmptyComponent from "../../common/empty";
import LoadingSkeletonComponents from "../../common/loading-skeleton";
import PendingOrderPayment from "../../my-orders/pending-order-payment";
import CancelOrderComponents from "../../my-orders/cancel-order";

const MyOrdersComponents = () => {
  const [defaultLimit] = useState(5);

  const itemSkeleton: number[] = Array.from(
    { length: defaultLimit },
    (_, index) => index + 1,
  );

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "desc",
  });

  const [error, setError] = useQueryState("error", {
    defaultValue: "",
  });

  const [pager, setPager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit),
  );

  const allowedStatuses = [
    "ALL",
    "PAID",
    "PENDING",
    "EXPIRED",
    "FAILED",
    "CANCELLED",
  ] as const;

  type Status = (typeof allowedStatuses)[number];

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("ALL"),
  );

  const safeStatus: Status = allowedStatuses.includes(status as Status)
    ? (status as Status)
    : "ALL";

  const { data: order, isLoading } = api.order.getAll.useQuery({
    search: search,
    skip: Number(Number(pager) * limit - limit),
    take: limit,
    sort: sort,
    status: safeStatus,
  });

  const handleChange = useDebouncedCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      void setSearch(event.target.value);
      await setPager(1);
    },
    500,
  );

  return (
    <PayPalCheckoutProvider>
      <div className="flex w-full flex-col items-start gap-5">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-white">My Orders</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Track payments, review totals, and manage pending orders.
          </p>
        </div>

        {/* =====================================================
          PAYMENT ERROR
      ===================================================== */}
        {error && (
          <div className="relative flex w-full flex-col gap-1 rounded-2xl border border-red-500/15 bg-red-500/[0.05] px-4 py-4 text-red-300">
            <h3 className="text-sm font-semibold">
              ERROR : <span>Payment Failed!</span>
            </h3>

            <h3 className="text-xs text-red-300/70">
              Checkout Reference : <span>{error}</span>
            </h3>

            <button
              type="button"
              onClick={() => void setError("")}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =====================================================
          FILTERS
      ===================================================== */}
        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.025] p-3 sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[180px_180px_1fr]">
            {/* STATUS */}
            <div className="flex w-full flex-col">
              <h3 className="mb-1.5 text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
                Status
              </h3>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.025] px-3 text-xs text-zinc-300 shadow-none">
                  <SelectValue placeholder="SELECT STATUS" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>

                    <SelectItem value="ALL">All</SelectItem>

                    <SelectItem value="PAID">Paid</SelectItem>

                    <SelectItem value="PENDING">Pending</SelectItem>

                    <SelectItem value="FAILED">Failed</SelectItem>

                    {/* <SelectItem value="EXPRIRED">Expired</SelectItem> */}
                    {/* <SelectItem value="CANCELLED">Cancelled</SelectItem> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* SORT */}
            <div className="flex w-full flex-col">
              <h3 className="mb-1.5 text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
                Sort
              </h3>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.025] px-3 text-xs text-zinc-300 shadow-none">
                  <SelectValue placeholder="SELECT ORDERING" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort</SelectLabel>

                    <SelectItem value="desc">Latest</SelectItem>

                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* SEARCH */}
            <div className="flex w-full flex-col">
              <h3 className="mb-1.5 text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
                Search Orders
              </h3>

              <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 transition-all focus-within:border-[#B9FF00]/30 focus-within:bg-white/[0.04]">
                <Search className="h-4 w-4 shrink-0 text-zinc-600" />

                <input
                  type="search"
                  defaultValue={search}
                  onChange={handleChange}
                  placeholder="Search title, artist...."
                  className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
          EMPTY
      ===================================================== */}
        {order?.count._count.id === 0 && (
          <div className="flex min-h-[180px] w-full items-center justify-center rounded-3xl border border-dashed border-white/[0.07] bg-white/[0.015] p-5">
            <EmptyComponent />
          </div>
        )}

        {/* =====================================================
          ORDERS
      ===================================================== */}
        <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          {/* SECTION HEADER */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Order History
              </h3>

              <p className="mt-0.5 text-[9px] tracking-[0.14em] text-zinc-600 uppercase">
                View purchases and download your tracks
              </p>
            </div>

            {!isLoading && Number(order?.count._count.id) > 0 && (
              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-zinc-500">
                {order?.count._count.id}
              </span>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 p-2 sm:p-3">
            {/* LOADING */}
            {isLoading &&
              itemSkeleton.map((as, index) => (
                <LoadingSkeletonComponents
                  key={index}
                  className="h-20 w-full rounded-2xl"
                />
              ))}

            <div className="flex w-full flex-col gap-2">
              {order?.orders.map((item) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111518]/50 transition hover:border-[#B9FF00]/20 hover:bg-[#111518]/80"
                >
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-[#B9FF00]/0 transition group-hover:bg-[#B9FF00]" />

                  <div className="flex flex-col gap-4 border-b border-white/[0.06] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-zinc-100">
                          Order #{item.checkoutId}
                        </h3>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase ${
                            item.status === "PAID"
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : item.status === "PENDING"
                                ? "border-[#B9FF00]/20 bg-[#B9FF00]/10 text-[#B9FF00]"
                                : item.status === "FAILED"
                                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                                  : "border-white/[0.08] bg-white/[0.03] text-zinc-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">
                        Placed {formatDateShort(item.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                        Order total
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#B9FF00]">
                        {formatCurrency(item.finalAmount)}
                      </p>
                    </div>
                  </div>
                  {item.failedReason && (
                    <div className="mx-4 mb-4 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 sm:mx-5 sm:mb-5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-red-400">
                        Payment failure
                      </p>
                      <p className="mt-1 text-xs text-red-300/70">
                        {item.failedReason}
                      </p>
                    </div>
                  )}

                  {(item.status === "PAID" || item.status === "PENDING") && (
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.06] bg-white/[0.015] p-3 sm:px-5">
                      {item.status === "PAID" && (
                        <Link
                          href="?type=purchases"
                          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-[10px] font-bold text-black transition hover:bg-cyan-600 active:scale-[0.98]"
                        >
                          View purchases
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}

                      {item.status === "PENDING" && (
                        <>
                          <PendingOrderPayment referenceId={item.referenceId} />
                          <CancelOrderComponents
                            referenceId={String(item.referenceId)}
                            take={limit}
                            skip={pager * limit - limit}
                          />
                        </>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* PAGINATION */}
          <div className="border-t border-white/[0.06] bg-[#111518]/10 p-3">
            <PaginationNewFixedLimitComponents
              defaultLimit={defaultLimit}
              totalItems={Number(order?.count._count.id) ?? 0}
            />
          </div>
        </section>
      </div>
    </PayPalCheckoutProvider>
  );
};

export default MyOrdersComponents;

type OrderDetailProps = {
  label: string;
  value: string;
};

const OrderDetail = ({ label, value }: OrderDetailProps) => (
  <div>
    <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
      {label}
    </p>
    <p className="mt-1 break-all text-sm text-zinc-300">{value}</p>
  </div>
);

type TrackDetailsProps = {
  track: {
    bpm_start: number;
    bpm_end: number;
    in_key: string | null;
  };
};

const TrackDetails = ({ track }: TrackDetailsProps) => {
  const bpm =
    track.bpm_end && track.bpm_end !== track.bpm_start
      ? `${track.bpm_start}-${track.bpm_end} BPM`
      : `${track.bpm_start} BPM`;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-zinc-600">
      <span>{bpm}</span>
      <span aria-hidden="true">•</span>
      <span>{track.in_key ?? "Unknown key"}</span>
    </div>
  );
};