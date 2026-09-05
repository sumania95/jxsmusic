import Link from "next/link"
import Image from "next/image"


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh bg-[#111518] text-zinc-200 lg:grid-cols-2">
      {/* =====================================================
          LEFT PANEL
      ===================================================== */}
      <div
        className="
          relative
          flex
          min-h-svh
          flex-col
          overflow-hidden
          border-r
          border-white/[0.05]
          bg-[#111518]
          p-5
          md:p-8
          lg:p-10
        "
      >
        {/* Ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-[-140px]
            top-[-160px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[110px]
          "
        />

        {/* =================================================
            LOGO
        ================================================= */}
        <div
          className="
            relative
            z-10
            flex
            justify-center
            md:justify-start
          "
        >
          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-transparent
              p-1
              transition-all
              hover:border-white/[0.06]
              hover:bg-white/[0.02]
            "
          >
            <Image
              src="/images/jeff92-ayan-brand-mark.png"
              alt="Jeff92 & Ayan Sumania"
              width={48}
              height={48}
              priority
              className="h-14 w-14 object-contain"
            />

            {/* <Image
              src="/images/jeff92-ayan-brand-logo.png"
              alt="Jeff92 & Ayan Sumania"
              width={300}
              height={100}
              priority
              className="hidden h-auto w-[150px] object-contain transition duration-300 group-hover:brightness-110 sm:block lg:w-[200px]"
            /> */}
          </Link>
        </div>

        {/* =================================================
            AUTH CONTENT
        ================================================= */}
        <div
          className="
            relative
            z-10
            flex
            flex-1
            items-center
            justify-center
            py-10
          "
        >
          <div className="w-full max-w-sm">
            {/* Jeff92 & Ayan Sumania label */}
            <div className="mb-5 flex items-center gap-2">
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
                Jeff92 & Ayan Sumania Account
              </span>
            </div>

            {/* Auth form/content */}
            <div
              className="
                w-full
                rounded-3xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
                shadow-2xl
                backdrop-blur-sm
                sm:p-6
              "
            >
              {children}
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER LABEL
        ================================================= */}
        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-center
            md:justify-start
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.16em]
              text-zinc-700
            "
          >
            Music for DJs
          </span>
        </div>
      </div>


      {/* =====================================================
          RIGHT VISUAL
      ===================================================== */}
      <div
        className="
          relative
          hidden
          overflow-hidden
          bg-zinc-950
          lg:block
        "
      >
        <Image
          src="/images/auth-bg.jpg"
          alt="Auth background"
          fill
          priority
          sizes="50vw"
          className="
            object-cover
            brightness-[0.35]
            grayscale
          "
        />

        {/* Dark overlay */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-l
            from-black/20
            via-black/30
            to-black/80
          "
        />

        {/* Yellow ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-100px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#B9FF00]/[0.07]
            blur-[130px]
          "
        />

        {/* Bottom gradient */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-1/2
            bg-linear-to-t
            from-black
            via-black/40
            to-transparent
          "
        />

        {/* =================================================
            VISUAL CONTENT
        ================================================= */}
        <div
          className="
            absolute
            inset-0
            flex
            items-end
            p-10
            xl:p-14
          "
        >
          <div className="max-w-lg">
            <div className="mb-4 flex items-center gap-2">
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
                  text-zinc-400
                "
              >
                Jeff92 & Ayan Sumania
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
                xl:text-4xl
              "
            >
              Built for DJs.
            </h2>

            <p
              className="
                mt-3
                max-w-md
                text-sm
                leading-7
                text-zinc-400
              "
            >
              Discover exclusive edits, remixes, and DJ-ready music from the
              Jeff92 & Ayan Sumania community.
            </p>

            <div
              className="
                mt-6
                h-px
                w-20
                bg-[#B9FF00]/70
              "
            />
          </div>
        </div>
      </div>
    </div>
  )
}