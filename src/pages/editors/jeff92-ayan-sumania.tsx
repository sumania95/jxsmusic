import Link from "next/link";
import { ArrowRight, AudioLines, Disc3, Video } from "lucide-react";

import MainLayout from "@/components/layout/main-layout";
import { ProfileMeta } from "@/components/common/metadata";

export default function JointEditorProfile() {
  return <MainLayout><div className="min-h-screen bg-[#111518] px-4 pb-24 pt-32 text-[#F5F3EA] lg:px-10">
    <ProfileMeta title="Jeff92 & Ayan Sumania — Editor profile" description="DJ-ready audio and video remixes, edits, mashups and club versions from Jeff92 and Ayan Sumania." type="profile" />
    <section className="mx-auto max-w-7xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B9FF00]">Official editor profile</p>
      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
        <div><h1 className="max-w-5xl text-5xl font-bold leading-[0.92] tracking-tight sm:text-8xl">Jeff92 <span className="text-[#B9FF00]">&</span><br />Ayan Sumania</h1><p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-400">A DJ editor duo creating performance-ready audio and video remixes, extended edits, mashups, club versions and genre-blending dancefloor tools for open-format DJs.</p></div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{[{ icon: AudioLines, label: "Audio edits" }, { icon: Video, label: "Video edits" }, { icon: Disc3, label: "Curated packs" }].map((item) => <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"><item.icon className="h-5 w-5 text-[#B9FF00]" /><span className="text-sm">{item.label}</span></div>)}</div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/tracks?search=Jeff92%20Ayan%20Sumania" className="inline-flex items-center gap-2 rounded-xl bg-[#B9FF00] px-6 py-3 text-sm font-semibold text-black">Browse all edits <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/multi-packs" className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium hover:border-[#B9FF00]/30">View packs</Link>
        <Link href="/credits" className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium hover:border-[#B9FF00]/30">180 credits · $200</Link>
      </div>

      <section className="mt-20 border-t border-white/10 pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9FF00]">Individual press kits</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[{ name: "DJ Jeff92", role: "Open Format DJ · Remix Editor", href: "/presskit/jeff92" }, { name: "Ayan Sumania", role: "DJ · Audio & Video Remix Editor", href: "/presskit/ayan-sumania" }].map((artist) => <Link href={artist.href} key={artist.href} className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition hover:border-[#B9FF00]/30"><p className="text-xs uppercase tracking-wider text-zinc-500">{artist.role}</p><h2 className="mt-8 text-3xl font-bold">{artist.name}</h2><span className="mt-4 inline-flex items-center gap-2 text-sm text-[#B9FF00]">Open press kit <ArrowRight className="h-4 w-4" /></span></Link>)}
        </div>
      </section>
    </section>
  </div></MainLayout>;
}
