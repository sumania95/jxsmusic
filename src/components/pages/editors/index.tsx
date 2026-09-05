import React from "react"
import { api } from "@/utils/api"
import EmptyComponent from "../common/empty"
import EditorItemComponent from "./data-item"
import LoadingSkeletonComponents from "../common/loading-skeleton"
import BannerTitleComponent from "@/components/common/banner-title"
import PaginationNewComponents from "@/components/common/pagination-new"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SearchComponent from "@/components/common/search"
import { parseAsInteger, useQueryState } from "nuqs"
import { ProfileMeta } from "@/components/common/metadata"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAtom } from "jotai"
import { defaultPageLimit } from "@/state/globalState"

const EditorsComponent = () => {
  const [pager] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [defaultLimit] = useAtom(defaultPageLimit)

  const [limit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const itemSkeleton: number[] = Array.from(
    { length: defaultLimit },
    (_, index) => index + 1
  )

  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "all",
  })

  const [search] = useQueryState("search", {
    defaultValue: "",
  })

  const {
    data: editor,
    isLoading,
  } = api.editor.getAll.useQuery({
    sort,
    search,
    skip: Number(Number(pager) * limit - limit),
    take: limit,
  })

  const totalItems = Number(editor?.count ?? 0)

  return (
    <div className="w-full">
      <ProfileMeta
        title="Remixer Artists"
        description="Collection of DJ Music"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      <section
        className="
          relative
          mb-6
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
        {/* Ambient glow */}
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
              Jeff92 & Ayan Sumania Community
            </span>
          </div>

          <BannerTitleComponent
            title="Remixer Editors"
            description="Discover the artists behind our exclusive edits & remixes"
          />
        </div>
      </section>

      {/* =====================================================
          BECOME EDITOR
      ===================================================== */}
      <div
        className="
          group
          relative
          mb-5
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-[#111518]/40
          transition-all
          duration-200
          hover:border-[#B9FF00]/15
        "
      >
        {/* Yellow ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-80px]
            top-[-100px]
            h-[220px]
            w-[220px]
            rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[70px]
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-4
            px-4
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-5
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.7)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-zinc-300
                "
              >
                Join Jeff92 & Ayan Sumania
              </span>
            </div>

            <p className="mt-1 text-[10px] text-zinc-600">
              Become a remixer editor and share your exclusive edits.
            </p>
          </div>

          <Link
            href="/become-editor"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#B9FF00]
              px-4
              py-2.5
              text-[10px]
              font-semibold
              uppercase
              tracking-widest
              text-black
              transition-all
              duration-200
              hover:bg-[#B9FF00]
              hover:shadow-[0_0_20px_rgba(185,255,0,0.12)]
            "
          >
            Become An Editor
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <div
        className="
          mb-6
          rounded-xl
          border
          border-white/10
          bg-[#111518]/40
          p-3
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-end
          "
        >
          {/* Sort */}
          <div className="w-full md:w-[190px]">
            <span
              className="
                mb-1.5
                block
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-600
              "
            >
              Sort
            </span>

            <Select
              value={sort}
              onValueChange={setSort}
            >
              <SelectTrigger
                className="
                  h-10
                  w-full
                  rounded-lg
                  border-white/10
                  bg-white/[0.025]
                  text-xs
                  text-zinc-400
                  outline-none
                  transition-colors
                  hover:border-white/15
                  focus:ring-0
                  focus:ring-offset-0
                "
              >
                <SelectValue placeholder="SELECT ORDERING" />
              </SelectTrigger>

              <SelectContent
                className="
                  border-white/10
                  bg-zinc-950
                  text-zinc-300
                "
              >
                <SelectGroup>
                  <SelectLabel
                    className="
                      text-[9px]
                      uppercase
                      tracking-widest
                      text-zinc-600
                    "
                  >
                    Sort
                  </SelectLabel>

                  <SelectItem value="all">
                    All
                  </SelectItem>

                  <SelectItem value="username_asc">
                    Name A–Z
                  </SelectItem>

                  <SelectItem value="username_desc">
                    Name Z–A
                  </SelectItem>

                  <SelectItem value="latest_release_desc">
                    Newest Upload
                  </SelectItem>

                  <SelectItem value="latest_release_asc">
                    Oldest Upload
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="min-w-0 flex-1">
            <span
              className="
                mb-1.5
                block
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-600
              "
            >
              Search
            </span>

            <SearchComponent
              className="
                flex
                h-10
                w-full
                items-center
                gap-2
                rounded-lg
                border
                border-white/10
                bg-white/[0.025]
                px-3
                text-xs
                text-zinc-400
                transition-all
                duration-200
                focus-within:border-[#B9FF00]/20
                focus-within:bg-white/[0.035]
              "
              placeholder="Search editors...."
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          EDITORS
      ===================================================== */}
      <div className="w-full">
        {/* Section header */}
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            border-b
            border-white/5
            pb-3
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.7)]
                "
              />

              <h2 className="text-sm font-semibold text-white">
                Editors
              </h2>
            </div>

            <p
              className="
                mt-1
                text-[10px]
                uppercase
                tracking-wider
                text-zinc-600
              "
            >
              Remixer artists
            </p>
          </div>

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-widest
              text-zinc-700
            "
          >
            {totalItems} Editors
          </span>
        </div>

        {/* Editor grid */}
        <div
          className="
            grid
            w-full
            grid-cols-2
            gap-3
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {/* Loading */}
          {isLoading &&
            itemSkeleton.map((item) => (
              <LoadingSkeletonComponents
                key={item}
                className="
                  h-56
                  w-full
                  rounded-xl
                  bg-white/[0.025]
                "
              />
            ))}

          {/* Empty */}
          {!isLoading && totalItems === 0 && (
            <div className="col-span-full">
              <EmptyComponent />
            </div>
          )}

          {/* Editors */}
          {!isLoading &&
            editor?.editor?.map((item, index) => (
              <EditorItemComponent
                {...item}
                key={index}
                index_key={index}
              />
            ))}
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div
            className="
              mt-6
              flex
              w-full
              justify-center
              border-t
              border-white/5
              pt-5
            "
          >
            <PaginationNewComponents
              totalItems={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorsComponent