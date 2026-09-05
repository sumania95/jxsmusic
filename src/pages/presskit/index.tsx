import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { ProfileMeta } from "@/components/common/metadata";

export default function PressKitIndex() {
  return <MainLayout><div className="min-h-screen bg-[#111518] px-4 pb-24 pt-32 text-[#F5F3EA] lg:px-10">
    <ProfileMeta title="Press kits — Jeff92 & Ayan Sumania" description="Separate official press kits for DJ Jeff92 and Ayan Sumania." />
    <section className="mx-auto max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B9FF00]">Artists</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">Two artists.<br />One editor team.</h1>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {[{ name: "DJ Jeff92", role: "Open Format DJ · Remix Editor", href: "/presskit/jeff92" }, { name: "Ayan Sumania", role: "DJ · Audio & Video Remix Editor", href: "/presskit/ayan-sumania" }].map((artist) => <Link key={artist.href} href={artist.href} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition hover:border-[#B9FF00]/30"><p className="text-xs uppercase tracking-[0.2em] text-[#B9FF00]">{artist.role}</p><h2 className="mt-12 text-4xl font-bold">{artist.name}</h2><span className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400 group-hover:text-white">Open press kit <ArrowRight className="h-4 w-4" /></span></Link>)}
      </div>
    </section>
  </div></MainLayout>;
}
