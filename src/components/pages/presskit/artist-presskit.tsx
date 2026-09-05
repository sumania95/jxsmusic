import Link from "next/link";
import { ArrowUpRight, Calendar, Mail, MapPin, Music2 } from "lucide-react";

import { ProfileMeta } from "@/components/common/metadata";

type PressKitProps = {
  name: string;
  role: string;
  location: string;
  bio: string;
  styles: string[];
  links: Array<{ label: string; href: string }>;
};

export default function ArtistPressKit({ name, role, location, bio, styles, links }: PressKitProps) {
  return (
    <div className="min-h-screen bg-[#111518] px-4 pb-24 pt-32 text-[#F5F3EA] lg:px-10">
      <ProfileMeta title={`${name} press kit`} description={bio} type="profile" />
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B9FF00]">Official press kit</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="text-6xl font-bold leading-[0.9] tracking-tight sm:text-8xl">{name}</h1>
            <p className="mt-6 text-lg text-[#B9FF00]">{role}</p>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-400">{bio}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {styles.map((style) => <span key={style} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-zinc-300">{style}</span>)}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <dl className="space-y-5 text-sm">
              <div><dt className="flex items-center gap-2 text-xs text-zinc-500"><MapPin className="h-4 w-4 text-[#B9FF00]" />Based in</dt><dd className="mt-1 text-white">{location}</dd></div>
              <div><dt className="flex items-center gap-2 text-xs text-zinc-500"><Music2 className="h-4 w-4 text-[#B9FF00]" />Available for</dt><dd className="mt-1 text-white">Clubs, festivals, private events and remix work</dd></div>
              <div><dt className="flex items-center gap-2 text-xs text-zinc-500"><Calendar className="h-4 w-4 text-[#B9FF00]" />Bookings</dt><dd className="mt-1"><a className="text-white hover:text-[#B9FF00]" href="mailto:info.djjeff92@yahoo.com">info.djjeff92@yahoo.com</a></dd></div>
            </dl>
            <a href="mailto:info.djjeff92@yahoo.com" className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B9FF00] text-sm font-semibold text-black"><Mail className="h-4 w-4" />Booking inquiry</a>
          </aside>
        </div>

        <div className="mt-16 grid gap-4 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm text-zinc-300 transition hover:border-[#B9FF00]/30 hover:text-white">{link.label}<ArrowUpRight className="h-4 w-4 text-[#B9FF00] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>)}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/editors/jeff92-ayan-sumania" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white/15">Joint editor profile</Link>
          <Link href="/tracks" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:border-[#B9FF00]/30">Browse available edits</Link>
        </div>
      </section>
    </div>
  );
}
