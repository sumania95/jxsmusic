import React from "react"
import Link from "next/link"
import { Mail, ArrowUpRight } from "lucide-react"
import { FaFacebook } from "react-icons/fa6"

const Footer = () => {
  const pages = [
    { label: "Home", href: "/" },
    { label: "How To Buy", href: "/how-to-buy" },
    { label: "DMCA Takedown Request", href: "/dmca" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Help", href: "/help" },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#111518] text-zinc-200 mt-40">
      {/* =====================================================
          AMBIENT GLOW
      ===================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-250px]
          h-[500px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-[#B9FF00]/[0.025]
          blur-[120px]
        "
      />

      <div className="relative py-16 lg:py-20 px-2 md:px-0">
        {/* =====================================================
            TOP BRAND AREA
        ===================================================== */}
        <div className="mb-14 flex flex-col gap-6 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="
                inline-block
                text-3xl
                font-bold
                tracking-[0.15em]
                text-white
                transition
                hover:text-[#B9FF00]
              "
            >
              JEFF92 & AYAN SUMANIA
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
              Professional DJ edits, remixes, and club tools
              created by verified editors worldwide.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />
            DJ Tools For The World
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* ===================================================
              ABOUT
          =================================================== */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9FF00]">
                01
              </span>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                About Jeff92 & Ayan Sumania
              </h3>
            </div>

            <p className="max-w-sm text-sm leading-7 text-zinc-500">
              Jeff92 & Ayan Sumania is a global community for DJs, editors,
              and music creators to share high-quality remixes,
              edits, and original tracks.
            </p>
          </div>

          {/* ===================================================
              PAGES
          =================================================== */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9FF00]">
                02
              </span>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Pages
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="
                    group
                    flex
                    w-fit
                    items-center
                    gap-1
                    text-sm
                    text-zinc-500
                    transition-colors
                    hover:text-white
                  "
                >
                  <span>{page.label}</span>

                  <ArrowUpRight
                    className="
                      h-3
                      w-3
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                      group-hover:opacity-100
                      group-hover:text-[#B9FF00]
                    "
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* ===================================================
              CONTACT
          =================================================== */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9FF00]">
                03
              </span>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Contact & Social
              </h3>
            </div>

            <p className="mb-5 text-sm leading-6 text-zinc-500">
              Questions or support? Reach out to us anytime.
            </p>

            <a
              href="mailto:music@jeff92ayansumania.com"
              className="
                group
                flex
                w-fit
                items-center
                gap-3
                text-sm
                text-zinc-400
                transition
                hover:text-white
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  transition
                  group-hover:border-[#B9FF00]/30
                  group-hover:bg-[#B9FF00]/10
                "
              >
                <Mail className="h-4 w-4 group-hover:text-[#B9FF00]" />
              </span>

              contact@jxsmusic.com
            </a>

            {/* Social */}
            <a 
              href="https://www.facebook.com/Jeff92xSumaniaAudioVideoRemixes/"
              target="_blank"
              rel="noreferrer"
              aria-label="Jeff92 & Ayan Sumania on Facebook"
              className="mt-6 flex items-center gap-2 group"
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-zinc-500
                  transition-all
                  group-hover:border-[#B9FF00]/30
                  group-hover:bg-[#B9FF00]
                  group-hover:text-black
                "
              >
                <FaFacebook className="h-4 w-4" />
              </div>
                <h3>Facebook Page</h3>
            </a>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}
        <div
          className="
            mt-16
            flex
            flex-col
            gap-3
            border-t
            border-white/10
            pt-6
            text-xs
            text-zinc-600
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {new Date().getFullYear()} Jeff92 & Ayan Sumania. All rights reserved.
          </p>

          <p className="uppercase tracking-[0.15em]">
            Built for DJs
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
