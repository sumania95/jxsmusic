import { cn } from '@/lib/utils';
import { Search } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react'
import { useDebouncedCallback } from 'use-debounce';

type Props = {
    className:string,
    placeholder:string
}

const SearchComponent = ({className,placeholder}:Props) => {
    const [search, setSearch] = useQueryState("search", {
        defaultValue: "",
    })
    const [,setPager] = useQueryState("page",
       parseAsInteger.withDefault(1),
    )
    const [,setSort] = useQueryState("sort", {
            defaultValue: "all",
        })
    const handleChange = useDebouncedCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            void setSearch(event.target.value)
            await setPager(1) // ✅ await the Nuqs setter
            await setSort("all") // ✅ await the Nuqs setter
        },
        500
    );
  return (
    <div className={cn('dark:bg-input/30 dark:hover:bg-input/50',className)}>
        <Search className='dark:text-zinc-200 w-4 h-4'/>
        <input type="search" defaultValue={search} onChange={handleChange} placeholder={placeholder} className='outline-none w-full'/>
    </div>
  )
}

export default SearchComponent