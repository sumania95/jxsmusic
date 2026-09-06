import React from 'react'
import { api } from '@/utils/api';
import SearchComponent from '@/components/common/search';
import { defaultPageLimit } from '@/state/globalState';
import { parseAsInteger, parseAsStringEnum, useQueryState } from 'nuqs';
import { useAtom } from 'jotai';
import PaginationNewComponents from '@/components/common/pagination-new';
import AdminUserSkeletonComponents from './data-item-track-skeleton';
import AdminUserItem from './data-item';
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
    UsersRound
} from 'lucide-react';



const AdminUserData = () => {
    const customers = api.credits.customers.useQuery();
    const [amounts, setAmounts] = React.useState<Record<string, number>>({});
    const adjust = api.credits.adjust.useMutation({ onSuccess: () => void customers.refetch() });
    const itemSkeleton: number[] = Array.from({ length: 25 }, (_, index) => index + 1);

    const filterParser = parseAsStringEnum([
        'all',
        'is_uploader'
    ])

    const sortParser = parseAsStringEnum([
        'all',
        'username_asc',
        'username_desc',
        'createdAt_asc',
        'createdAt_desc'
    ])

    const [filter, setFilter] = useQueryState(
        'filter',
        filterParser.withDefault('all')
    )

    const [sort, setSort] = useQueryState(
        'sort',
        sortParser.withDefault('all')
    )

    const [defaultLimit] = useAtom(defaultPageLimit)

    const [pager,setPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )

    const [search] = useQueryState("search", {
        defaultValue: ""
    })

    const [limit] = useQueryState(
        "limit",
        parseAsInteger.withDefault(defaultLimit)
    )

    const {data:user,isLoading} = api.user.getAll.useQuery({
        search:search,
        filter:filter,
        sort:sort,
        skip: Number(Number(pager) * limit - limit),
        take: limit,
    })


    const handleFilterChange = (value: string) => {
        if (value === 'all' || value === 'is_uploader') {
            void setFilter(value)
            void setPage(1)
        }
    }

    const handleSortChange = (value: string) => {
        if (
            value === 'all' ||
            value === 'username_asc' ||
            value === 'username_desc' ||
            value === 'createdAt_asc' ||
            value === 'createdAt_desc'
        ) {
            void setSort(value)
            void setPage(1)
        }
    }

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
                    <UsersRound className="h-4 w-4" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                        All Users
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
                        {user?.total} Records
                    </h3>
                </div>
            </div>
        </section>

        <section className="w-full rounded-2xl border border-white/10 bg-white/[.02] p-5"><h3 className="text-sm font-semibold text-white">Customer credit balances</h3><p className="mt-1 text-xs text-zinc-600">Add or subtract non-expiring download credits.</p><div className="mt-4 grid gap-2 lg:grid-cols-2">{customers.data?.map(customer => <div key={customer.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl border border-white/[.06] bg-[#111518]/50 p-3"><span className="min-w-0 truncate text-xs text-zinc-300">{customer.name ?? customer.email} · <b className="text-[#B9FF00]">{customer.credit}</b></span><input type="number" value={amounts[customer.id] ?? 0} onChange={event => setAmounts(current => ({ ...current, [customer.id]: Number(event.target.value) }))} className="w-20 rounded-lg border border-white/10 bg-[#111518] px-2 py-2 text-xs"/><button onClick={() => adjust.mutate({ userId: customer.id, delta: amounts[customer.id] ?? 0 })} className="rounded-lg bg-[#B9FF00] px-3 py-2 text-xs font-bold text-black">Adjust</button></div>)}</div></section>

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
                        User Filters
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
                        Filter and sort registered users
                    </p>
                </div>
            </div>

            <div
                className="
                    grid
                    gap-3
                    md:grid-cols-[180px_180px_1fr]
                "
            >
                {/* FILTER */}
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
                        Filter
                    </h3>

                    <Select
                        value={filter}
                        onValueChange={handleFilterChange}
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
                            <SelectValue placeholder="SELECT FILTER" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    Filter by
                                </SelectLabel>

                                <SelectItem value="all">
                                    All
                                </SelectItem>

                                <SelectItem value="is_uploader">
                                    Editors
                                </SelectItem>
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
                        onValueChange={handleSortChange}
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
                                    Sort By
                                </SelectLabel>

                                <SelectItem value="all">
                                    All
                                </SelectItem>

                                <SelectItem value="username_asc">
                                    Username (A–Z)
                                </SelectItem>

                                <SelectItem value="username_desc">
                                    Username (Z–A)
                                </SelectItem>

                                <SelectItem value="createdAt_desc">
                                    Newest Users
                                </SelectItem>

                                <SelectItem value="createdAt_asc">
                                    Oldest Users
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

            {/* MOBILE / TABLET SEARCH */}
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
            USER LIST
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
            {/* LIST HEADER */}
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
                        User Directory
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
                        Manage Jeff92 & Ayan Sumania users and editors
                    </p>
                </div>

                {!isLoading &&
                    Number(user?.total) > 0 && (
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
                            {user?.total}
                        </span>
                    )
                }
            </div>

            <div className="flex w-full flex-col gap-2 p-2 sm:p-3">

                {/* LOADING */}
                {isLoading&&
                    itemSkeleton.map((as,index)=>(
                        <AdminUserSkeletonComponents key={index}/>
                    ))
                }

                {/* EMPTY */}
                {user?.users?.length === 0&&
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
                            <UsersRound className="mx-auto h-6 w-6 text-zinc-700" />

                            <h3
                                className="
                                    mt-3
                                    text-xs
                                    font-medium
                                    text-zinc-500
                                "
                            >
                                No users found
                            </h3>

                            <p className="mt-1 text-[10px] text-zinc-700">
                                Try another filter, sort option, or search.
                            </p>
                        </div>
                    </div>
                }

                {/* USERS */}
                {user?.users?.map((as,index)=>(
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

                        <AdminUserItem {...as}/>
                    </div>
                ))}
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
                <PaginationNewComponents
                    totalItems={Number(user?.total) ?? 0}
                />
            </div>
        </section>
    </div>
  )
}


export default AdminUserData
