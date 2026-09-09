import React from "react";
import {
  Download,
  LockKeyhole,
  LogOut,
  Monitor,
  Moon,
  Package,
  ShieldCheck,
  Sun,
  Upload,
  UserRound,
  CreditCard,
  Star,
  Landmark,
  MessageCircleCode,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { changePasswordState } from "@/state/globalState";
import {
  isAdminAtom,
  isSuperAdminAtom,
  isUploaderAtom,
} from "@/state/userRoleAtoms";
import { api } from "@/utils/api";

type MenuRowProps = {
  icon: React.ElementType;
  label: string;
  description: string;
  active?: boolean;
  onSelect: () => void;
};

const MenuRow = ({
  icon: Icon,
  label,
  description,
  active = false,
  onSelect,
}: MenuRowProps) => (
  <DropdownMenuItem
    onSelect={onSelect}
    className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all outline-none ${
      active
        ? `border-[#B9FF00]/20 bg-[#B9FF00]/[0.08] text-zinc-100`
        : `border-transparent text-zinc-400 hover:border-white/[0.07] hover:bg-white/[0.04] hover:text-zinc-100 focus:bg-white/[0.05] focus:text-zinc-100`
    } `}
  >
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
        active
          ? `border-[#B9FF00]/25 bg-[#B9FF00]/10 text-[#B9FF00]`
          : `border-white/[0.07] bg-white/[0.025] text-zinc-500 group-hover:border-[#B9FF00]/20 group-hover:text-[#B9FF00]`
      } `}
    >
      <Icon className="h-4 w-4" />
    </span>

    <span className="min-w-0 flex-1">
      <span className="block truncate text-xs font-semibold">{label}</span>

      <span className="mt-0.5 block truncate text-[9px] text-zinc-600">
        {description}
      </span>
    </span>

    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
        active ? "bg-[#B9FF00]" : "bg-zinc-700 group-hover:bg-[#B9FF00]"
      } `}
    />
  </DropdownMenuItem>
);

