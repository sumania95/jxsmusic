"use client"

import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useAtom } from "jotai"
import { defaultPageLimit } from "@/state/globalState"

type Props = {
  totalItems: number
}

const PaginationNewComponents = ({ totalItems }: Props) => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [defaultLimit] = useAtom(defaultPageLimit)

  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit)
  )

  const totalPages = totalItems
    ? Math.ceil(totalItems / limit)
    : 1

  const [inputPage, setInputPage] = useState(
    page.toString()
  )

  useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  const handleLimitChange = (newLimit: number) => {
    void setLimit(newLimit)
    void setPage(1)
  }

  const handlePrev = () => {
    if (page > 1) {
      void setPage(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      void setPage(page + 1)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPage(e.target.value)
  }

  const handleInputCommit = () => {
    const val = Number(inputPage)

    if (
      !isNaN(val) &&
      val >= 1 &&
      val <= totalPages
    ) {
      void setPage(val)
    } else {
      setInputPage(page.toString())
    }
  }

  const handleInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleInputCommit()
    }
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-4
        rounded-2xl
        border
        border-white/10
        bg-white/[0.02]
        p-3
        sm:p-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      {/* =====================================================
          RESULTS PER PAGE
      ===================================================== */}
      <div className="flex items-center justify-center gap-2 md:justify-start">
        <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          Per page
        </span>

        <div className="flex items-center rounded-xl border border-white/10 bg-[#111518]/30 p-1">
          {[20, 50, 100].map((item) => {
            const active = limit === item

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleLimitChange(item)}
                className={`
                  min-w-9
                  rounded-lg
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? `
                        bg-[#B9FF00]
                        text-black
                        shadow-[0_0_15px_rgba(185,255,0,0.08)]
                      `
                      : `
                        text-zinc-600
                        hover:bg-white/[0.05]
                        hover:text-zinc-300
                      `
                  }
                `}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}
      <div className="flex items-center justify-center gap-2 md:justify-end">
        {/* Previous */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={page === 1}
          className="
            h-9
            w-9
            rounded-xl
            border
            border-white/10
            bg-white/[0.02]
            text-zinc-500
            transition-all
            hover:border-white/20
            hover:bg-white/[0.06]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-25
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Page input */}
        <div
          className="
            flex
            h-9
            items-center
            rounded-xl
            border
            border-white/10
            bg-[#111518]/30
            px-1
          "
        >
          <input
            type="text"
            inputMode="numeric"
            aria-label="Current page"
            value={inputPage}
            onChange={handleInputChange}
            onBlur={handleInputCommit}
            onKeyDown={handleInputKeyPress}
            className="
              h-7
              w-10
              rounded-lg
              border-0
              bg-transparent
              text-center
              text-xs
              font-medium
              text-white
              outline-none
              ring-0
              placeholder:text-zinc-700
              focus:bg-white/[0.05]
            "
          />
        </div>

        {/* Total */}
        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
          of
        </span>

        <span className="min-w-8 text-center text-xs font-medium text-zinc-400">
          {totalPages}
        </span>

        {/* Next */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={page === totalPages}
          className="
            h-9
            w-9
            rounded-xl
            border
            border-white/10
            bg-white/[0.02]
            text-zinc-500
            transition-all
            hover:border-white/20
            hover:bg-white/[0.06]
            hover:text-white
            disabled:pointer-events-none
            disabled:opacity-25
          "
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default PaginationNewComponents