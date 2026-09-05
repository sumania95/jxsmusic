"use client";

import type { ReactNode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function PayPalCheckoutProvider({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        dataNamespace: "paypalCheckout",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}

export function PayPalSubscriptionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "subscription",
        vault: true,
        components: "buttons",
        dataNamespace: "paypalSubscription",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
