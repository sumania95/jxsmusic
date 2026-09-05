import React, { useState } from 'react'
import { api } from '@/utils/api';
import SearchComponent from '@/components/common/search';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import PaginationNewFixedLimitComponents from '@/components/common/pagination-new-fixed-limit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Album,
  ChevronDown,
  Music2,
  Search
} from 'lucide-react';
import {
  formatCurrency,
  formatDateShort,
  formatTrackTitle
} from '@/lib/utils';
import LoadingSkeletonComponents from '@/components/pages/common/loading-skeleton';
import EmptyComponent from '@/components/pages/common/empty';
import BannerTitleComponent from '@/components/common/banner-title';
import { ProfileMeta } from '@/components/common/metadata';
import { useDebouncedCallback } from 'use-debounce';


const AdminOrdersData = () => {
    const [defaultLimit] = useState(5)

    const itemSkeleton: number[] = Array.from(
      { length: defaultLimit },
      (_, index) => index + 1
    );

    const [sort, setSort] = useQueryState("sort", {
        defaultValue: "desc",
    })

    const [pager,setPager] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )

    const [search,setSearch] = useQueryState("search", {
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
      data:order,
      isLoading
    } = api.order.getAllAdmin.useQuery({
        search:search,
        skip:Number(Number(pager)*limit-limit),
        take:limit,
        sort:sort,
        status:safeStatus,
    })

    const handleChange = useDebouncedCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            void setSearch(event.target.value)
            await setPager(1)
        },
        500
    );

  return (
    <div className="flex w-full flex-col items-start gap-4">

      <ProfileMeta
        title='All Orders'
        description='Collection of DJ Music'
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div
        className="
          flex
          w-full
          flex-col
          gap-3
          rounded-2xl
          border
          border-white/[0.06]
          bg-white/[0.015]
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            All Orders
          </h3>

          <h3
            className="
              mt-0.5
              text-[10px]
              uppercase
              tracking-[0.15em]
              text-zinc-600
            "
          >
            {order?.count._count.id} Records
          </h3>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <div
        className="
          flex
          w-full
          flex-col
          gap-3
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-3
          sm:p-4
          md:flex-row
          md:items-end
        "
      >
        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            sm:flex-row
            md:w-auto
          "
        >
          {/* STATUS */}
          <div className="flex w-full flex-col md:w-[180px]">
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
                  <SelectLabel>Status</SelectLabel>

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

                  <SelectItem value="EXPIRED">
                    Expired
                  </SelectItem>

                  <SelectItem value="CANCELLED">
                    Cancelled
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* SORT */}
          <div className="flex w-full flex-col md:w-[180px]">
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
                  <SelectLabel>Sort</SelectLabel>

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
            rounded-2xl
            border
            border-dashed
            border-white/[0.07]
            bg-white/[0.015]
            p-4
          "
        >
          <EmptyComponent />
        </div>
      }

      {/* =====================================================
          ORDERS
      ===================================================== */}
      <div className="flex w-full flex-col items-start gap-2">

        {/* LOADING */}
        {isLoading &&
          itemSkeleton.map((as,index)=>(
            <LoadingSkeletonComponents
              key={index}
              className="
                h-20
                w-full
                rounded-2xl
              "
            />
          ))
        }

        {/* ACCORDION */}
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
          {order?.orders.map((item,index)=>(
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
              {/* Hover accent */}
              <span
                className="
                  absolute
                  left-0
                  top-1/2
                  h-8
                  w-0.5
                  -translate-y-1/2
                  rounded-full
                  bg-[#B9FF00]
                  opacity-0
                  shadow-[0_0_10px_rgba(185,255,0,0.4)]
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
                {/* Chevron */}
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

                {/* Reference */}
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
                      text-xs
                      text-zinc-500
                    "
                  >
                    Customer: {item.user?.name}
                  </h3>

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
                    {item.orderPurchase.length===1
                      ? "item"
                      : "items"}
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

                  {/* Mobile amount */}
                  <h3
                    className="
                      mt-1
                      flex
                      text-sm
                      font-semibold
                      text-zinc-300
                      md:hidden
                    "
                  >
                    {formatCurrency(item.amount)}
                  </h3>

                  {/* Mobile date */}
                  <h3
                    className="
                      flex
                      text-[10px]
                      text-zinc-600
                      md:hidden
                    "
                  >
                    {formatDateShort(item.createdAt)}
                  </h3>
                </div>

                {/* Amount */}
                <div
                  className="
                    hidden
                    w-52
                    shrink-0
                    flex-col
                    md:flex
                  "
                >
                  {item.discountAmount>0 &&
                    <div className="flex items-center gap-2">
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

                {/* Status */}
                <div
                  className="
                    hidden
                    w-52
                    shrink-0
                    md:flex
                  "
                >
                  <span
                    className="
                      rounded-full
                      border
                      border-white/[0.06]
                      bg-white/[0.025]
                      px-2.5
                      py-1
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-zinc-500
                    "
                  >
                    {item.status}
                  </span>
                </div>

                {/* Date */}
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
              </AccordionTrigger>

              {/* =================================================
                  CONTENT
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
                    .filter((item)=>item.track!==null)
                    .map((d,idx)=>(
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
                            bg-emerald-500/[0.07]
                            text-emerald-400
                          "
                        >
                          <Music2 className="h-3.5 w-3.5" />
                        </div>

                        <h3
                          className="
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
                      </div>
                    ))
                  }

                  {/* ALBUM TRACKS */}
                  {item.orderPurchase.map((d,idx)=>(
                    <>
                      {d.album?.trackAlbum.map((w,index)=>(
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
                              bg-cyan-500/[0.07]
                              text-cyan-400
                            "
                          >
                            <Album className="h-3.5 w-3.5" />
                          </div>

                          <div
                            className="
                              flex
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
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* =====================================================
            PAGINATION
        ===================================================== */}
        <div
          className="
            mt-1
            w-full
            rounded-2xl
            border
            border-white/[0.05]
            bg-white/[0.015]
            p-2
          "
        >
          <PaginationNewFixedLimitComponents
            defaultLimit={defaultLimit}
            totalItems={
              Number(order?.count._count.id)??0
            }
          />
        </div>
      </div>
    </div>
  )
}


export default AdminOrdersData


type Coupon = {
  couponId:string
}


const CouponComponent = (props:Coupon)=>{
  const {data:coupon} = api.coupon.getId.useQuery({
    couponId:props.couponId
  },{
    enabled:!!props.couponId
  })

  return (
    <h3 className="text-xs text-red-400 dark:text-zinc-400">
      {coupon?.type==="PERCENT"
        ? `${coupon.value}%`
        : formatCurrency(coupon?.value)
      } OFF
    </h3>
  )
}