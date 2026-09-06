import { CreditCard, RefreshCw, RotateCcw, WalletCards } from "lucide-react";

import { api } from "@/utils/api";
import { motion, useReducedMotion } from "framer-motion";

const money = (cents: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents ?? 0) / 100,
  );

export default function AdminDashboardData() {
  const reduceMotion = useReducedMotion();
  const { data, isLoading } = api.accounting.overview.useQuery();
  if (isLoading || !data)
    return <p className="p-6 text-sm text-zinc-500">Loading accounting…</p>;

  const cards = [
    {
      label: "Paid revenue",
      value: money((data.paid._sum.finalAmount ?? 0) - (data.paid._sum.paypalFee ?? 0)),
      meta: `${money(data.paid._sum.finalAmount)} gross − ${money(data.paid._sum.paypalFee)} PayPal fees`,
      icon: WalletCards,
    },
    {
      label: "Pending",
      value: money(data.pending._sum.finalAmount),
      meta: `${data.pending._count.id} orders`,
      icon: RefreshCw,
    },
    {
      label: "Refunded",
      value: money(data.refunded._sum.finalAmount),
      meta: `${data.refunded._count.id} orders`,
      icon: RotateCcw,
    },
    {
      label: "Credit-pack sales",
      value: money(data.creditSales._sum.finalAmount),
      meta: `${data.creditSales._count.id} packs / ${data.creditSales._sum.creditAmount ?? 0} credits`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map(({ label, value, meta, icon: Icon }) => (
          <motion.div
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-[#171d20] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
          >
            <Icon className="h-5 w-5 text-[#B9FF00]" />
            <p className="mt-4 text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-zinc-600">{meta}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )}