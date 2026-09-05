"use client";

import {
  DISPATCH_ACTION,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { LoaderCircle, RefreshCw } from "lucide-react";

type PayPalCheckoutButtonProps = {
  createOrder: () => Promise<string>;
  captureOrder: (orderId: string) => Promise<void>;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
};

export function PayPalCheckoutButton({
  createOrder,
  captureOrder,
  onSuccess,
  onCancel,
  onError,
}: PayPalCheckoutButtonProps) {
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
        label: "paypal",
        layout: "vertical",
        height: 48,
      }}
      createOrder={async () => {
        return createOrder();
      }}
      onApprove={async (data) => {
        await captureOrder(data.orderID);
        onSuccess?.(data.orderID);
      }}
      onCancel={() => {
        onCancel?.();
      }}
      onError={(error) => {
        onError?.(error);
      }}
    />
  );
}
