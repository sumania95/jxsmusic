import React, { useState } from 'react'
import EmptyComponent from '../common/empty'
import { api } from '@/utils/api'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Album,
  ArrowLeft,
  ChevronDown,
  CreditCard,
  Music2,
  Search,
  X
} from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CancelOrderComponents from './cancel-order'
import BannerTitleComponent from '@/components/common/banner-title'
import {
  parseAsInteger,
  parseAsString,
  useQueryState
} from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import LoadingSkeletonComponents from '../common/loading-skeleton';
import { ProfileMeta } from '@/components/common/metadata';
import {
  formatCurrency,
  formatDateShort,
  formatTrackTitle
} from '@/lib/utils';
import DownloadTrackComponent from '@/components/common/download';
import PaginationNewFixedLimitComponents from '@/components/common/pagination-new-fixed-limit';
import { IconZip } from '@tabler/icons-react';
import { ImArrowDown } from 'react-icons/im';
import { Button } from '@/components/ui/button';
import { DownloadZipComponent } from '@/components/common/download-zip';


const MyOrdersComponents = () => {
  const [defaultLimit] = useState(5)

  const itemSkeleton: number[] = Array.from(
    { length: defaultLimit },
    (_, index) => index + 1
  );

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "desc",
  })

  const [error, setError] = useQueryState("error", {
    defaultValue: "",
  })

  const [pager, setPager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  })

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const allowedStatuses = [
    "ALL",
    "PAID",
    "PENDING",
    "EXPIRED",
    "FAILED",
    "CANCELLED"
  ] as const

  type Status = (typeof allowedStatuses)[number]

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("ALL")
  )

  const safeStatus: Status = allowedStatuses.includes(status as Status)
    ? (status as Status)
    : "ALL"

  const {
    data: order,
    isLoading
  } = api.order.getAll.useQuery({
    search: search,
    skip: Number(Number(pager) * limit - limit),
    take: limit,
    sort: sort,
    status: safeStatus,
  })

  const handleChange = useDebouncedCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      void setSearch(event.target.value)
      await setPager(1)
    },
    500
  );

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <ProfileMeta
        title='My Orders'
        description='Collection of DJ Music'
      />

      {/* =====================================================
          JEFF92 & AYAN SUMANIA HEADER
      ===================================================== */}
      <section
        className="
          relative
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          px-5
          py-8
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-180px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_10px_rgba(185,255,0,0.7)]
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Jeff92 & Ayan Sumania Orders
            </span>
          </div>

          <BannerTitleComponent
            title='Your Orders'
            description='Track and manage your orders'
          />

          <div className="mt-5">
            <Link
              href={'/tracks'}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-3
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-zinc-500
                transition-all
                hover:border-[#B9FF00]/20
                hover:bg-[#B9FF00]/[0.04]
                hover:text-[#B9FF00]
              "
            >
              <ArrowLeft className='h-3.5 w-3.5' />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          PAYMENT ERROR
      ===================================================== */}
      {error &&
        <div
          className="
            relative
            flex
            w-full
            flex-col
            gap-1
            rounded-2xl
            border
            border-red-500/15
            bg-red-500/[0.05]
            px-4
            py-4
            text-red-300
          "
        >
          <h3 className="text-sm font-semibold">
            ERROR : <span>Payment Failed!</span>
          </h3>

          <h3 className="text-xs text-red-300/70">
            Checkout Reference : <span>{error}</span>
          </h3>

          <button
            type="button"
            onClick={() => void setError('')}
            className="
              absolute
              right-3
              top-3
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-red-300/70
              transition
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      }

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <section
        className="
          w-full
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-3
          sm:p-4
        "
      >
        <div
          className="
            grid
            gap-3
            lg:grid-cols-[180px_180px_1fr]
          "
        >
          {/* STATUS */}
          <div className="flex w-full flex-col">
            <h3
              className="
                mb-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Status
            </h3>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger
                className="
                  h-11
                  w-full
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  text-xs
                  text-zinc-300
                  shadow-none
                "
              >
                <SelectValue placeholder="SELECT STATUS" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Status
                  </SelectLabel>

                  <SelectItem value="ALL">
                    All
                  </SelectItem>

                  <SelectItem value="PAID">
                    Paid
                  </SelectItem>

                  <SelectItem value="PENDING">
                    Pending
                  </SelectItem>

                  <SelectItem value="FAILED">
                    Failed
                  </SelectItem>

                  {/* <SelectItem value="EXPRIRED">Expired</SelectItem> */}
                  {/* <SelectItem value="CANCELLED">Cancelled</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* SORT */}
          <div className="flex w-full flex-col">
            <h3
              className="
                mb-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Sort
            </h3>

            <Select
              value={sort}
              onValueChange={setSort}
            >
              <SelectTrigger
                className="
                  h-11
                  w-full
                  rounded-xl
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  text-xs
                  text-zinc-300
                  shadow-none
                "
              >
                <SelectValue placeholder="SELECT ORDERING" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Sort
                  </SelectLabel>

                  <SelectItem value="desc">
                    Latest
                  </SelectItem>

                  <SelectItem value="asc">
                    Oldest First
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* SEARCH */}
          <div className="flex w-full flex-col">
            <h3
              className="
                mb-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-zinc-600
              "
            >
              Search Orders
            </h3>

            <div
              className="
                flex
                h-11
                w-full
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-3
                transition-all
                focus-within:border-[#B9FF00]/30
                focus-within:bg-white/[0.04]
              "
            >
              <Search className="h-4 w-4 shrink-0 text-zinc-600" />

              <input
                type="search"
                defaultValue={search}
                onChange={handleChange}
                placeholder='Search title, artist....'
                className="
                  w-full
                  bg-transparent
                  text-sm
                  text-zinc-300
                  outline-none
                  placeholder:text-zinc-700
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EMPTY
      ===================================================== */}
      {order?.count._count.id === 0 &&
        <div
          className="
            flex
            min-h-[180px]
            w-full
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-white/[0.07]
            bg-white/[0.015]
            p-5
          "
        >
          <EmptyComponent />
        </div>
      }

      {/* =====================================================
          ORDERS
      ===================================================== */}
      <section
        className="
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        {/* SECTION HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-4
            sm:px-5
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Order History
            </h3>

            <p
              className="
                mt-0.5
                text-[9px]
                uppercase
                tracking-[0.14em]
                text-zinc-600
              "
            >
              View purchases and download your tracks
            </p>
          </div>

          {!isLoading &&
            Number(order?.count._count.id) > 0 && (
              <span
                className="
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-3
                  py-1
                  text-[10px]
                  font-medium
                  text-zinc-500
                "
              >
                {order?.count._count.id}
              </span>
            )
          }
        </div>

        <div className="flex w-full flex-col gap-2 p-2 sm:p-3">
          {/* LOADING */}
          {isLoading &&
            itemSkeleton.map((as, index) => (
              <LoadingSkeletonComponents
                key={index}
                className='h-20 w-full rounded-2xl'
              />
            ))
          }

          <Accordion
            type="single"
            collapsible
            className="
              flex
              w-full
              flex-col
              gap-2
            "
          >
            {order?.orders.map((item, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3
                  transition-all
                  duration-200
                  hover:border-[#B9FF00]/15
                  hover:bg-white/[0.025]
                  md:px-5
                "
              >
                {/* HOVER ACCENT */}
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    z-10
                    h-8
                    w-0.5
                    -translate-y-1/2
                    rounded-full
                    bg-[#B9FF00]
                    opacity-0
                    shadow-[0_0_8px_rgba(185,255,0,0.35)]
                    transition-opacity
                    group-hover:opacity-100
                  "
                />

                <AccordionTrigger
                  className="
                    h-auto
                    w-full
                    gap-4
                    py-4
                    hover:cursor-pointer
                    hover:no-underline
                    focus:outline-none
                    md:h-20
                    [&[data-state=open]>svg]:rotate-180
                  "
                >
                  {/* CHEVRON */}
                  <ChevronDown
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-zinc-600
                      transition-transform
                      duration-200
                    "
                  />

                  {/* REFERENCE */}
                  <div
                    className="
                      flex
                      min-w-0
                      w-full
                      flex-col
                      items-start
                      gap-1
                      text-left
                    "
                  >
                    <h3
                      className="
                        w-full
                        truncate
                        text-sm
                        font-semibold
                        uppercase
                        text-zinc-200
                      "
                    >
                      Checkout Ref: {item.checkoutId}
                    </h3>

                    <h3 className="w-full text-[10px] text-zinc-600">
                      {item.orderPurchase.length}{" "}
                      {item.orderPurchase.length === 1
                        ? "item"
                        : "items"
                      }
                    </h3>

                    {item.failedReason &&
                      <h3
                        className="
                          w-full
                          text-[10px]
                          font-medium
                          text-red-400
                        "
                      >
                        Failed Reason : {item.failedReason}
                      </h3>
                    }

                    {/* MOBILE */}
                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        md:hidden
                      "
                    >
                      <h3
                        className="
                          text-sm
                          font-semibold
                          text-zinc-300
                        "
                      >
                        {formatCurrency(item.amount)}
                      </h3>

                      <span
                        className="
                          rounded-full
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          px-2
                          py-0.5
                          text-[9px]
                          font-medium
                          uppercase
                          text-zinc-500
                        "
                      >
                        {item.status}
                      </span>

                      <h3 className="text-[10px] text-zinc-600">
                        {formatDateShort(item.createdAt)}
                      </h3>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div
                    className="
                      hidden
                      w-52
                      shrink-0
                      flex-col
                      md:flex
                    "
                  >
                    {item.discountAmount > 0 &&
                      <div className='flex items-center gap-2'>
                        <h3
                          className="
                            text-[10px]
                            text-zinc-600
                            line-through
                          "
                        >
                          {formatCurrency(item.amount)}
                        </h3>

                        <CouponComponent
                          couponId={item.couponId ?? ""}
                        />
                      </div>
                    }

                    <h3
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-zinc-200
                      "
                    >
                      {formatCurrency(item.finalAmount)}
                    </h3>
                  </div>

                  {/* STATUS */}
                  <div
                    className="
                      hidden
                      w-36
                      shrink-0
                      md:flex
                    "
                  >
                    <span
                      className={`
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wider

                        ${
                          item.status === "PAID"
                            ? "border-green-500/15 bg-green-500/[0.06] text-green-400"
                            : item.status === "PENDING"
                            ? "border-[#B9FF00]/15 bg-[#B9FF00]/[0.06] text-[#B9FF00]"
                            : item.status === "FAILED"
                            ? "border-red-500/15 bg-red-500/[0.06] text-red-400"
                            : "border-white/[0.06] bg-white/[0.025] text-zinc-500"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* PAID DATE */}
                  {item.status === "PAID" &&
                    <div
                      className="
                        hidden
                        w-72
                        shrink-0
                        items-center
                        justify-end
                        md:flex
                      "
                    >
                      <h3 className="text-xs text-zinc-500">
                        {formatDateShort(item.createdAt)}
                      </h3>
                    </div>
                  }

                  {/* PENDING ACTION */}
                  {item.status === "PENDING" &&
                    <div
                      className="
                        flex
                        w-72
                        shrink-0
                        flex-col
                        items-center
                        justify-end
                        gap-1
                        text-xs
                        text-white
                        lg:flex-row
                      "
                    >
                      <Link
                        href={String(item.checkoutUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="
                          flex
                          items-center
                          gap-1.5
                          whitespace-nowrap
                          rounded-xl
                          bg-[#B9FF00]
                          px-3
                          py-2
                          text-[10px]
                          font-semibold
                          text-black
                          transition
                          hover:bg-[#B9FF00]
                        "
                      >
                        <CreditCard className='hidden h-3.5 w-3.5 lg:flex' />
                        Pay Now
                      </Link>

                      <CancelOrderComponents
                        referenceId={String(item.referenceId)}
                        take={limit}
                        skip={Number(Number(pager) * limit - limit)}
                      />
                    </div>
                  }

                  {/* FAILED ACTION */}
                  {item.status === "FAILED" &&
                    new Date() <=
                      new Date(item.expiredAt ?? new Date()) &&
                    <div
                      className="
                        flex
                        w-72
                        shrink-0
                        flex-col
                        items-center
                        justify-end
                        gap-1
                        text-xs
                        text-white
                        lg:flex-row
                      "
                    >
                      <Link
                        href={String(item.checkoutUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="
                          flex
                          items-center
                          gap-1.5
                          whitespace-nowrap
                          rounded-xl
                          bg-[#B9FF00]
                          px-3
                          py-2
                          text-[10px]
                          font-semibold
                          text-black
                          transition
                          hover:bg-[#B9FF00]
                        "
                      >
                        <CreditCard className='hidden h-3.5 w-3.5 lg:flex' />
                        Pay Now
                      </Link>

                      <CancelOrderComponents
                        referenceId={String(item.referenceId)}
                        take={limit}
                        skip={Number(Number(pager) * limit - limit)}
                      />
                    </div>
                  }
                </AccordionTrigger>

                {/* =================================================
                    ORDER CONTENT
                ================================================= */}
                <AccordionContent>
                  <div
                    className="
                      mt-1
                      flex
                      w-full
                      flex-col
                      items-start
                      border-t
                      border-white/[0.05]
                    "
                  >
                    {/* SINGLE TRACKS */}
                    {item.orderPurchase
                      .filter((item) => item.track !== null)
                      .sort((a, b) => {
                        const artistCompare =
                          (a.track?.artist ?? "").localeCompare(
                            b.track?.artist ?? ""
                          );

                        if (artistCompare !== 0)
                          return artistCompare;

                        return (
                          a.track?.title ?? ""
                        ).localeCompare(
                          b.track?.title ?? ""
                        );
                      })
                      .map((d, idx) => (
                        <div
                          key={idx}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            border-b
                            border-white/[0.05]
                            py-3
                            last:border-b-0
                          "
                        >
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-green-500/[0.07]
                              text-green-400
                            "
                          >
                            <Music2 className="h-3.5 w-3.5" />
                          </div>

                          <h3
                            className="
                              min-w-0
                              w-full
                              text-xs
                              font-medium
                              text-zinc-300
                            "
                          >
                            {d.track?.artist} -{" "}
                            {formatTrackTitle(
                              d.track?.title,
                              d.track?.is_explicit
                            )}
                          </h3>

                          {item.status === "PAID" && (
                            <div
                              className="
                                shrink-0
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-white/[0.025]
                                p-2
                              "
                            >
                              <DownloadTrackComponent
                                id={d.track?.id ?? ""}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    }

                    {/* ALBUM TRACKS */}
                    {item.orderPurchase.map((d, idx) => (
                      <React.Fragment key={idx}>
                        {d.album?.trackAlbum
                          ?.slice()
                          .sort((a, b) => {
                            const artistCompare =
                              (a.track?.artist ?? "").localeCompare(
                                b.track?.artist ?? ""
                              );

                            if (artistCompare !== 0)
                              return artistCompare;

                            return (
                              a.track?.title ?? ""
                            ).localeCompare(
                              b.track?.title ?? ""
                            );
                          })
                          .map((w, index) => (
                            <div
                              key={index}
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                border-b
                                border-white/[0.05]
                                py-3
                                last:border-b-0
                              "
                            >
                              <div
                                className="
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-cyan-500/[0.07]
                                  text-cyan-400
                                "
                              >
                                <Album className="h-3.5 w-3.5" />
                              </div>

                              <div
                                className="
                                  flex
                                  min-w-0
                                  w-full
                                  flex-col
                                  items-start
                                "
                              >
                                <h3
                                  className="
                                    w-full
                                    text-xs
                                    font-medium
                                    text-zinc-300
                                  "
                                >
                                  {w.track?.artist} -{" "}
                                  {formatTrackTitle(
                                    w.track?.title,
                                    w.track?.is_explicit
                                  )}
                                </h3>

                                <h3
                                  className="
                                    mt-0.5
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-cyan-500
                                  "
                                >
                                  {d.album?.name}
                                </h3>
                              </div>

                              {item.status === "PAID" && (
                                <div
                                  className="
                                    shrink-0
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.025]
                                    p-2
                                  "
                                >
                                  <DownloadTrackComponent
                                    id={w.track?.id ?? ""}
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        }
                      </React.Fragment>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* PAGINATION */}
        <div
          className="
            border-t
            border-white/[0.06]
            bg-[#111518]/10
            p-3
          "
        >
          <PaginationNewFixedLimitComponents
            defaultLimit={defaultLimit}
            totalItems={
              Number(order?.count._count.id) ?? 0
            }
          />
        </div>
      </section>
    </div>
  )
}


export default MyOrdersComponents


type Coupon = {
  couponId: string
}


const CouponComponent = (props: Coupon) => {
  const { data: coupon } = api.coupon.getId.useQuery({
    couponId: props.couponId
  }, {
    enabled: !!props.couponId
  })

  return (
    <h3 className="text-[10px] font-medium text-red-400">
      {coupon?.type === "PERCENT"
        ? `${coupon.value}%`
        : formatCurrency(coupon?.value)
      } OFF
    </h3>
  )
}