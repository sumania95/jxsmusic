import { api } from "@/utils/api"
import { TicketPercent } from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils"


export default function CouponBanner() {
  const { data: coupon } =
    api.coupon.getActiveCoupons.useQuery()


  if (!coupon) return null


  return (
    <div
      className="
        relative
        hidden
        lg:block
        w-full
        overflow-hidden
        border-y
        border-[#B9FF00]/10
        bg-[#B9FF00]/[0.025]
      "
    >
      {/* Glow */}
      {/* <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-full
          w-80
          -translate-x-1/2
          bg-[#B9FF00]/[0.04]
          blur-3xl
        "
      /> */}


      <div
        className="
          relative
          flex
          min-h-5
          w-full
          items-center
          justify-center
          px-4
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-3
            gap-y-1
            text-center
          "
        >
          {/* Icon */}
          <div
            className="
              flex
              items-center
              gap-1.5
              text-[#B9FF00]
            "
          >
            <TicketPercent className="h-3.5 w-3.5" />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
              "
            >
              Special Offer
            </span>
          </div>


          {/* Divider */}
          <span
            className="
              hidden
              h-3
              w-px
              bg-white/10
              sm:block
            "
          />

          {/* Discount */}
          <span
            className="
              text-xs
              font-bold
              text-zinc-100
            "
          >
            {coupon.type === "PERCENT"
              ? `${coupon.value}% OFF`
              : `$${coupon.value} OFF`}
          </span>


          {/* Coupon */}
          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <span
              className="
                text-[10px]
                text-zinc-600
              "
            >
              Use code
            </span>

            <span
              className="
                rounded-md
                border
                border-dashed
                border-[#B9FF00]/30
                bg-[#B9FF00]/[0.06]
                px-2
                py-0.5
                font-mono
                text-[10px]
                font-bold
                tracking-wider
                text-[#B9FF00]
              "
            >
              {coupon.code}
            </span>
          </div>


          {/* Min Spend */}
          {coupon.minSpend > 0 && (
            <>
              <span className="hidden text-zinc-800 sm:inline">
                •
              </span>

              <span
                className="
                  text-[9px]
                  text-zinc-600
                "
              >
                Min. {formatCurrency(coupon.minSpend)}
              </span>
            </>
          )}


          {/* Expiry */}
          {coupon.expiresAt && (
            <>
              <span className="hidden text-zinc-800 md:inline">
                •
              </span>

              <span
                className="
                  hidden
                  text-[9px]
                  text-zinc-600
                  md:inline
                "
              >
                Ends{" "}
                <span className="text-zinc-500">
                  {formatDateShort(coupon.expiresAt)}
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}