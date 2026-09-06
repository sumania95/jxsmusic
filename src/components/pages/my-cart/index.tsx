import React, { useEffect } from "react";
import EmptyComponent from "../common/empty";
import { api } from "@/utils/api";
import CartTrackItemComponent from "./data-item";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/router";
import BannerTitleComponent from "@/components/common/banner-title";
import {
  ArrowLeft,
  BadgePercent,
  LoaderIcon,
  LockKeyhole,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";
import LoadingSkeletonComponents from "../common/loading-skeleton";
import Link from "next/link";
import { ProfileMeta } from "@/components/common/metadata";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { PayPalCheckoutButton } from "@/components/common/paypal-checkout-button";
import { PayPalCheckoutProvider } from "@/components/common/paypal-sdk-provider";

type Coupon = {
  id: string;
  value: number;
  code: string;
  type: string;
  year: number;
  isActive: boolean;
  startsAt: Date | null;
  expiresAt: Date | null;
};

const MyCartComponent = () => {
  const [coupon, setCoupon] = React.useState<Coupon>();
  const [couponCode, setCouponCode] = React.useState("");
  const [errorCodeMsg, setErrorCodeMsg] = React.useState("");

  const { data: session } = useSession();

  const utils = api.useUtils();

  const router = useRouter();

  useEffect(() => {
    void utils.order.getAll.invalidate();
  }, [utils.order.getAll]);

  const { data: cart, isLoading } = api.cart.getAll.useQuery();

  const { data: counter } = api.cart.counter.useQuery();
  const { data: creditBalance } = api.credits.balance.useQuery(
    undefined,
    {
      enabled: Boolean(session?.user),
    },
  );
  const activeSubscription = (creditBalance?.credit ?? 0) > 0;

  const { mutateAsync: applyCoupon } = api.coupon.applyCode.useMutation({
    retry: false,

    onSuccess: (data: Coupon) => {
      setCoupon(data);
      setErrorCodeMsg("");
      toast.success("Coupon applied");
    },

    onError: (e) => {
      setErrorCodeMsg(e.message);
    },
  });

  const createCheckout = api.paypal.createCheckout.useMutation();
  const captureCheckout = api.paypal.captureCheckout.useMutation();

  const subtotal = counter?.totalPrice._sum.price ?? 0;

  const discount = coupon
    ? coupon.type === "PERCENT"
      ? Math.floor((subtotal * coupon.value) / 100)
      : coupon.value * 100
    : 0;

  const total = Math.max(subtotal - discount, 0);

  const handleRemoveCoupon = () => {
    setCoupon(undefined);
    setCouponCode("");
    setErrorCodeMsg("");
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value.toUpperCase());

    if (errorCodeMsg) {
      setErrorCodeMsg("");
    } // 🔥 hide error on interaction
  };

  const handleApplyCoupon = async () => {
    try {
      await applyCoupon({
        code: couponCode,
        totalAmount: counter?.totalPrice._sum.price ?? 0,
      });
    } catch {
      // ❌ DO NOTHING
      // error already handled in onError
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <ProfileMeta title="My Cart" description="Collection of DJ Music" />

      {/* =========================================================
          JEFF92 & AYAN SUMANIA HEADER
      ========================================================== */}
      <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
              Jeff92 & Ayan Sumania Checkout
            </span>
          </div>

          <BannerTitleComponent title="Checkout" />

          <div className="mt-5">
            <Link
              href={"/tracks"}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase transition hover:border-[#B9FF00]/20 hover:bg-[#B9FF00]/[0.04] hover:text-[#B9FF00]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          NO SESSION
      ========================================================== */}
      {!session ? (
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.025] p-5">
          <EmptyComponent title="No Items Yet" />
        </div>
      ) : (
        <>
          {/* EMPTY CART */}
          <div className="flex w-full flex-col gap-1">
            {cart?.length === 0 && (
              <div className="w-full rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <EmptyComponent />
              </div>
            )}
          </div>

          {/* LOADING */}
          {isLoading && (
            <LoadingSkeletonComponents
              key={1}
              className={"h-96 w-full rounded-3xl"}
            />
          )}

          {/* =====================================================
              CART + PAYMENT
          ====================================================== */}
          {!isLoading && cart?.length !== 0 && (
            <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}
              <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B9FF00]/10 text-[#B9FF00]">
                      <ShoppingBag className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">
                        Order Summary
                      </h3>

                      <p className="mt-0.5 text-[9px] tracking-[0.14em] text-zinc-600 uppercase">
                        {counter?.counter._count.id} items in your cart
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[10px] font-medium text-zinc-500">
                    {counter?.counter._count.id}
                  </span>
                </div>

                {/* Cart items */}
                <div className="flex w-full flex-col gap-2 p-2 sm:p-3">
                  {cart?.map((as, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.015] transition-all duration-200 hover:border-[#B9FF00]/15 hover:bg-white/[0.025]"
                    >
                      {/* Hover accent */}
                      <span className="absolute top-1/2 left-0 z-10 h-7 w-0.5 -translate-y-1/2 rounded-full bg-[#B9FF00] opacity-0 shadow-[0_0_8px_rgba(185,255,0,0.35)] transition-opacity group-hover:opacity-100" />

                      <CartTrackItemComponent
                        subscriptionActive={activeSubscription}
                        index_key={index}
                        id={as.id}
                        track={as.track}
                        album={as.album}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* =================================================
                  PAYMENT SUMMARY
              ================================================= */}
              <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] lg:sticky lg:top-24">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B9FF00]/10 text-[#B9FF00]">
                    <ReceiptText className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      Payment Summary
                    </h3>

                    <p className="mt-0.5 text-[9px] tracking-[0.14em] text-zinc-600 uppercase">
                      Review before checkout
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {/* =================================================
                      PRICE BREAKDOWN
                  ================================================= */}
                  <div className="flex w-full flex-col gap-4 text-xs text-zinc-500">
                    {/* SUB TOTAL */}
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-start">
                        Sub Total
                      </div>

                      <div className="font-medium text-zinc-300 tabular-nums">
                        {formatCurrency(counter?.totalPrice._sum.price ?? 0)}
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="flex w-full items-center justify-between">
                      <div>Items</div>

                      <div className="font-medium text-zinc-300 tabular-nums">
                        {counter?.counter._count.id}
                      </div>
                    </div>

                    {/* DISCOUNT */}
                    <div className="flex w-full items-center justify-between">
                      <div>Discount</div>

                      <div
                        className={`font-medium tabular-nums ${
                          discount > 0 ? "text-red-400" : "text-zinc-300"
                        } `}
                      >
                        - {formatCurrency(discount)}
                      </div>
                    </div>

                    {/* =================================================
                        APPLIED COUPON
                    ================================================= */}
                    {coupon?.id && (
                      <div className="mt-1 flex w-full items-center justify-between gap-3 rounded-xl border border-[#B9FF00]/15 bg-[#B9FF00]/[0.04] px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#B9FF00]/10 text-[#B9FF00]">
                            <BadgePercent className="h-3.5 w-3.5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-mono text-[10px] font-semibold tracking-wider text-[#B9FF00] uppercase">
                              {coupon.code}
                            </p>

                            <p className="mt-0.5 text-[9px] text-zinc-600">
                              {coupon.type === "PERCENT"
                                ? `${coupon.value}% OFF`
                                : "FIXED"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="shrink-0 cursor-pointer text-[10px] font-medium text-red-400 transition-colors hover:text-red-300 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* =================================================
                        COUPON INPUT
                    ================================================= */}
                    {!coupon?.id && (
                      <div className="mt-1 flex w-full flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <BadgePercent className="h-3.5 w-3.5 text-[#B9FF00]" />

                          <h3 className="text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
                            Discount Code
                          </h3>
                        </div>

                        <div className="flex w-full items-center gap-2">
                          <div className="flex w-full items-center">
                            <Input
                              className="h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.025] px-3 font-mono text-xs tracking-wider text-zinc-300 uppercase placeholder:text-zinc-700 focus-visible:border-[#B9FF00]/30 focus-visible:ring-[#B9FF00]/10"
                              value={couponCode}
                              disabled={!!coupon}
                              onChange={handleCouponChange}
                              placeholder="Enter code"
                            />
                          </div>

                          <div className="flex shrink-0 items-center justify-end">
                            <Button
                              className="h-11 rounded-xl bg-[#B9FF00] px-5 text-xs font-semibold text-black hover:bg-[#B9FF00]"
                              onClick={handleApplyCoupon}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ERROR */}
                    {errorCodeMsg && (
                      <p className="mt-1 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-2 text-[10px] font-medium text-red-400">
                        {errorCodeMsg}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      TOTAL / PAYMENT
                  ================================================= */}
                  <div className="mt-5 flex w-full flex-col items-center justify-end gap-4 border-t border-white/[0.06] pt-5">
                    {/* Total */}
                    <div className="flex w-full items-end justify-between">
                      <div>
                        <p className="text-[9px] font-medium tracking-[0.14em] text-zinc-600 uppercase">
                          Total
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-700">
                          Final amount due
                        </p>
                      </div>

                      <div className="text-xl font-bold text-[#B9FF00] tabular-nums">
                        {formatCurrency(total)}
                      </div>
                    </div>

                    <div className="w-full">
                      <PayPalCheckoutProvider>
                        <PayPalCheckoutButton
                          createOrder={async () => {
                            const result = await createCheckout.mutateAsync({
                              couponId: coupon?.id,
                            });
                            if (result.kind === "FREE") {
                              await router.push(result.redirectUrl);
                              throw new Error("FREE_ORDER_COMPLETED");
                            }
                            return result.orderId;
                          }}
                          captureOrder={async (orderId) => {
                            await captureCheckout.mutateAsync({ orderId });
                          }}
                          onSuccess={() =>
                            void router.push("/my-orders?payment=success")
                          }
                          onCancel={() => {
                            toast.info(
                              "Checkout cancelled. You can pay the pending order from My Orders.",
                            );
                            void router.push("/my-orders?status=ALL");
                          }}
                          onError={(error) => {
                            if (
                              error instanceof Error &&
                              error.message.includes("FREE_ORDER_COMPLETED")
                            )
                              return;
                            console.error(error);
                            toast.error(
                              "PayPal checkout could not be completed",
                            );
                          }}
                        />
                      </PayPalCheckoutProvider>
                    </div>

                    {/* Security note */}
                    <div className="flex w-full items-start gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-3">
                      <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />

                      <h3 className="text-[10px] leading-5 text-zinc-600">
                        You&apos;ll continue to PayPal to approve the payment,
                        then return to your Jeff92 & Ayan Sumania library.
                      </h3>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCartComponent;
