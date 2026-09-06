import { env } from "@/env";

const apiBase =
  env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken() {
  const credentials = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error("Unable to authenticate with PayPal");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

type PayPalOrder = {
  id: string;
  links: Array<{ href: string; rel: string; method: string }>;
};

export async function createPayPalOrder(input: {
  referenceId: string;
  amountInCents: number;
  currency: string;
  requestId?: string;
}) {
  const token = await getPayPalAccessToken();
  const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const response = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": input.requestId ?? input.referenceId,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.referenceId,
          custom_id: input.referenceId,
          description: "Jeff92 & Ayan Sumania DJ edits",
          amount: {
            currency_code: input.currency,
            value: (input.amountInCents / 100).toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Jeff92 & Ayan Sumania",
            user_action: "PAY_NOW",
            return_url: `${appUrl}/api/paypal/capture`,
            cancel_url: `${appUrl}/my-orders?payment=cancelled`,
          },
        },
      },
    }),
  });
  if (!response.ok)
    throw new Error(`PayPal order creation failed (${response.status})`);
  return (await response.json()) as PayPalOrder;
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();
  const response = await fetch(
    `${apiBase}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `${orderId}-capture`,
      },
      body: "{}",
    },
  );
  const data = (await response.json()) as { status?: string };
  if (!response.ok)
    throw new Error(`PayPal capture failed (${response.status})`);
  return data;
}

export type PayPalSubscription = {
  id: string;
  status: string;
  plan_id: string;
  custom_id?: string;
  billing_info?: { next_billing_time?: string };
  links: Array<{ href: string; rel: string; method: string }>;
};

export async function getPayPalSubscription(subscriptionId: string) {
  const token = await getPayPalAccessToken();
  const response = await fetch(
    `${apiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok)
    throw new Error(
      `Unable to verify PayPal subscription (${response.status})`,
    );
  return (await response.json()) as PayPalSubscription;
}

export async function cancelPayPalSubscription(subscriptionId: string) {
  const token = await getPayPalAccessToken();
  const response = await fetch(
    `${apiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: "Cancelled by customer" }),
    },
  );
  if (!response.ok && response.status !== 204) {
    throw new Error(
      `PayPal subscription cancellation failed (${response.status})`,
    );
  }
}

export type PayPalBillingPlan = {
  id: string;
  product_id: string;
  name: string;
  status: string;
};

export async function getPayPalBillingPlan(planId: string) {
  const token = await getPayPalAccessToken();
  const response = await fetch(
    `${apiBase}/v1/billing/plans/${encodeURIComponent(planId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error(`Unable to read PayPal plan (${response.status})`);
  return (await response.json()) as PayPalBillingPlan;
}

export async function createPayPalMonthlyPlan() {
  const token = await getPayPalAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const productResponse = await fetch(`${apiBase}/v1/catalogs/products`, {
    method: "POST",
    headers: { ...headers, "PayPal-Request-Id": crypto.randomUUID() },
    body: JSON.stringify({
      name: "Jeff92 & Ayan Sumania All-Access",
      description: "Monthly access to individual audio and video DJ edits.",
      type: "DIGITAL",
    }),
  });
  if (!productResponse.ok)
    throw new Error(
      `PayPal product creation failed (${productResponse.status})`,
    );
  const product = (await productResponse.json()) as { id: string };

  const planResponse = await fetch(`${apiBase}/v1/billing/plans`, {
    method: "POST",
    headers: { ...headers, "PayPal-Request-Id": crypto.randomUUID() },
    body: JSON.stringify({
      product_id: product.id,
      name: "All-Access Monthly — 120 Downloads",
      description: "120 downloads per monthly billing cycle. Packs excluded.",
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: "200.00", currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 1,
      },
    }),
  });
  if (!planResponse.ok)
    throw new Error(`PayPal plan creation failed (${planResponse.status})`);
  const plan = (await planResponse.json()) as PayPalBillingPlan;
  return { productId: product.id, plan };
}
type PayPalHeaders = Record<
  string,
  string | string[] | undefined
>;

function getHeader(
  headers: PayPalHeaders,
  name: string,
): string | undefined {
  const value = headers[name.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function verifyPayPalWebhook(
  headers: PayPalHeaders,
  webhookEvent: unknown,
): Promise<boolean> {
  const authAlgo = getHeader(
    headers,
    "paypal-auth-algo",
  );

  const certUrl = getHeader(
    headers,
    "paypal-cert-url",
  );

  const transmissionId = getHeader(
    headers,
    "paypal-transmission-id",
  );

  const transmissionSignature = getHeader(
    headers,
    "paypal-transmission-sig",
  );

  const transmissionTime = getHeader(
    headers,
    "paypal-transmission-time",
  );

  const webhookId =
    env.PAYPAL_WEBHOOK_ID.trim();

  const missing = {
    authAlgo: !authAlgo,
    certUrl: !certUrl,
    transmissionId: !transmissionId,
    transmissionSignature:
      !transmissionSignature,
    transmissionTime: !transmissionTime,
    webhookId: !webhookId,
  };

  if (Object.values(missing).some(Boolean)) {
    console.error(
      "Missing PayPal verification data",
      missing,
    );

    return false;
  }

  try {
    const token =
      await getPayPalAccessToken();

    const response = await fetch(
      `${apiBase}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig:
            transmissionSignature,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: webhookEvent,
        }),
      },
    );

    const responseText =
      await response.text();

    let result: {
      verification_status?: string;
      name?: string;
      message?: string;
      debug_id?: string;
    };

    try {
      result = JSON.parse(responseText) as {
        verification_status?: string;
        name?: string;
        message?: string;
        debug_id?: string;
      };
    } catch {
      console.error(
        "PayPal returned invalid JSON",
        {
          httpStatus: response.status,
          response: responseText.slice(0, 300),
        },
      );

      return false;
    }

    console.log(
      "PayPal webhook verification result",
      {
        httpStatus: response.status,
        verificationStatus:
          result.verification_status,
        errorName: result.name,
        errorMessage: result.message,
        debugId: result.debug_id,
        apiBase,
        webhookIdLength: webhookId.length,
        webhookIdSuffix:
          webhookId.slice(-6),
      },
    );

    return (
      response.ok &&
      result.verification_status ===
        "SUCCESS"
    );
  } catch (error) {
    console.error(
      "PayPal verification request failed",
      error,
    );

    return false;
  }
}