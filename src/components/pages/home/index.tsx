import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AudioLines, BadgeCheck, Gauge } from "lucide-react";
import { Changa_One } from "next/font/google";

import { ProfileMeta } from "@/components/common/metadata";
import { cn } from "@/lib/utils";

import SoftwareCarousel from "./helper/software-carousel";
import StepsGrid from "./helper/step-grid";
import HomeReviews from "./reviews";
import Affiliations from "./affiliations";

const font = Changa_One({
  subsets: ["latin"],
  weight: "400",
});

const HomeComponent = () => {
  return (
    <>
      <ProfileMeta
        title="Jeff92 & Ayan Sumania — Audio & Video DJ Edits"
        description="Official audio edits, video edits, remix packs and DJ press kits from Jeff92 and Ayan Sumania."
      />
      <main className="relative min-h-screen overflow-hidden bg-[#111518] text-zinc-100">
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-20 pt-28 lg:px-10 lg:pb-32 lg:pt-36">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-300px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#B9FF00]/6 blur-[120px]" />
            <div className="absolute bottom-[-300px] left-[-200px] h-[500px] w-[500px] rounded-full bg-white/2.5 blur-[120px]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_12px_rgba(185,255,0,0.8)]" />
                Official artist & editor website
              </div>

              <h1
                className={cn(
                  "text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl",
                  font.className,
                )}
              >
                Audio & video edits.
                <br />
                <span className="text-[#B9FF00]">Built for the room.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base lg:mx-0">
                Explore official Jeff92 and Ayan Sumania remixes, mashups,
                extended versions and performance-ready packs for working DJs.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/tracks"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B9FF00] px-6 py-3.5 text-sm font-semibold text-black transition hover:shadow-[0_0_30px_rgba(185,255,0,0.18)]"
                >
                  Browse our edits
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/credits"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/4 px-6 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/8"
                >
                  Buy 180 credits · $200
                </Link>
              </div>
            </div>

            <div className="relative mx-auto h-[520px] w-full max-w-[680px] sm:h-[620px]">
              <div className="absolute left-[2%] top-[8%] h-[78%] w-[57%] -rotate-3 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
                <Image
                  src="/images/jeff92-portrait.png"
                  alt="DJ Jeff92"
                  fill
                  priority
                  sizes="(max-width: 1024px) 55vw, 32vw"
                  className="object-cover object-center grayscale-[20%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent px-6 pb-6 pt-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B9FF00]">DJ Jeff92</p>
                </div>
              </div>

              <div className="absolute bottom-[3%] right-[1%] h-[70%] w-[55%] rotate-3 overflow-hidden rounded-[2rem] border border-[#B9FF00]/30 bg-black shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
                <Image
                  src="/images/ayan-sumania-portrait.jpg"
                  alt="Ayan Sumania"
                  fill
                  priority
                  sizes="(max-width: 1024px) 55vw, 31vw"
                  className="object-cover object-[center_20%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent px-6 pb-6 pt-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B9FF00]">Ayan Sumania</p>
                </div>
              </div>

              <div className="absolute right-[7%] top-[3%] rounded-full border border-[#B9FF00]/30 bg-[#111518]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9FF00] backdrop-blur-md">
                JXS Music
              </div>
            </div>
          </div>
        </section>

        <HomeReviews />
        <Affiliations />

        {/* FEATURES */}
        <section className="border-t border-white/10 py-20">
          <div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Set-ready metadata",
                  desc: "BPM, key, clean or dirty, edit structure and format are clear before you buy.",
                  icon: Gauge,
                },
                {
                  title: "Hear the useful part",
                  desc: "Fast previews help you judge the intro, transition, drop and outro without digging.",
                  icon: AudioLines,
                },
                {
                  title: "Verified Editors",
                  desc: "Quality-controlled uploads from professional editors, with attribution that follows every release.",
                  icon: BadgeCheck,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/3 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B9FF00]/20 hover:bg-white/5"
                >
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9FF00]/10 text-[#B9FF00]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-[#B9FF00] uppercase">
                Signal over noise
              </p>
              <h2
                className={cn(
                  "mt-4 text-4xl leading-none text-[#F5F3EA] md:text-5xl",
                  font.className,
                )}
              >
                Less digging.
                <br />
                More playing.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
                Jeff92 & Ayan Sumania is organized around the decisions DJs make in the
                booth—not around an endless folder of filenames.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Search by BPM, key and energy",
                "Clean, dirty and intro versions",
                "Curated crates for real events",
                "Editor credits and release history",
              ].map((label, index) => (
                <div
                  key={label}
                  className="flex min-h-28 items-end rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <span className="mr-4 text-xs font-semibold text-[#B9FF00]">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-medium text-[#F5F3EA]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* RELEASES / OTHER SECTIONS */}
        {/* <section className="border-t border-white/10 py-20">
          <div>
            <AlbumScrollRow />
          </div>
        </section> */}

        <section className="border-t border-white/10 py-20">
          <div>
            <h2
              className={cn(
                "mb-10 text-4xl tracking-tight text-white md:text-5xl",
                font.className,
              )}
            >
              How it Works
            </h2>

            <StepsGrid />
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div>
            <h2
              className={cn(
                "mb-10 text-4xl tracking-tight text-white md:text-5xl",
                font.className,
              )}
            >
              Compatible DJ Software
            </h2>

            <SoftwareCarousel />
          </div>
        </section>

        {/* <section className="border-t border-white/10 py-20">
          <div className="flex items-center justify-between px-4 lg:px-10">
            <h2
              className={cn(
                "text-4xl tracking-tight text-white md:text-5xl",
                font.className
              )}
            >
              New Releases
            </h2>

            <Link
              href="/tracks"
              className="text-xs uppercase tracking-wider text-zinc-500 transition hover:text-[#B9FF00]"
            >
              View all
            </Link>
          </div>

          <HomeNewReleasesComponent />
        </section> */}
      </main>
    </>
  );
};

export default HomeComponent;
