import React from 'react'
import { api } from '@/utils/api';
import SearchComponent from '@/components/common/search';
import { defaultPageLimit } from '@/state/globalState';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useAtom } from 'jotai';
import PaginationNewComponents from '@/components/common/pagination-new';
import AdminwebhookSkeletonComponents from './data-item-track-skeleton';
import AdminwebhookItem from './data-item';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  Webhook
} from 'lucide-react';


const AdminWebhookData = () => {
    const itemSkeleton: number[] = Array.from({ length: 25 }, (_, index) => index + 1);
    const [defaultLimit] = useAtom(defaultPageLimit)

    const [status, setStatus] = useQueryState(
        "status",
        parseAsString.withDefault("ALL")
    )

    const [search] = useQueryState("search", {
        defaultValue: ""
    })

    const [pager] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )

    const [limit] = useQueryState(
        "limit",
        parseAsInteger.withDefault(defaultLimit)
    )

    const {data:webhook,isLoading} = api.webhook.getAll.useQuery({
        status:status,
        search:search,
        skip: Number(Number(pager) * limit - limit),
        take: limit,
    })

  return (
    <div className="flex w-full flex-col items-start gap-4">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <section
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
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#B9FF00]/10
                        text-[#B9FF00]
                    "
                >
                    <Webhook className="h-4 w-4" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                        All Webhooks
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
                        {webhook?.count._count.id} Records
                    </h3>
                </div>
            </div>
        </section>

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
            <div className="mb-4 flex items-center gap-2">
                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#B9FF00]/10
                        text-[#B9FF00]
                    "
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-zinc-300">
                        Webhook Filters
                    </h4>

                    <p
                        className="
                            mt-0.5
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            text-zinc-600
                        "
                    >
                        Filter webhook events
                    </p>
                </div>
            </div>

            <div
                className="
                    grid
                    gap-3
                    lg:grid-cols-[180px_1fr]
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

                                <SelectItem value="EXPRIRED">
                                    Expired
                                </SelectItem>

                                <SelectItem value="FAILED">
                                    Failed
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* SEARCH */}
                <div className="hidden w-full flex-col lg:flex">
                    <div className="mb-1.5 flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 text-[#B9FF00]" />

                        <h3
                            className="
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.13em]
                                text-zinc-600
                            "
                        >
                            Search
                        </h3>
                    </div>

                    <SearchComponent
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
                        placeholder={"Search title, artist...."}
                    />
                </div>
            </div>

            {/* MOBILE SEARCH */}
            <div className="mt-3 flex w-full flex-col lg:hidden">
                <div className="mb-1.5 flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-[#B9FF00]" />

                    <h3
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.13em]
                            text-zinc-600
                        "
                    >
                        Search
                    </h3>
                </div>

                <SearchComponent
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
                    placeholder={"Search title, artist...."}
                />
            </div>
        </section>

        {/* =====================================================
            WEBHOOK LIST
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
            {/* HEADER */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-white/[0.06]
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                        Webhook Events
                    </h4>

                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            uppercase
                            tracking-[0.14em]
                            text-zinc-600
                        "
                    >
                        Payment and system callback records
                    </p>
                </div>

                {!isLoading &&
                    Number(webhook?.count._count.id) > 0 && (
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
                            {webhook?.count._count.id}
                        </span>
                    )
                }
            </div>

            <div className="flex w-full flex-col gap-2 p-2 sm:p-3">

                {/* LOADING */}
                {isLoading&&
                    itemSkeleton.map((as,index)=>(
                        <AdminwebhookSkeletonComponents key={index}/>
                    ))
                }

                {/* EMPTY */}
                {webhook?.webhook?.length === 0&&
                    <div
                        className="
                            flex
                            min-h-[200px]
                            w-full
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-dashed
                            border-white/[0.07]
                            bg-white/[0.015]
                            p-6
                            text-center
                        "
                    >
                        <div>
                            <Webhook className="mx-auto h-6 w-6 text-zinc-700" />

                            <h3
                                className="
                                    mt-3
                                    text-xs
                                    font-medium
                                    text-zinc-500
                                "
                            >
                                No webhook records found
                            </h3>

                            <p className="mt-1 text-[10px] text-zinc-700">
                                Try another status or search.
                            </p>
                        </div>
                    </div>
                }

                {/* WEBHOOKS */}
                {webhook?.webhook?.map((as,index)=>(
                    <div
                        key={index}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.05]
                            bg-white/[0.015]
                            transition-all
                            duration-200
                            hover:border-[#B9FF00]/15
                            hover:bg-white/[0.025]
                        "
                    >
                        <span
                            className="
                                absolute
                                left-0
                                top-1/2
                                z-10
                                h-7
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

                        <AdminwebhookItem {...as}/>
                    </div>
                ))}
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}
            <div
                className="
                    border-t
                    border-white/[0.06]
                    bg-[#111518]/10
                    p-3
                "
            >
                <PaginationNewComponents
                    totalItems={Number(webhook?.count._count.id) ?? 0}
                />
            </div>
        </section>
    </div>
  )
}


export default AdminWebhookData