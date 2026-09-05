import { Menu, ShoppingBag,X, ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileComponent from "./helper/profile";
import { useState } from "react";
import { Changa_One, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { cartCountAtom } from "@/state/cartAtoms";
import CouponBanner from "../pages/home/coupon";
import Image from "next/image";

const font = Inter({
  subsets: ["latin"],
  weight: "400",
});

const font_changa = Changa_One({
  subsets: ["latin"],
  weight: "400",
});

const baseRoutes: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/", label: "Home" },
  { href: "/tracks", label: "Tracks" },
  { href: "/multi-packs", label: "Packs" },
  { href: "/charts", label: "Charts" },
  // { href: "/editors/jeff92-ayan-sumania", label: "Our Edits" },
  // { href: "/contact-us", label: "Contact Us" },
  { href: "/credits", label: "Credits" },
  { href: "/book-us", label: "Book Us" },
];

const HeaderV2Components = () => {
  const { data: session } = useSession();

  // const [isAdmin] = useAtom(isAdminAtom);
  // const [isUploader] = useAtom(isUploaderAtom);
  // const [isSuperAdmin] = useAtom(isSuperAdminAtom);

  // const roleStatus = [isAdmin, isSuperAdmin].some(Boolean);

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full select-none",
        "border-b border-white/10 bg-[#111518]/95 text-zinc-100",
        "shadow-xl backdrop-blur-xl",
        font.className,
      )}
    >
      <CouponBanner />

      <div className="grid h-20 w-full grid-cols-[auto_auto] items-center gap-3 px-4 lg:grid-cols-[300px_1fr_300px] lg:px-10">
        {/* =========================================================
            LOGO
        ========================================================= */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="Jeff92 & Ayan Sumania home"
            className="group flex items-center rounded-lg px-2 py-1 transition focus-visible:ring-2 focus-visible:ring-[#B9FF00]/50 focus-visible:outline-none"
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

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================= */}
        <nav className="hidden min-w-0 items-center justify-center lg:flex">
          <div className="grid auto-cols-max grid-flow-col items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5">
            {baseRoutes.map((route) => {
              const active = !route.external && isActive(route.href);

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  target={route.external ? "_blank" : undefined}
                  rel={route.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    `group/nav inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs tracking-wider whitespace-nowrap uppercase transition-all duration-300 ease-out active:scale-95 lg:px-5`,
                    active
                      ? `bg-[#B9FF00] text-black shadow-lg shadow-[#B9FF00]/10`
                      : `text-zinc-300 hover:bg-white/10 hover:text-white hover:shadow-md hover:shadow-black/20`,
                  )}
                >
                  <span className="transition-transform duration-300 ease-out">
                    {route.label}
                  </span>

                  {route.external && (
                    <ExternalLink
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =========================================================
            RIGHT SIDE: ORDERS / CART / ADMIN / PROFILE
        ========================================================= */}
        <div className="flex items-center justify-end gap-1.5 lg:gap-2">
          {/* My Orders */}
          {/* {session?.user && (
            <Button
              asChild
              variant="ghost"
              className="
                hidden
                h-10
                rounded-xl
                border
                border-white/10
                bg-white/4
                px-3
                text-zinc-300
                transition
                hover:bg-white/10
                hover:text-white
                lg:flex
              "
            >
              <Link
                href="/my-orders"
                className="flex items-center gap-2 text-xs"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </Button>
          )} */}

          {/* Cart */}
          <CartHeaderComponent />

          {/* Admin Menu */}
          {/* {session?.user?.id && roleStatus && <MenuSectionComponent />} */}

          {/* Profile / Login */}
          {session?.user?.id ? (
            <div className="rounded-full border border-white/40 lg:ml-2">
              <ProfileComponent />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-full bg-[#B9FF00] px-4 py-2.5 text-[11px] text-black uppercase transition hover:bg-[#B9FF00] sm:flex"
            >
              Login / Signup
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center text-zinc-200 transition hover:text-white lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================= */}
      {menuOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-white/10 bg-[#111518]/95 px-4 pt-3 pb-4 backdrop-blur-xl duration-300 lg:hidden">
          <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/3 p-2">
            {baseRoutes.map((route) => {
              const active = !route.external && isActive(route.href);

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  target={route.external ? "_blank" : undefined}
                  rel={route.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    `group/nav flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-center text-xs uppercase transition-all duration-300 ease-out active:scale-95`,
                    active
                      ? "bg-[#B9FF00] text-black"
                      : `text-zinc-300 hover:bg-white/10 hover:text-white`,
                  )}
                >
                  <span>{route.label}</span>

                  {route.external && (
                    <ExternalLink
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5"
                    />
                  )}
                </Link>
              );
            })}

            {/* Mobile Login */}
            {!session?.user?.id && (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#B9FF00] px-4 py-3 text-center text-xs text-black uppercase"
              >
                Login / Signup
              </Link>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderV2Components;

// =========================================================
// CART
// =========================================================

const CartHeaderComponent = () => {
  const count = useAtomValue(cartCountAtom);

  return (
    <Link
      href="/my-cart"
      aria-label="Shopping cart"
      className="relative flex h-10 w-10 items-center justify-center text-zinc-400 transition-all hover:text-white"
    >
      <ShoppingBag className="h-7 w-7" />

      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#B9FF00] px-1 text-[9px] font-bold text-black ring-2 ring-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};
