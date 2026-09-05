import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/router"
import { useQueryState } from "nuqs"

import { api } from "@/utils/api"
import { formatTrackTitle } from "@/lib/utils"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrackDetailInfoComponent from "./info"
import TrackDetailRelatedComponent from "./related-tracks"
import TrackDetailRelatedKeyComponent from "./related-tracks-key"


const TrackDetailComponent = () => {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "info",
  })

  const router = useRouter()
 
  const trackId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id
  const {
    data: getTrack,
    isLoading,
  } = api.track.getIdMain.useQuery(
    {
      id: String(trackId),
    },
    {
      enabled: !!trackId,
    }
  )

  const title = formatTrackTitle(
    getTrack?.title,
    getTrack?.is_explicit
  )

  return (
    <div className="w-full">
      {/* =====================================================
          BACK
      ===================================================== */}
      <Link
        href="/tracks"
        className="
          group
          mb-5
          inline-flex
          items-center
          gap-2
          text-[10px]
          font-medium
          uppercase
          tracking-wider
          text-zinc-600
          transition-colors
          hover:text-[#B9FF00]
        "
      >
        <ArrowLeft
          className="
            h-3.5
            w-3.5
            transition-transform
            duration-200
            group-hover:-translate-x-0.5
          "
        />

        Back To Tracks
      </Link>

      {/* =====================================================
          TRACK HEADER
      ===================================================== */}
      <section
        className="
          relative
          mb-6
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.02]
          px-5
          py-6
          sm:px-7
          sm:py-7
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-150px]
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <div className="relative">
          {/* Label */}
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
              Jeff92 & Ayan Sumania Library
            </span>
          </div>

          {/* Title */}
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-7 w-2/3 animate-pulse rounded bg-white/5 sm:h-9" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
            </div>
          ) : (
            <>
              <h1
                className="
                  max-w-4xl
                  text-xl
                  font-semibold
                  leading-tight
                  text-white
                  sm:text-2xl
                  lg:text-3xl
                "
              >
                {title ?? "Loading..."}
              </h1>

              <p
                className="
                  mt-2
                  text-xs
                  uppercase
                  tracking-wider
                  text-zinc-600
                "
              >
                {getTrack?.artist ?? "Loading..."}
              </p>
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="w-full">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full"
        >
          {/* =================================================
              TABS
          ================================================= */}
          <div
            className="
              mb-6
              w-full
              overflow-x-auto
              border-b
              border-white/10
            "
          >
            <TabsList
              className="
                flex
                h-11
                w-max
                min-w-full
                justify-start
                gap-1
                rounded-none
                bg-transparent
                p-0
                md:min-w-0
              "
            >
              <TabsTrigger
                value="info"
                className="
                  relative
                  h-11
                  rounded-none
                  border-0
                  bg-transparent
                  px-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-600
                  transition-all

                  data-[state=active]:bg-transparent
                  data-[state=active]:text-[#B9FF00]

                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:right-0
                  after:h-0.5
                  after:scale-x-0
                  after:bg-[#B9FF00]
                  after:opacity-0
                  after:transition-all

                  data-[state=active]:after:scale-x-100
                  data-[state=active]:after:opacity-100

                  hover:text-zinc-300
                "
              >
                Track Details
              </TabsTrigger>

              <TabsTrigger
                value="related"
                className="
                  relative
                  h-11
                  rounded-none
                  border-0
                  bg-transparent
                  px-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-600
                  transition-all

                  data-[state=active]:bg-transparent
                  data-[state=active]:text-[#B9FF00]

                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:right-0
                  after:h-0.5
                  after:scale-x-0
                  after:bg-[#B9FF00]
                  after:opacity-0
                  after:transition-all

                  data-[state=active]:after:scale-x-100
                  data-[state=active]:after:opacity-100

                  hover:text-zinc-300
                "
              >
                Track Related
              </TabsTrigger>

              <TabsTrigger
                value="related-key"
                className="
                  relative
                  h-11
                  rounded-none
                  border-0
                  bg-transparent
                  px-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-zinc-600
                  transition-all

                  data-[state=active]:bg-transparent
                  data-[state=active]:text-[#B9FF00]

                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:right-0
                  after:h-0.5
                  after:scale-x-0
                  after:bg-[#B9FF00]
                  after:opacity-0
                  after:transition-all

                  data-[state=active]:after:scale-x-100
                  data-[state=active]:after:opacity-100

                  hover:text-zinc-300
                "
              >
                Related Key
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =================================================
              TAB CONTENT
          ================================================= */}
          <TabsContent
            value="info"
            className="mt-0 focus-visible:outline-none"
          >
            <TrackDetailInfoComponent />
          </TabsContent>

          <TabsContent
            value="related"
            className="mt-0 focus-visible:outline-none"
          >
            <TrackDetailRelatedComponent />
          </TabsContent>

          <TabsContent
            value="related-key"
            className="mt-0 focus-visible:outline-none"
          >
            <TrackDetailRelatedKeyComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TrackDetailComponent