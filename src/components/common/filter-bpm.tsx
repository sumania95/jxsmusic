import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Slider } from "@/components/ui/slider-bpm"
import {
  parseAsArrayOf,
  parseAsInteger,
  useQueryState,
} from "nuqs"

export const bpmSchema = Yup.object().shape({
  bpm_start: Yup.number(),
  bpm_end: Yup.number(),
})

const DataBPMComponent = () => {
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  )

  const [bpm, setBpm] = useQueryState(
    "bpm",
    parseAsArrayOf(parseAsInteger).withDefault([0, 200])
  )

  const [open, setOpen] = useState(false)

  const {
    values,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      bpm: [bpm[0] ?? 0, bpm[1] ?? 200],
    },

    validationSchema: bpmSchema,

    onSubmit: async (values) => {
      void setBpm(values.bpm)
      void setPage(1)
    },
  })

  const resetBpm = () => {
    void setBpm([0, 200])
    void setPage(1)
    setOpen(false)
  }

  const isFiltered =
    Number(bpm[0]) > 0 || Number(bpm[1]) < 200

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* =====================================================
          TRIGGER
      ===================================================== */}
      <PopoverTrigger
        id="bpm"
        aria-label="bpm"
        className="
          group
          flex
          h-10
          w-full
          items-center
          justify-between
          gap-3
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
          px-3
          text-xs
          font-medium
          uppercase
          tracking-wider
          text-zinc-400
          outline-none
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.06]
          hover:text-white
          data-[state=open]:border-[#B9FF00]/40
          data-[state=open]:bg-[#B9FF00]/[0.05]
          data-[state=open]:text-[#B9FF00]
        "
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal
            className="
              h-3.5
              w-3.5
              text-zinc-500
              transition-colors
              group-hover:text-[#B9FF00]
              group-data-[state=open]:text-[#B9FF00]
            "
          />

          <span>BPM</span>

          {isFiltered && (
            <span
              className="
                rounded-full
                bg-[#B9FF00]
                px-1.5
                py-0.5
                text-[8px]
                font-bold
                text-black
              "
            >
              ACTIVE
            </span>
          )}
        </span>

        <ChevronDown
          className="
            h-3.5
            w-3.5
            text-zinc-500
            transition-transform
            duration-200
            group-data-[state=open]:rotate-180
            group-data-[state=open]:text-[#B9FF00]
          "
        />
      </PopoverTrigger>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <PopoverContent
        align="start"
        className="
          w-72
          border
          border-white/10
          bg-[#0b0b0b]
          p-0
          text-zinc-200
          shadow-2xl
          shadow-black/50
          md:w-96
        "
      >
        {/* HEADER */}
        <div
          className="
            border-b
            border-white/10
            px-4
            py-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-white
                "
              >
                BPM Filter
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-zinc-500
                "
              >
                Adjust in increments of 10 BPM
              </p>
            </div>

            <div
              className="
                rounded-md
                border
                border-[#B9FF00]/20
                bg-[#B9FF00]/[0.06]
                px-2
                py-1
                text-[10px]
                font-semibold
                text-[#B9FF00]
              "
            >
              {values.bpm[0]} — {values.bpm[1]}
            </div>
          </div>
        </div>

        {/* SLIDER */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-4">
            {/* MIN */}
            <div
              className="
                flex
                h-10
                w-12
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                text-xs
                font-semibold
                text-white
              "
            >
              {values.bpm[0]}
            </div>

            {/* SLIDER */}
            <div className="flex-1">
              <Slider
                defaultValue={values.bpm}
                max={200}
                step={10}
                minStepsBetweenThumbs={0}
                onValueChange={async (e) => {
                  if (
                    Number(
                      Number(e[1]) - Number(e[0]) < 0
                    )
                  )
                    return

                  await setFieldValue("bpm", e)
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* MAX */}
            <div
              className="
                flex
                h-10
                w-12
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                text-xs
                font-semibold
                text-white
              "
            >
              {values.bpm[1]}
            </div>
          </div>

          {/* RANGE */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              text-[9px]
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            <span>0 BPM</span>
            <span>200 BPM</span>
          </div>
        </div>

        {/* ACTIONS */}
        <form
          onSubmit={handleSubmit}
          className="
            border-t
            border-white/10
            p-3
          "
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetBpm}
              className="
                flex-1
                rounded-lg
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-2.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-zinc-400
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              Reset
            </button>

            <button
              type="submit"
              className="
                flex-1
                rounded-lg
                bg-[#B9FF00]
                px-4
                py-2.5
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-black
                shadow-lg
                shadow-[#B9FF00]/10
                transition-all
                duration-200
                hover:bg-[#B9FF00]
                hover:shadow-[#B9FF00]/20
              "
            >
              Apply Filter
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default DataBPMComponent