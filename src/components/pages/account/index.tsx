"use client"

import Image from "next/image"
import { useSession } from "next-auth/react"
import { parseAsStringEnum, useQueryState } from "nuqs"

import { ProfileMeta } from "@/components/common/metadata"
import NewReview from "./details/new-review"
import MyDownloadsComponents from "./details/my-downloads"
import MyOrdersComponents from "./details/my-orders"

const tabs = [
  { label: "Account", value: "account" },
  { label: "Purchases", value: "purchases" },
  { label: "My Orders", value: "orders" },
  { label: "Write a Review", value: "write-review" },
] as const

type Tab = (typeof tabs)[number]["value"]

const MyAccountData = () => {
  const { data: session, status } = useSession()

  

  const user = session?.user
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() ?? "U"

  return (
    <div className="flex w-full flex-col gap-6 text-white">
      <ProfileMeta
        title="My Account"
        description="Download your purchased tracks and albums"
      />

      {/* Profile */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-5">
        {/* <div className="absolute inset-y-0 left-0 w-1 bg-[#B9FF00]" /> */}

        {status === "loading" ? (
          <div className="flex animate-pulse items-center gap-4">
            <div className="size-16 rounded-full bg-white/10" />

            <div className="space-y-2">
              <div className="h-5 w-36 rounded bg-white/10" />
              <div className="h-4 w-48 rounded bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={
                    user.name
                      ? `${user.name}'s profile picture`
                      : "Profile picture"
                  }
                  width={72}
                  height={72}
                  className="size-[72px] rounded-md border border-[#B9FF00]/50 object-cover"
                />
              ) : (
                <div className="flex size-[72px] items-center justify-center rounded-full border-2 border-[#B9FF00] bg-[#B9FF00]/10 text-2xl font-bold text-[#B9FF00]">
                  {userInitial}
                </div>
              )}

              <span className="absolute bottom-0 right-1 size-3.5 rounded-full border-2 border-[#111111] bg-[#B9FF00]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-white">
                {user?.name ?? "Account user"}
              </h2>

              {user?.email && (
                <p className="mt-1 truncate text-sm text-white/50">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Tabs */}
      <AccountTabs/>
    </div>
  )
}

export default MyAccountData


const AccountTabs = () => {
  const [tab, setTab] = useQueryState(
    "type",
    parseAsStringEnum<Tab>(tabs.map(({ value }) => value)).withDefault(
      "account"
    )
  )

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
      <div
        role="tablist"
        aria-label="Account sections"
        className="flex overflow-x-auto border-b border-white/10 p-2"
      >
        {tabs.map(({ label, value }) => {
          const isActive = tab === value

          return (
            <button
              key={value}
              id={`${value}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${value}-panel`}
              onClick={() => setTab(value)}
              className={[
                "min-w-max flex-1 rounded-lg px-4 py-2.5 text-sm font-medium",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#B9FF00] focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#111111]",
                isActive
                  ? "bg-[#B9FF00] text-black"
                  : "text-white/50 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div
        id={`${tab}-panel`}
        role="tabpanel"
        aria-labelledby={`${tab}-tab`}
        tabIndex={0}
        className="min-h-64 p-5 focus:outline-none"
      >
        {tab === "account" && <AccountDetails />}
        {tab === "purchases" && <MyDownloadsComponents />}
        {tab === "orders" && <MyOrdersComponents />}
        {tab === "write-review" && <NewReview />}
      </div>
    </section>
  )
}

const AccountDetails = () => {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div>
      <SectionHeader
        title="Account Details"
        description="View and manage your personal information."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoField label="Full name" value={user?.name ?? "Not provided"} />
        <InfoField label="Email address" value={user?.email ?? "Not provided"} />
      </div>

      <button
        type="button"
        className="mt-6 rounded-lg bg-[#B9FF00] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#a7e600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
      >
        Edit profile
      </button>
    </div>
  )
}




type SectionHeaderProps = {
  title: string
  description: string
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-1 text-sm text-white/50">{description}</p>
  </div>
)

type InfoFieldProps = {
  label: string
  value: string
}

const InfoField = ({ label, value }: InfoFieldProps) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-white/40">
      {label}
    </p>
    <p className="mt-2 truncate text-sm text-white">{value}</p>
  </div>
)