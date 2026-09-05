import React from 'react'
import { api } from '@/utils/api';
import AdminTagItem from './data-item';
import TagUploaderSkeletonComponents from './data-item-track-skeleton';
import AdminNewFormTag from './helper/new-form';
import SearchComponent from '@/components/common/search';
import { defaultPageLimit } from '@/state/globalState';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useAtom } from 'jotai';
import PaginationNewComponents from '@/components/common/pagination-new';
import { Search, Tags } from 'lucide-react';


const AdminTagData = () => {
    const itemSkeleton: number[] = Array.from({ length: 25 }, (_, index) => index + 1);
    const [defaultLimit] = useAtom(defaultPageLimit)
    const [pager] = useQueryState("page", parseAsInteger.withDefault(1))
    const [search] = useQueryState("search", { defaultValue: "" })
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(defaultLimit))
    const {data:tag,isLoading} = api.tag.getAllMain.useQuery({
        search:search,
        skip: Number(Number(pager) * limit - limit),
        take: limit,
        sort:"asc"
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
                gap-4
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
                    <Tags className="h-4 w-4" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                        All Tags
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
                        {tag?.count._count.id} Records
                    </h3>
                </div>
            </div>

            <div className="w-full sm:w-auto">
                <AdminNewFormTag/>
            </div>
        </section>

        {/* =====================================================
            SEARCH
        ===================================================== */}
        <section
            className="
                w-full
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.015]
                p-3
                sm:p-4
            "
        >
            <div className="mb-2 flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#B9FF00]" />

                <span
                    className="
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.14em]
                        text-zinc-600
                    "
                >
                    Search Tags
                </span>
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
                placeholder={"Search tags...."}
            />
        </section>

        {/* =====================================================
            TAG LIST
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
                        Tag Library
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
                        Manage available track tags
                    </p>
                </div>

                {!isLoading &&
                    Number(tag?.count._count.id) > 0 && (
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
                            {tag?.count._count.id}
                        </span>
                    )
                }
            </div>

            <div className="flex w-full flex-col gap-2 p-2 sm:p-3">

                {/* =================================================
                    LOADING
                ================================================= */}
                {isLoading&&
                    itemSkeleton.map((as,index)=>(
                        <TagUploaderSkeletonComponents key={index}/>
                    ))
                }

                {/* =================================================
                    EMPTY
                ================================================= */}
                {tag?.tags?.length === 0&&
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
                            <Tags className="mx-auto h-6 w-6 text-zinc-700" />

                            <h3
                                className="
                                    mt-3
                                    text-xs
                                    font-medium
                                    text-zinc-500
                                "
                            >
                                No tags found
                            </h3>

                            <p className="mt-1 text-[10px] text-zinc-700">
                                Try another search or create a new tag.
                            </p>
                        </div>
                    </div>
                }

                {/* =================================================
                    TAGS
                ================================================= */}
                {tag?.tags?.map((as,index)=>(
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
                        {/* HOVER INDICATOR */}
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

                        <AdminTagItem {...as}/>
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
                    totalItems={Number(tag?.count._count.id) ?? 0}
                />
            </div>
        </section>
    </div>
  )
}


export default AdminTagData