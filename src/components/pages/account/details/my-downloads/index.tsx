"use client"
import { Album, Music2 } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { PaidTracks } from "./paid-tracks"
import { AlbumTracks } from "./album-tracks"

const MyDownloadsComponents = () => {
  const [downloadType, setDownloadType] = useQueryState("downloadType", parseAsString.withDefault("tracks"))
  const activeTab: "tracks" | "albums" = downloadType === "albums" ? "albums" : "tracks"
  const [,setPager] = useQueryState("page", parseAsInteger.withDefault(1))
  const changeTab = async (nextTab: "tracks" | "albums") => { await Promise.all([setDownloadType(nextTab), setPager(1)]) }
  return (
    <div className="flex w-full flex-col items-start gap-5">
      <div className="w-full"><h3 className="text-lg font-semibold text-white">Purchases</h3><p className="mt-1 text-sm text-white/50">Download your purchased tracks, albums, and multi-packs.</p></div>
      
      <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/2.5">
        <div role="tablist" aria-label="Download types" className="flex gap-1 border-b border-white/[0.06] p-2">
          <button type="button" role="tab" aria-selected={activeTab === "tracks"} onClick={() => changeTab("tracks")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${activeTab === "tracks" ? "bg-green-500/10 text-green-400" : "text-zinc-600 hover:bg-white/[0.025] hover:text-zinc-300"}`}><Music2 className="h-4 w-4" />Tracks</button>
          <button type="button" role="tab" aria-selected={activeTab === "albums"} onClick={() => changeTab("albums")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${activeTab === "albums" ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-600 hover:bg-white/[0.025] hover:text-zinc-300"}`}><Album className="h-4 w-4" />Albums / Multi-packs</button>
        </div>
        <div role="tabpanel" className="p-3">
          {activeTab === "tracks" && <PaidTracks/>}
          {activeTab === "albums" && <AlbumTracks/>}
        </div>
      </section>
    </div>
  )
}

export default MyDownloadsComponents
