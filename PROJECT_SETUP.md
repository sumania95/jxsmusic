# Jeff92 & Ayan Sumania deployment setup

## Store rules

- Currency: USD
- Checkout provider: PayPal only
- Subscription: $200 USD per month, recurring
- Monthly allowance: 120 downloads per billing cycle
- Included: individual audio edits and individual video edits
- Excluded: packs, which require a separate one-time PayPal purchase

## PayPal configuration

Create a PayPal REST app and a recurring PayPal Product/Plan priced at `$200.00 USD` per month. Add its plan identifier and credentials to the deployment environment:

- `PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (same PayPal app client ID; safe for the browser SDK)
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_MONTHLY_PLAN_ID`
- `PAYPAL_ENVIRONMENT` (`sandbox` or `live`)
- `NEXT_PUBLIC_APP_URL` (the production site origin)

Register `https://YOUR_DOMAIN/api/paypal/webhook` in PayPal and enable:

- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.SALE.COMPLETED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.SUSPENDED`

After changing `prisma/schema.prisma`, run `npm run db:push` for this migration-free project.

Admins can verify or create the remote recurring plan under **Back Office → PayPal Plan**. If a plan is created there, copy the displayed PayPal plan ID into `PAYPAL_MONTHLY_PLAN_ID` as a deployment backup; the running database uses the connected plan immediately.

Subscription customer email markup lives in `src/server/email/subscription-emails.ts`. Activation, monthly renewal, cancellation, and suspension emails are sent from the verified PayPal webhook without blocking webhook settlement when email delivery fails.
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `PAYMENT.SALE.COMPLETED`

The app creates or updates its single `All-Access Monthly` database plan automatically from `PAYPAL_MONTHLY_PLAN_ID`. Store prices are integer cents, so `$200.00` is `20000`.

## Database and deployment

1. Copy `.env.example` into the deployment provider and fill every value.
2. Install dependencies with `npm ci`.
3. Create or synchronize the database directly from `prisma/schema.prisma` with `npm run db:push`.
4. Generate the Prisma client with `npm run db:generate`.
5. Build with `npm run build` and start with `npm start`.

This clean project intentionally has no migration history. Use `db:push` only for a new database or after reviewing changes against an existing database.

Use PayPal sandbox credentials and a sandbox buyer account for end-to-end checkout testing before switching `PAYPAL_ENVIRONMENT` to `live`.
