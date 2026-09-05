import { PayPalCheckoutButton } from "@/components/common/paypal-checkout-button";
import { PayPalCheckoutProvider } from "@/components/common/paypal-sdk-provider";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreditsComponent() {
  const utils = api.useUtils();
  const { data: session, status } = useSession();
  const { data } = api.credits.balance.useQuery(undefined, { enabled: status === "authenticated" });
  const create = api.credits.createCheckout.useMutation();
  const capture = api.paypal.captureCheckout.useMutation();
  return <main className="mx-auto max-w-6xl px-4 py-28 text-zinc-100">
    <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#B9FF00]">JXS download credits</p>
    <h1 className="mt-4 text-5xl font-black leading-none md:text-7xl">Download when<br/><span className="text-[#B9FF00]">the room calls.</span></h1>
    <p className="mt-6 max-w-xl leading-7 text-zinc-400">Buy 180 non-expiring credits for $200 USD. One credit unlocks one individual audio or video edit. Curated music packs remain separate purchases.</p>
    <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">{[["180","downloads"],["$200","one-time"],["Never","expires"]].map(([value,label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><b className="text-xl text-white">{value}</b><p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">{label}</p></div>)}</div></div>
    <div className="rounded-[2rem] border border-[#B9FF00]/20 bg-[#171d20] p-7 shadow-[0_0_70px_rgba(185,255,0,.06)]">
      <p className="text-xs uppercase tracking-[.18em] text-zinc-500">{session ? "Your current balance" : "Credit pack"}</p><p className="mt-2 text-5xl font-black text-[#B9FF00]">{session ? data?.credit ?? 0 : 180}</p><p className="mt-1 text-sm text-zinc-500">credits</p>
      {session ? <div className="mt-7"><PayPalCheckoutProvider><PayPalCheckoutButton
        createOrder={async () => (await create.mutateAsync()).orderId}
        captureOrder={async (orderId) => { await capture.mutateAsync({ orderId }); }}
        onSuccess={() => { toast.success("180 credits added"); void utils.credits.balance.invalidate(); }}
        onCancel={() => toast.info("Payment cancelled — no credits were added")}
        onError={() => toast.error("PayPal checkout failed")}
      /></PayPalCheckoutProvider></div> : <div className="mt-7"><Link href="/auth/login?callbackUrl=/credits" className="flex w-full justify-center rounded-xl bg-[#B9FF00] px-5 py-3.5 font-bold text-black">Log in to buy credits</Link><p className="mt-3 text-center text-xs text-zinc-600">PayPal checkout appears after login.</p></div>}
    </div></div>
  </main>;
}
