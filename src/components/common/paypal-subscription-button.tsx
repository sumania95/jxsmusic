"use client";

import {
  DISPATCH_ACTION,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { LoaderCircle, RefreshCw } from "lucide-react";

type PayPalSubscriptionButtonProps = {
  planId: string;
  customId: string;
  onCreated: (subscriptionId: string) => Promise<void>;
  onApproved?: (subscriptionId: string) => void | Promise<void>;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
};

export function PayPalSubscriptionButton({
  planId,
  customId,
  onCreated,
  onApproved,
  onCancel,
  onError,
}: PayPalSubscriptionButtonProps) {
  const [{ isPending, isRejected, options }, dispatch] =
    usePayPalScriptReducer();
  if (isPending)
    return (
      <div className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#171d20] text-xs text-zinc-500">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading PayPal…
      </div>
    );
  if (isRejected)
    return (
      <button
        type="button"
        onClick={() =>
          dispatch({ type: DISPATCH_ACTION.RESET_OPTIONS, value: options })
        }
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#B9FF00]/20 bg-[#171d20] text-xs text-[#B9FF00]"
      >
        <RefreshCw className="h-4 w-4" />
        Reload PayPal
      </button>
    );

  return (
    <PayPalButtons
      style={{
        color: "gold",
        shape: "rect",
        label: "subscribe",
        layout: "vertical",
        height: 48,
      }}
      createSubscription={async (_data, actions) => {
        const subscriptionId = await actions.subscription.create({
          plan_id: planId,
          custom_id: customId,
        });
        await onCreated(subscriptionId);
        return subscriptionId;
      }}
      onApprove={async (data) => {
        if (!data.subscriptionID) {
          throw new Error("PayPal subscription ID was not returned");
        }

        await onApproved?.(data.subscriptionID);
      }}
      onError={(error) => {
        onError?.(error);
      }}
      onCancel={() => onCancel?.()}
    />
  );
}