const ProfileComponent = () => {
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const { data: session, status } = useSession();
  const { data: creditBalance } = api.credits.balance.useQuery(
    undefined,
    {
      enabled: Boolean(session?.user),
    },
  );

  const [, setChangePasswordOpen] = useAtom(changePasswordState);

  const [isAdmin] = useAtom(isAdminAtom);

  const [isUploader] = useAtom(isUploaderAtom);

  const [isSuperAdmin] = useAtom(isSuperAdminAtom);

  const navigate = (href: string) => {
    void router.push(href);
  };

  const handleSignout = async () => {
    await signOut({
      callbackUrl: "/api/auth/logout",
      redirect: false,
    });

    // await router.push("/");
    window.location.replace("/");
  };

  const initials = session?.user.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const themes = [
    {
      value: "system",
      icon: Monitor,
      label: "System theme",
    },
    {
      value: "light",
      icon: Sun,
      label: "Light theme",
    },
    {
      value: "dark",
      icon: Moon,
      label: "Dark theme",
    },
  ];

  return (
    <DropdownMenu>
      {/* PROFILE TRIGGER */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="group relative flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] p-1 transition-all outline-none hover:border-[#B9FF00]/25 hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-[#B9FF00]/50"
        >
          <Avatar className="h-8 w-8 rounded-lg border border-white/[0.08] bg-zinc-950">
            <AvatarImage
              src={session?.user.image ?? undefined}
              alt={session?.user.name ?? "Account"}
              className="rounded-lg object-cover"
            />

            <AvatarFallback className="rounded-lg bg-zinc-900 text-[10px] font-semibold text-zinc-400">
              {initials ?? <UserRound className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>

          {status === "authenticated" && (
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]"
            />
          )}
        </button>
      </DropdownMenuTrigger>

      {/* DROPDOWN */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="relative max-h-[min(620px,calc(100vh-24px))] w-72 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 p-2 text-zinc-400 shadow-2xl backdrop-blur-xl"
      >
        {/* AMBIENT GLOW */}
        <div className="pointer-events-none absolute -top-28 -right-24 h-56 w-56 rounded-full bg-[#B9FF00]/[0.045] blur-[75px]" />

        {/* ACCOUNT HEADER */}
        <div className="relative mb-2 border-b border-white/[0.07] px-2 pt-1 pb-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[9px] font-semibold tracking-[0.18em] text-zinc-600 uppercase">
              Jeff92 & Ayan Sumania account
            </span>

            {isSuperAdmin ? (
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[8px] font-bold text-violet-300 uppercase">
                Super admin
              </span>
            ) : isAdmin ? (
              <span className="rounded-full border border-[#B9FF00]/20 bg-[#B9FF00]/10 px-2 py-0.5 text-[8px] font-bold text-[#B9FF00] uppercase">
                Admin
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 shrink-0 rounded-xl border border-white/[0.08]">
              <AvatarImage
                src={session?.user.image ?? undefined}
                alt={session?.user.name ?? "Account"}
                className="rounded-xl object-cover"
              />

              <AvatarFallback className="rounded-xl bg-white/[0.04] text-xs font-semibold text-zinc-400">
                {initials ?? <UserRound className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-zinc-100">
                {session?.user.name ??
                  (status === "loading" ? "Loading…" : "Account")}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                {session?.user.email ?? ""}
              </p>
            </div>
          </div>
        </div>

        {/* CUSTOMER LINKS */}
        <div className="space-y-0.5">
          <MenuRow
            icon={User}
            label="Account"
            description="Manage Account,Purchases,Orders"
            active={router.pathname === "/account"}
            onSelect={() => navigate("/account")}
          />
          <MenuRow
            icon={CreditCard}
            label={`${creditBalance?.credit ?? 0} credits left`}
            description="Buy 180 non-expiring credits for $200"
            active={
              router.pathname === "/credits"
            }
            onSelect={() => navigate("/credits")}
          />
          
        </div>

        {/* MANAGEMENT LINKS */}
        {(isUploader || isAdmin || isSuperAdmin) && (
          <div className="mt-2 border-t border-white/[0.07] pt-2">
            <p className="px-3 pb-1.5 text-[8px] font-semibold tracking-[0.16em] text-zinc-700 uppercase">
              Management
            </p>

            {isUploader && (
              <MenuRow
                icon={Upload}
                label="Contributor"
                description="Upload and publish music"
                active={router.pathname.startsWith(
                  "/restricted/editor/uploader",
                )}
                onSelect={() => navigate("/restricted/editor/uploader")}
              />
            )}

            {(isAdmin || isSuperAdmin) && (
              <MenuRow icon={Landmark} label="Accounting" description="Users, orders, credits, and reports" active={router.pathname.startsWith("/restricted/accounting")} onSelect={() => navigate("/restricted/accounting")} />
            )}

            {isSuperAdmin && (
              <MenuRow
                icon={ShieldCheck}
                label="Administration"
                description="Users, roles, and system access"
                active={router.pathname.startsWith("/restricted/admin")}
                onSelect={() => navigate("/restricted/admin")}
              />
            )}
            {/* {isSuperAdmin && (
              <MenuRow
                icon={MessageCircleCode}
                label="Marketing"
                description="Manage Emails Ads"
                active={router.pathname.startsWith("/restricted/marketing")}
                onSelect={() => navigate("/restricted/marketing")}
              />
            )} */}
          </div>
        )}

        {/* ACCOUNT SETTINGS */}
        {/* <div className="mt-2 border-t border-white/[0.07] pt-2">
          <MenuRow
            icon={LockKeyhole}
            label="Change Password"
            description="Update your account security"
            onSelect={() => setChangePasswordOpen(true)}
          />
        </div> */}

        {/* LOGOUT */}
        <div className="mt-2 border-t border-white/[0.07] pt-2">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              void handleSignout();
            }}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-red-400 transition outline-none hover:border-red-500/15 hover:bg-red-500/[0.07] hover:text-red-300 focus:bg-red-500/[0.07] focus:text-red-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/15 bg-red-500/[0.06]">
              <LogOut className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold">Sign out</span>

              <span className="block text-[9px] text-red-500/55">
                End this session
              </span>
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileComponent;
