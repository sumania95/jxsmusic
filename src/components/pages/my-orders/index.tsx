import React, { useState } from "react";
import EmptyComponent from "../common/empty";
import { api } from "@/utils/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Album,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Music2,
  Search,
  X,
} from "lucide-react";
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
import CancelOrderComponents from "./cancel-order";
import BannerTitleComponent from "@/components/common/banner-title";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import LoadingSkeletonComponents from "../common/loading-skeleton";
import { ProfileMeta } from "@/components/common/metadata";
import { formatCurrency, formatDateShort, formatTrackTitle } from "@/lib/utils";
import DownloadTrackComponent from "@/components/common/download";
import PaginationNewFixedLimitComponents from "@/components/common/pagination-new-fixed-limit";
import { IconZip } from "@tabler/icons-react";
import { ImArrowDown } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { DownloadZipComponent } from "@/components/common/download-zip";
import PendingOrderPayment from "./pending-order-payment";
import { PayPalCheckoutProvider } from "@/components/common/paypal-sdk-provider";

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
        <ProfileMeta title="My Orders" description="Collection of DJ Music" />

        {/* =====================================================
          JEFF92 & AYAN SUMANIA HEADER
      ===================================================== */}
        <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute top-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

              <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
                Jeff92 & Ayan Sumania Orders
              </span>
            </div>

            <BannerTitleComponent
              title="Your Orders"
              description="Track and manage your orders"
            />

            <div className="mt-5">
              <Link
                href={"/tracks"}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase transition-all hover:border-[#B9FF00]/20 hover:bg-[#B9FF00]/[0.04] hover:text-[#B9FF00]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>

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
                  className="relative flex w-full flex-col gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4 transition hover:border-[#B9FF00]/15 hover:bg-white/[0.025] md:flex-row md:items-center md:px-5"
                >
                  {/* ORDER DETAILS */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-zinc-200 uppercase">
                      Checkout Ref: {item.checkoutId}
                    </h3>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      {item.orderPurchase.length}{" "}
                      {item.orderPurchase.length === 1 ? "item" : "items"}
                    </p>

                    {item.failedReason && (
                      <p className="mt-1 text-[10px] font-medium text-red-400">
                        Failed reason: {item.failedReason}
                      </p>
                    )}
                  </div>

                  {/* AMOUNT */}
                  <div className="shrink-0 md:w-36">
                    {item.discountAmount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 line-through">
                          {formatCurrency(item.amount)}
                        </span>

                        <CouponComponent couponId={item.couponId ?? ""} />
                      </div>
                    )}

                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {formatCurrency(item.finalAmount)}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="shrink-0 md:w-28">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase ${
                        item.status === "PAID"
                          ? "border-green-500/20 bg-green-500/10 text-green-400"
                          : item.status === "PENDING"
                            ? "border-[#B9FF00]/20 bg-[#B9FF00]/10 text-[#B9FF00]"
                            : item.status === "FAILED"
                              ? "border-red-500/20 bg-red-500/10 text-red-400"
                              : "border-white/[0.06] bg-white/[0.025] text-zinc-500"
                      } `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* DATE */}
                  <p className="shrink-0 text-xs text-zinc-500 md:w-28">
                    {formatDateShort(item.createdAt)}
                  </p>

                  {/* PAID ACTION */}
                  {item.status === "PAID" && (
                    <Link
                      href="/my-downloads"
                      className="flex h-9 w-50 shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400 px-3 text-[10px] font-bold text-cyan-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                    >
                      My Downloads
                      <ArrowRight />
                    </Link>
                  )}

                  {/* PENDING ACTIONS */}
                  {item.status === "PENDING" && (
                    <div className="flex w-64 shrink-0 flex-col gap-2">
                      <PendingOrderPayment referenceId={item.referenceId} />
                      <CancelOrderComponents
                        referenceId={String(item.referenceId)}
                        take={limit}
                        skip={pager * limit - limit}
                      />
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

type Coupon = {
  couponId: string;
};

const CouponComponent = (props: Coupon) => {
  const { data: coupon } = api.coupon.getId.useQuery(
    {
      couponId: props.couponId,
    },
    {
      enabled: !!props.couponId,
    },
  );

  return (
    <h3 className="text-[10px] font-medium text-red-400">
      {coupon?.type === "PERCENT"
        ? `${coupon.value}%`
        : formatCurrency(coupon?.value)}{" "}
      OFF
    </h3>
  );
};
