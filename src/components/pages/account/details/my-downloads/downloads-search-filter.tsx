import SearchComponent from "@/components/common/search"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import FilterFileTypeComponent from "@/components/common/filter-file"
import DataYearComponent from "@/components/common/filter-year"
import DataEnergyComponent from "@/components/common/filter-energy"
import DataKeyComponent from "@/components/common/filter-key"
import DataBPMComponent from "@/components/common/filter-bpm"
import DataTagComponent from "@/components/common/filter-tag"
import DataGenreComponent from "@/components/common/filter-genre"

export const DownloadsSearchFilter = () => {
  const [downloadType] = useQueryState("downloadType", parseAsString.withDefault("tracks"))
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("desc"))
  const [, setPager] = useQueryState("page", parseAsInteger.withDefault(1))
  const safeSort = sort === "asc" ? "asc" : "desc"
  const changeSort = async (value: string) => { await Promise.all([setSort(value), setPager(1)]) }

  return (
    <section className="mb-5 rounded-2xl border border-white/10 bg-white/2.5 p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        {/* Desktop / tablet filters */}
        {downloadType==="tracks" &&
        <div className="scrollbar-hide flex lg:justify-between w-full gap-2 overflow-x-auto pb-1">
          <div className="flex gap-2 items-center">
            <div className="shrink-0">
              <DataGenreComponent />
            </div>

            <div className="shrink-0">
              <DataTagComponent />
            </div>

            <div className="shrink-0">
              <DataBPMComponent />
            </div>

            <div className="shrink-0">
              <DataKeyComponent />
            </div>
            <div className="shrink-0">
              <DataEnergyComponent />
            </div>
            <div className="shrink-0">
              <DataYearComponent />
            </div>
            <div className="shrink-0 items-center rounded-xl border border-white/10 bg-[#111518]/40 px-2 lg:flex">
              <FilterFileTypeComponent />
            </div>

          </div>
        </div>
        }
        <div className="flex items-center gap-2 w-full">
          <SearchComponent
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#111518]/40 px-3 py-2 text-zinc-300 transition focus-within:border-[#B9FF00]/30 focus-within:bg-[#111518]/60"
            placeholder="Search title, artist..."
          />
          <Select value={safeSort} onValueChange={changeSort}>
            <SelectTrigger className="h-11 auto rounded-xl border-white/10 bg-[#111518]/40 text-xs text-zinc-300"><SelectValue placeholder="Sort downloads" /></SelectTrigger>
            <SelectContent><SelectGroup><SelectLabel>Sort</SelectLabel><SelectItem value="desc">Newest first</SelectItem><SelectItem value="asc">Oldest first</SelectItem></SelectGroup></SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}