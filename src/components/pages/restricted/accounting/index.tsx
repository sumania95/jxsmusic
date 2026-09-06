"use client";

import { useQueryState } from "nuqs";
import {
  BarChart3,
  LayoutDashboard,
  ShoppingCart,
  TicketPercent,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import AdminDashboardData from "./dashboard";
import AdminUserData from "./users";
import AdminCouponData from "./coupon";
import AdminOrdersData from "./orders";
import AdminAccounting from "./accounting";

const sections: Array<{
  value: string;
  label: string;
  icon: LucideIcon;
}> = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    value: "users",
    label: "Users",
    icon: Users,
  },
  {
    value: "coupon",
    label: "Coupons",
    icon: TicketPercent,
  },
  {
    value: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    value: "reports",
    label: "Reports",
    icon: BarChart3,
  },
];

export default function AccountingBackOffice() {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "dashboard",
  });

  return (
    <div className="w-full space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/[.025] p-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#B9FF00]">
          Back-office
        </p>

        <h1 className="mt-3 text-4xl font-black text-white">
          Accounting
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Customers, credits, coupons, orders, PayPal fees, and revenue.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[.025] p-4">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value)}
        >
          <TabsList className="flex h-auto w-full gap-2 bg-[#111518] p-1">
            {sections.map((section) => (
              <AccountingTab
                key={section.value}
                value={section.value}
                label={section.label}
                icon={section.icon}
              />
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboardData />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserData />
          </TabsContent>

          <TabsContent value="coupon">
            <AdminCouponData />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersData />
          </TabsContent>

          <TabsContent value="reports">
            <AdminAccounting />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

type AccountingTabProps = {
  value: string;
  icon: LucideIcon;
  label: string;
};

function AccountingTab({
  value,
  icon: Icon,
  label,
}: AccountingTabProps) {
  return (
    <TabsTrigger
      value={value}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 text-[9px] font-medium text-zinc-500 transition-all hover:bg-white/[0.04] hover:text-zinc-200 data-[state=active]:bg-[#B9FF00] data-[state=active]:text-black data-[state=active]:shadow-none sm:text-[10px] lg:px-3"
    >
      <Icon
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
      />

      <span className="truncate">{label}</span>
    </TabsTrigger>
  );
}