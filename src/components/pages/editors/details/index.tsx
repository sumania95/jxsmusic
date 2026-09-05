import { ProfileMeta } from "@/components/common/metadata"
import React from "react"
import ImageThumbnailComponent from "@/components/common/image-thumbnail"
import { Changa_One } from "next/font/google"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useQueryState } from "nuqs"
import EditorTracksComponent from "./tracks"
import BioInfoComponent from "./bio"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EditorMultiPackComponent from "./multi-packs"

const font = Changa_One({
  subsets: ["latin"],
  weight: "400",
})

interface Props {
  editor: {
    id: string
    image: string | null
    username: string | null
    is_video_uploader: boolean
    link_facebook: string | null
    link_instagram: string | null
    link_mixclound: string | null
    link_soundcloud: string | null
    link_spotify: string | null
    link_twitch: string | null
    link_twitter: string | null
    link_youtube: string | null
    biography: string | null
    _count: {
      track: number
    }
  }
}

const EditorDetailsComponent = ({ editor }: Props) => {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "tracks",
  })

  if (!editor) {
    return (
      <div className="w-full">
        <ProfileMeta
          title={undefined}
          description={undefined}
          image={undefined}
        />

        <div
          className="
            flex
            min-h-[300px]
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-white/5
            bg-white/[0.015]
          "
        >
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-widest
              text-zinc-600
            "
          >
            Editor Not Found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ProfileMeta
        title={editor.username ?? ""}
        description={editor.biography ?? ""}
        image={editor.image ?? ""}
      />

      {/* =====================================================
          BACK
      ===================================================== */}
      <Link
  href="/editors"
  className="
    mb-4
    inline-flex
    items-center
    gap-2
    rounded-xl
    border
    border-white/[0.07]
    bg-white/[0.02]
    px-3
    py-2
    text-[10px]
    font-medium
    uppercase
    tracking-[0.12em]
    text-zinc-500
    transition-all
    duration-200
    hover:border-[#B9FF00]/20
    hover:bg-[#B9FF00]/[0.04]
    hover:text-[#B9FF00]
  "
>
  <ArrowLeft className="h-3.5 w-3.5" />
  Back To Editors
</Link>

      {/* =====================================================
          PROFILE HEADER
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
          p-5
          sm:p-7
          lg:p-8
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-140px]
            top-[-180px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[110px]
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-center
          "
        >
          {/* Avatar */}
          <div
            className="
              relative
              h-32
              w-32
              shrink-0
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-zinc-950
              sm:h-40
              sm:w-40
            "
          >
            <ImageThumbnailComponent
              image={editor.image ?? ""}
              rounded={false}
            />

            {/* Image overlay */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/40
                to-transparent
              "
            />
          </div>

          {/* Profile information */}
          <div className="min-w-0 flex-1">
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
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Editor
              </span>
            </div>

            <h1
              className={cn(
                font.className,
                "truncate text-3xl text-white sm:text-4xl lg:text-5xl"
              )}
            >
              {editor.username}
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-relaxed
                text-zinc-600
              "
            >
              Remixer artist creating exclusive edits & remixes.
            </p>

            {/* Stats */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <div
                className="
                  rounded-lg
                  border
                  border-white/10
                  bg-[#111518]/40
                  px-3
                  py-2
                "
              >
                <span
                  className="
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-widest
                    text-zinc-700
                  "
                >
                  Tracks
                </span>

                <span className="mt-0.5 block text-sm font-semibold text-zinc-300">
                  {editor._count.track}
                </span>
              </div>

              {editor.is_video_uploader && (
                <div
                  className="
                    rounded-lg
                    border
                    border-[#B9FF00]/10
                    bg-[#B9FF00]/[0.035]
                    px-3
                    py-2
                  "
                >
                  <span
                    className="
                      block
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-widest
                      text-[#B9FF00]/60
                    "
                  >
                    Video
                  </span>

                  <span className="mt-0.5 block text-sm font-semibold text-[#B9FF00]">
                    Uploader
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TABS
      ===================================================== */}
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="w-full"
      >
        <div
          className="
            mb-5
            overflow-x-auto
            rounded-xl
            border
            border-white/10
            bg-[#111518]/40
            p-1
          "
        >
          <TabsList
            className="
              flex
              h-10
              w-full
              min-w-max
              justify-start
              gap-1
              bg-transparent
              md:w-auto
            "
          >
            <TabsTrigger
              value="tracks"
              className="
                h-8
                min-w-[110px]
                rounded-lg
                px-4
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-600
                transition-all
                duration-200
                data-[state=active]:bg-[#B9FF00]
                data-[state=active]:text-black
                data-[state=active]:shadow-none
              "
            >
              Tracks
            </TabsTrigger>

            <TabsTrigger
              value="packs"
              className="
                h-8
                min-w-[110px]
                rounded-lg
                px-4
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-600
                transition-all
                duration-200
                data-[state=active]:bg-[#B9FF00]
                data-[state=active]:text-black
                data-[state=active]:shadow-none
              "
            >
              Multi Packs
            </TabsTrigger>

            <TabsTrigger
              value="info"
              className="
                h-8
                min-w-[110px]
                rounded-lg
                px-4
                text-[9px]
                font-medium
                uppercase
                tracking-widest
                text-zinc-600
                transition-all
                duration-200
                data-[state=active]:bg-[#B9FF00]
                data-[state=active]:text-black
                data-[state=active]:shadow-none
              "
            >
              More Info
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ===================================================
            TRACKS
        =================================================== */}
        <TabsContent
          value="tracks"
          className="mt-0"
        >
          <div
            className="
              mb-4
              flex
              items-end
              justify-between
              gap-3
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

                <h2
                  className={cn(
                    font.className,
                    "text-xl text-white sm:text-2xl"
                  )}
                >
                  {editor.username}&apos;s Tracks
                </h2>
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-widest
                  text-zinc-700
                "
              >
                Exclusive edits & remixes
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
              {editor._count.track} Tracks
            </span>
          </div>

          <EditorTracksComponent editor={editor} />
        </TabsContent>

        {/* ===================================================
            MULTI PACKS
        =================================================== */}
        <TabsContent
          value="packs"
          className="mt-0"
        >
          <div
            className="
              mb-4
              border-b
              border-white/5
              pb-3
            "
          >
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

              <h2
                className={cn(
                  font.className,
                  "text-xl text-white sm:text-2xl"
                )}
              >
                {editor.username}&apos;s Multi Packs
              </h2>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-widest
                text-zinc-700
              "
            >
              Exclusive collections
            </p>
          </div>

          <EditorMultiPackComponent id={editor.id} />
        </TabsContent>

        {/* ===================================================
            INFORMATION
        =================================================== */}
        <TabsContent
          value="info"
          className="mt-0"
        >
          <div
            className="
              mb-4
              border-b
              border-white/5
              pb-3
            "
          >
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

              <h2
                className={cn(
                  font.className,
                  "text-xl text-white sm:text-2xl"
                )}
              >
                {editor.username}&apos;s Information
              </h2>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-widest
                text-zinc-700
              "
            >
              About the artist
            </p>
          </div>

          <BioInfoComponent editor={editor} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EditorDetailsComponent