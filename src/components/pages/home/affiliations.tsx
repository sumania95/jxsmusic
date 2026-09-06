import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function Affiliations() {
  return (

    <section className="border-t border-white/10 px-4 py-20">
      <div className="w-auto overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1113] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#B9FF00]">
              Affiliations
            </p>
            <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
              Crooklyn Clan editors
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400">
              Jeff92 and Ayan Sumania are members of the Crooklyn Clan Editor Community, providing high-quality audio and video edits to working DJs around the globe.
            </p>
            <Image src="/images/ccv5-logo-banner.png" alt="Crooklyn Clan" width={700} height={160} className="mt-7 h-auto w-full max-w-md" />
            <a href="https://app.crooklynclan.net/editors/jeff92-%26-ayan-sumania" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B9FF00] px-5 py-3 text-sm font-bold text-black">
              View Crooklyn Clan profile
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image src="/images/jeff92-portrait.png" alt="DJ Jeff92" fill className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl border border-[#B9FF00]/25">
              <Image src="/images/ayan-sumania-portrait.jpg" alt="Ayan Sumania" fill className="object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
