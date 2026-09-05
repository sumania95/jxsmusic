import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { JsonValue } from '@prisma/client/runtime/library'
import React from 'react'
import {
  CalendarClock,
  CreditCard,
  Hash,
  Mail,
  UserRound,
  Webhook,
} from 'lucide-react'


interface Props {
  order: {
    amount: number
    discountAmount: number
    finalAmount: number
    referenceId: string
    user: {
      name: string | null
      email: string | null
    } | null
  } | null
  status: string | null
  id: string
  provider: string
  referenceId: string | null
  orderId: string | null
  event: string | null
  payload: JsonValue
  headers: JsonValue
  receivedAt: Date
}


const AdminWebhookItem = (props: Props) => {
  return (
    <div
      className="
        w-full
        px-4
        py-4
        text-sm
        text-zinc-300
        sm:px-5
      "
    >
      {/* =====================================================
          TOP
      ===================================================== */}
      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* USER */}
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              text-zinc-600
              transition-all
              group-hover:border-[#B9FF00]/15
              group-hover:bg-[#B9FF00]/[0.06]
              group-hover:text-[#B9FF00]
            "
          >
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <span
              className="
                block
                truncate
                text-sm
                font-semibold
                text-zinc-200
              "
            >
              {props.order?.user?.name ?? 'Unknown User'}
            </span>

            <div className="mt-1 flex min-w-0 items-center gap-1.5">
              <Mail className="h-3 w-3 shrink-0 text-zinc-700" />

              <span
                className="
                  truncate
                  text-[10px]
                  text-zinc-600
                "
              >
                {props.order?.user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* PROVIDER + STATUS */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="
              gap-1.5
              rounded-full
              border-white/[0.08]
              bg-white/[0.025]
              px-2.5
              py-1
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-zinc-500
            "
          >
            <Webhook className="h-3 w-3" />
            {props.provider}
          </Badge>

          {props.status && (
            <Badge
              variant={
                props.status === 'success'
                  ? 'default'
                  : props.status === 'failed'
                  ? 'destructive'
                  : 'secondary'
              }
              className="
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wider
              "
            >
              {props.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      <Separator className="my-4 bg-white/[0.05]" />

      {/* =====================================================
          REFERENCE
      ===================================================== */}
      <div
        className="
          rounded-xl
          border
          border-white/[0.05]
          bg-white/[0.015]
          px-3
          py-3
        "
      >
        <div className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-[#B9FF00]" />

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-zinc-700
            "
          >
            Reference
          </span>
        </div>

        <span
          className="
            mt-2
            block
            break-all
            font-mono
            text-[11px]
            text-zinc-400
          "
        >
          {props.order?.referenceId ?? props.referenceId}
        </span>
      </div>

      <Separator className="my-4 bg-white/[0.05]" />

      {/* =====================================================
          AMOUNTS
      ===================================================== */}
      <div
        className="
          grid
          grid-cols-2
          gap-2
          md:grid-cols-4
        "
      >
        {/* SUBTOTAL */}
        <StatBox
          label="Subtotal"
          icon={CreditCard}
          value={formatCurrency(props.order?.amount)}
        />

        {/* DISCOUNT */}
        <StatBox
          label="Discount"
          value={`-${formatCurrency(
            props.order?.discountAmount
          )}`}
          danger
        />

        {/* TOTAL */}
        <StatBox
          label="Total"
          value={formatCurrency(
            props.order?.finalAmount
          )}
          highlight
        />

        {/* RECEIVED */}
        <StatBox
          label="Received"
          icon={CalendarClock}
          value={formatDateShort(
            props.receivedAt
          )}
        />
      </div>
    </div>
  )
}


export default AdminWebhookItem


const StatBox = ({
  label,
  value,
  icon: Icon,
  danger = false,
  highlight = false,
}: {
  label: string
  value: string
  icon?: React.ElementType
  danger?: boolean
  highlight?: boolean
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.05]
        bg-white/[0.015]
        px-3
        py-3
      "
    >
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon className="h-3 w-3 text-zinc-700" />
        )}

        <p
          className="
            text-[8px]
            font-medium
            uppercase
            tracking-[0.13em]
            text-zinc-700
          "
        >
          {label}
        </p>
      </div>

      <p
        className={`
          mt-1.5
          truncate
          text-xs
          font-semibold
          tabular-nums

          ${
            danger
              ? 'text-red-400'
              : highlight
              ? 'text-[#B9FF00]'
              : 'text-zinc-400'
          }
        `}
      >
        {value}
      </p>
    </div>
  )
}