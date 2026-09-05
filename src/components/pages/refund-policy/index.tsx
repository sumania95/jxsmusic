import React from 'react';
import { ProfileMeta } from '@/components/common/metadata';
import BannerTitleComponent from '@/components/common/banner-title';
import { CheckCircle } from 'lucide-react';

const HowToBuyComponent = () => {
  const steps = [
    {
      title: 'Step 1 – Browse Products',
      description:
        'Visitors may freely browse available digital DJ content on Jeff92 & Ayan Sumania. Each product includes a description, preview, and price.',
    },
    {
      title: 'Step 2 – Login or Create an Account',
      description:
        'To protect digital content and prevent unauthorized access, users must log in or create an account before adding items to the cart.',
    },
    {
      title: 'Step 3 – Add to Cart',
      description:
        'Once logged in, users may add selected digital products to their shopping cart.',
    },
    {
      title: 'Step 4 – Review Order',
      description:
        'Users can review selected items, prices, discounts (if any), and total cost before proceeding to payment.',
    },
    {
      title: 'Step 5 – Secure Checkout',
      description:
        'Users are redirected to a secure payment page powered by PayPal or its authorized payment partners to complete the transaction.',
    },
    {
      title: 'Step 6 – Payment Confirmation',
      description:
        'After successful payment, the order is confirmed automatically.',
    },
    {
      title: 'Step 7 – Access Digital Content',
      description:
        'Purchased digital products become available in the user’s Jeff92 & Ayan Sumania account for download immediately after payment confirmation.',
    },
  ];

  return (
    <div className="w-full text-zinc-200">
      {/* =========================================================
          SEO
      ========================================================== */}
      <ProfileMeta
        title="How to Buy"
        description="Learn how to purchase digital DJ content on Jeff92 & Ayan Sumania using secure payment processing."
      />

      {/* =========================================================
          JEFF92 & AYAN SUMANIA HEADER
      ========================================================== */}
      <section
        className="
          relative
          mb-8
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          px-5
          py-8
          sm:px-8
          lg:px-10
        "
      >
        {/* Ambient Glow */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-180px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#B9FF00]/[0.035]
            blur-[100px]
          "
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#B9FF00]
                shadow-[0_0_10px_rgba(185,255,0,0.7)]
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Jeff92 & Ayan Sumania Guide
            </span>
          </div>

          <BannerTitleComponent
            title="How to Buy"
            description="A simple step-by-step guide to purchasing digital products on Jeff92 & Ayan Sumania."
          />
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================== */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        {/* Ambient Glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-[-160px]
            top-[-200px]
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[120px]
          "
        />

        <div className="relative px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* =====================================================
              INTRODUCTION
          ====================================================== */}
          <div className="mb-10 max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#B9FF00]/70" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Purchasing on Jeff92 & Ayan Sumania
              </span>
            </div>

            <div className="space-y-4 text-sm leading-7 text-zinc-400">
              <p>
                Jeff92 & Ayan Sumania is a digital platform offering downloadable DJ edits,
                remixes, and music content. All products available on this
                website are digital goods intended for personal or professional
                DJ use.
              </p>

              <p>
                Product details, previews, and prices are publicly visible on
                Jeff92 & Ayan Sumania. Prices are displayed clearly in{' '}
                <strong className="font-semibold text-zinc-200">
                  US Dollar (USD)
                </strong>{' '}
                before checkout.
              </p>
            </div>
          </div>

          {/* =====================================================
              PURCHASE PROCESS
          ====================================================== */}
          <div className="border-t border-white/10 py-8">
            <div className="mb-6">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B9FF00]">
                Purchase Process
              </span>

              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Step-by-Step Purchase Process
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.015]
                    px-5
                    py-5
                    transition-all
                    duration-200
                    hover:border-[#B9FF00]/15
                    hover:bg-white/[0.025]
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      right-[-50px]
                      top-[-70px]
                      h-32
                      w-32
                      rounded-full
                      bg-[#B9FF00]/[0.025]
                      blur-[50px]
                    "
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-[#B9FF00]/15
                        bg-[#B9FF00]/[0.05]
                      "
                    >
                      <CheckCircle className="h-4 w-4 text-[#B9FF00]" />
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="h-px w-5 bg-white/10" />
                      </div>

                      <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                        {step.title}
                      </h3>

                      <p className="text-sm leading-6 text-zinc-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              PAYMENT INFORMATION
          ====================================================== */}
          <div className="border-t border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-[#B9FF00]">
                01
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Payment Information
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  All payments on Jeff92 & Ayan Sumania are securely processed by third-party
                  payment providers such as{' '}
                  <strong className="font-semibold text-zinc-200">
                    PayPal
                  </strong>
                  . Jeff92 & Ayan Sumania does not store full credit or debit card details on
                  its servers.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              REFUND POLICY
          ====================================================== */}
          <div className="border-t border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-[#B9FF00]">
                02
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Refund Policy
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Jeff92 & Ayan Sumania provides digital products only. Due to the nature of
                  digital goods, all sales are final unless otherwise required
                  by applicable law. Please review our Refund Policy before
                  making a purchase.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              BUSINESS INFORMATION
          ====================================================== */}
          <div className="border-t border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-[#B9FF00]">
                03
              </span>

              <div className="flex-1">
                <h2 className="mb-5 text-lg font-semibold tracking-tight text-zinc-100">
                  Business Information
                </h2>

                <div
                  className="
                    max-w-xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                  "
                >
                  <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                      Business Name
                    </span>

                    <span className="text-sm font-medium text-zinc-200">
                      Jeff92 & Ayan Sumania
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 px-5 py-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                      Business Location
                    </span>

                    <span className="text-sm font-medium text-zinc-200">
                      Philippines
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              NEED HELP
          ====================================================== */}
          <div className="border-t border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span className="pt-1 text-[10px] font-semibold tracking-[0.15em] text-[#B9FF00]">
                04
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Need Help?
                </h2>

                <p className="mb-5 max-w-4xl text-sm leading-7 text-zinc-400">
                  If you have questions regarding purchases or payments, please
                  contact us.
                </p>

                <div
                  className="
                    max-w-xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                  "
                >
                  <div className="flex flex-col gap-1 px-5 py-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                      Email
                    </span>

                    <a
                      href="mailto:music@jeff92ayansumania.com"
                      className="
                        text-sm
                        font-medium
                        text-zinc-200
                        transition-colors
                        duration-200
                        hover:text-[#B9FF00]
                      "
                    >
                      music@jeff92ayansumania.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FINAL NOTICE
          ====================================================== */}
          <div
            className="
              mt-2
              rounded-2xl
              border
              border-[#B9FF00]/20
              bg-[#B9FF00]/[0.035]
              px-5
              py-4
            "
          >
            <div className="flex items-start gap-3">
              <span
                className="
                  mt-2
                  h-1.5
                  w-1.5
                  shrink-0
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_10px_rgba(185,255,0,0.5)]
                "
              />

              <p className="text-sm leading-7 text-zinc-400">
                All Jeff92 & Ayan Sumania products are digital goods. Please review your
                selected products and order details carefully before completing
                payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToBuyComponent;