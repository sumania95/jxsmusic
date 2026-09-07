import { api } from "@/utils/api"
import { TicketPercent } from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import BannerTitleComponent from "@/components/common/banner-title"

type Props = {
  title: string
  description: string
}

export default function HeaderWithCouponBanner({
  title,
  description,
}: Props) {
  const { data: coupon, isLoading } =
    api.coupon.getActiveCoupons.useQuery()

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-[180px] -right-[120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
              Jeff92 & Ayan Sumania Library
            </span>
          </div>

          <BannerTitleComponent
            title={title}
            description={description}
          />
        </div>

        {/* Coupon skeleton */}
        {isLoading && <CouponSkeleton />}

        {/* Coupon */}
        {!isLoading && coupon && (
          <div className="w-full shrink-0 rounded-2xl border border-[#B9FF00]/20 bg-[#B9FF00]/[0.06] p-5 shadow-[0_0_40px_rgba(185,255,0,0.04)] lg:w-auto lg:min-w-[440px]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Offer */}
              <div className="flex shrink-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#B9FF00]/20 bg-[#B9FF00]/10 text-[#B9FF00]">
                  <TicketPercent className="h-6 w-6" />
                </div>

                <div>
                  <span className="mb-1 block text-xs font-semibold tracking-[0.14em] text-[#B9FF00] uppercase">
                    Special Offer
                  </span>

                  <span className="block text-xl leading-none font-bold whitespace-nowrap text-white sm:text-2xl">
                    {coupon.type === "PERCENT"
                      ? `${coupon.value}% OFF`
                      : `${formatCurrency(coupon.value)} OFF`}
                  </span>
                </div>
              </div>

              {/* Responsive divider */}
              <div className="h-px w-full bg-white/10 sm:h-16 sm:w-px" />

              {/* Coupon details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm whitespace-nowrap text-zinc-400">
                    Use code
                  </span>

                  <span className="rounded-lg border border-dashed border-[#B9FF00]/40 bg-black/20 px-3 py-1.5 font-mono text-sm font-bold tracking-[0.12em] text-[#B9FF00]">
                    {coupon.code}
                  </span>
                </div>

                {(coupon.minSpend > 0 || coupon.expiresAt) && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                    {coupon.minSpend > 0 && (
                      <span className="whitespace-nowrap">
                        Min.{" "}
                        <span className="font-medium text-zinc-300">
                          {formatCurrency(coupon.minSpend)}
                        </span>
                      </span>
                    )}

                    {coupon.minSpend > 0 && coupon.expiresAt && (
                      <span className="text-zinc-700">•</span>
                    )}

                    {coupon.expiresAt && (
                      <span className="whitespace-nowrap">
                        Ends{" "}
                        <span className="font-medium text-zinc-300">
                          {formatDateShort(coupon.expiresAt)}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CouponSkeleton() {
  return (
    <div
      aria-label="Loading coupon"
      className="w-full shrink-0 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:w-auto lg:min-w-[440px]"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/[0.08]" />

          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-white/[0.08]" />
            <div className="h-6 w-28 rounded bg-white/10" />
          </div>
        </div>

        <div className="h-px w-full bg-white/10 sm:h-16 sm:w-px" />

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-white/[0.08]" />
            <div className="h-8 w-24 rounded-lg bg-white/10" />
          </div>

          <div className="h-3 w-32 rounded bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}