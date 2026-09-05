import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUserData from "../admin/users";
import AdminCouponData from "../admin/coupon";
import AdminOrdersData from "../admin/orders";
import AdminAccounting from "../admin/accounting";

const sections = [["users", "Users"], ["coupon", "Coupons"], ["orders", "Orders"], ["reports", "Reports"]] as const;

export default function AccountingBackOffice() {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "users" });
  return <div className="w-full space-y-5"><section className="rounded-3xl border border-white/10 bg-white/[.025] p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#B9FF00]">Back-office</p><h1 className="mt-3 text-4xl font-black text-white">Accounting</h1><p className="mt-2 text-sm text-zinc-500">Customers, credits, coupons, orders, PayPal fees, and revenue.</p></section><section className="rounded-3xl border border-white/10 bg-white/[.025] p-4"><Tabs value={tab} onValueChange={setTab}><TabsList className="grid h-auto grid-cols-2 gap-2 bg-[#111518] p-1 md:grid-cols-4">{sections.map(([value, label]) => <TabsTrigger key={value} value={value} className="rounded-xl data-[state=active]:bg-[#B9FF00] data-[state=active]:text-black">{label}</TabsTrigger>)}</TabsList><TabsContent value="users"><AdminUserData /></TabsContent><TabsContent value="coupon"><AdminCouponData /></TabsContent><TabsContent value="orders"><AdminOrdersData /></TabsContent><TabsContent value="reports"><AdminAccounting /></TabsContent></Tabs></section></div>;
}
