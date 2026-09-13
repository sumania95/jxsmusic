import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { usePathname } from "next/navigation"
import { playerState } from "@/state/globalState"
import { cn } from "@/lib/utils"
import Link from "next/link"

import HeaderTitleComponent from "@/components/common/header-title"
import Footer from "../pages/home/helper/footer"
import HeaderV2Components from "../common/header-v2"
import CouponBanner from "../pages/home/coupon"

interface PropsCustomNav {
  href: string
  title: string
}

const CustomNavLink = ({ href, title }: PropsCustomNav) => {
  const pathname = usePathname()

  const isActive = pathname?.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        `
        group
        relative
        flex
        h-11
        w-full
        items-center
        justify-center
        rounded-md
        text-[10px]
        font-medium
        uppercase
        tracking-widest
        transition-all
        duration-200
        md:h-full
        `,
        isActive
          ? `
            bg-white/[0.04]
            text-white
          `
          : `
            text-zinc-600
            hover:bg-white/[0.03]
            hover:text-zinc-300
          `
      )}
    >
      {/* Active indicator */}
      <span
        className={cn(
          `
          absolute
          left-2
          top-1/2
          h-5
          w-0.5
          -translate-y-1/2
          rounded-full
          bg-[#B9FF00]
          transition-opacity
          duration-200
          `,
          isActive
            ? "opacity-100 shadow-[0_0_8px_rgba(185,255,0,0.6)]"
            : "opacity-0 group-hover:opacity-50"
        )}
      />

      {title}
    </Link>
  )
}

const EditorNavigation = () => {
  const navigationItems = [
    {
      title: "Uploader",
      href: "/restricted/editor/uploader",
    },
    {
      title: "Published",
      href: "/restricted/editor/published",
    },
    {
      title: "Multipack",
      href: "/restricted/editor/multi-pack",
    },
  ]

  return (
    <div className="w-full mb-3">
      {/* Section header */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_8px_rgba(185,255,0,0.7)]" />

          <HeaderTitleComponent title="EDITOR SECTION" />
        </div>

        <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
          Editor management
        </p>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Editor navigation"
        className="
          mt-4
          grid
          w-full
          grid-cols-2
          gap-1
          rounded-xl
          border
          border-white/10
          bg-[#111518]/40
          p-1
          md:h-12
          md:grid-cols-3
        "
      >
        {navigationItems.map((item, index) => (
          <div
            key={item.href}
            className={
              index === navigationItems.length - 1
                ? "col-span-2 md:col-span-1"
                : "min-w-0"
            }
          >
            <CustomNavLink
              title={item.title}
              href={item.href}
            />
          </div>
        ))}
      </nav>
    </div>
  )
}
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [state] = useAtom(playerState)

  const hasPlayer = Boolean(state.id)

  return (
    <main
      className={cn(
        "w-full overflow-hidden bg-[#111518] text-zinc-200",
        hasPlayer
          ? "h-[calc(100vh-145px)] pb-56 md:h-[calc(100vh-81px)]"
          : "h-screen"
      )}
    >
      <HeaderV2Components />
      <div
        className="
          fixed
          flex
          h-full
          w-full
          items-start
          justify-evenly
          overflow-y-auto
          dark-scrollbar
        "
      >

        <div className="h-auto w-full">
          <div className="w-full px-4 pt-20 lg:pt-27 md:px-6 lg:px-10">
            {router.pathname.startsWith("/restricted/editor") && (
              <EditorNavigation />
            )}

            {children}

            <Footer />
          </div>
        </div>
      </div>
    </main>
  )
}
