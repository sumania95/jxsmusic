import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Changa_One } from 'next/font/google'

import { ProfileMeta } from '@/components/common/metadata'
import { cn } from '@/lib/utils'

import SoftwareCarousel from './helper/software-carousel'
import StepsGrid from './helper/step-grid'
import HomeNewReleasesComponent from './helper/new-releases'
import AlbumScrollRow from './helper/album'

const font = Changa_One({
  subsets: ['latin'],
  weight: '400',
})

const HomeComponent = () => {
  return (
    <>
      <ProfileMeta
        title="Jeff92 & Ayan Sumania — DJ Edits & Club Tools"
        description="Professional DJ edits, remixes, and club weapons made by verified editors worldwide."
      />

      <main className="relative w-full overflow-hidden">
        {/* ================= HERO ================= */}
        <section className="relative flex flex-col items-center text-center pt-24 pb-32">
          {/* Glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px]" />
          </div>

          <h1
            className={cn(
              'text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white',
              font.className
            )}
          >
            Professional DJ
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-yellow-500 to-blue-500">
              Edits & Club Tools
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-600 dark:text-zinc-400">
            Discover high-quality DJ edits, remixes, and performance weapons.
            Every purchase directly supports the editor and collaborators.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/tracks"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Start Browsing <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/how-to-buy"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              How It Works
            </Link>
          </div>
        </section>
        {/* ================= FEATURES ================= */}
        <section className="mx-auto max-w-8xl pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'DJ-Only License',
                desc: 'Edits are licensed strictly for DJ performance — clubs, radio, livestreams.',
              },
              {
                title: 'Fair Revenue Split',
                desc: 'Collaborative releases automatically split revenue between editors.',
              },
              {
                title: 'Verified Editors',
                desc: 'Quality-controlled uploads from professional remixers worldwide.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
              >
                <h3 className="text-lg font-semibold dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
          <div className="mx-auto max-w-8xl">
            <AlbumScrollRow/>
          </div>
        </section>
        {/* ================= HOW IT WORKS ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
          <div className="mx-auto max-w-8xl ">
            <h2
              className={cn(
                'text-3xl md:text-5xl mb-10 dark:text-white',
                font.className
              )}
            >
              How it Works
            </h2>
            <StepsGrid />
          </div>
        </section>

        {/* ================= SOFTWARE ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
          <div className="mx-auto max-w-8xl">
            <h2
              className={cn(
                'text-3xl md:text-5xl mb-10 dark:text-white',
                font.className
              )}
            >
              Compatible DJ Software
            </h2>
            <SoftwareCarousel />
          </div>
        </section>

        {/* ================= RELEASES ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
          <div className="mx-auto max-w-8xl">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={cn(
                  'text-3xl md:text-5xl dark:text-white',
                  font.className
                )}
              >
                New Releases
              </h2>
              <Link
                href="/tracks"
                className="text-sm underline text-zinc-600 dark:text-zinc-400"
              >
                View all
              </Link>
            </div>

          </div>
          <HomeNewReleasesComponent />
        </section>
      </main>
    </>
  )
}

export default HomeComponent




 {/* 🔽 SECTIONS (Your Existing Layout) */}
        // {[
        //   { title: 'TRACKS', subtitle: 'TOP 5 NEW RELEASES', component:<HomeNewReleasesComponent/>,href:"/tracks",name:"View All"},
        //   { title: 'TRACKS', subtitle: 'TOP 5 BEST SELLING / LAST 30 DAYS', component:<HomeNewReleasesComponent/> ,href:"/tracks",name:"View All"},
        //   { title: 'CONTRIBUTORS', subtitle: 'TOP 10 REMIXER ARTIST',href:"/editors",name:"View All" },
        //   { title: 'CHARTS', subtitle: 'TOP 10 GENRES' },
        // ].map((section, index) => (
        //   <div
        //     key={index}
        //     className="flex flex-col items-center w-full justify-evenly py-5 bg-zinc-100 dark:bg-zinc-700 rounded-lg"
        //   >
        //     <div className="flex items-center justify-between w-full gap-2 px-5">
        //       <div className="flex items-center w-full gap-2">
        //         <Image
        //           src="/images/jeff92-ayan-brand-logo.svg"
        //           alt="Official Logo"
        //           width={130}
        //           height={30}
        //         />
        //         <div className="flex flex-col items-start w-full dark:text-white">
        //           <h3 className={`${font.className} text-lg md:text-5xl`}>
        //             {section.title}
        //           </h3>
        //           <h3 className={`${font.className} text-sm font-thin`}>
        //             {section.subtitle}
        //           </h3>
        //         </div>
        //       </div>
        //       {section.href && section.name &&
        //       <div>
        //         <Link href={section.href} className='flex items-center whitespace-nowrap underline'>{section.name}</Link>
        //       </div>
        //       }
        //     </div>
        //     {section.component&&
        //     <>
        //       {section.component}
        //     </>
        //     }
        //   </div>
        // ))}