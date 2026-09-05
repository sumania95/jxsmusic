import React from 'react'
import { ProfileMeta } from '@/components/common/metadata'
import BannerTitleComponent from '@/components/common/banner-title'
import {
  BadgeCheck,
  CheckCircle,
  CreditCard,
  Download,
  HelpCircle,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from 'lucide-react'


const HowToBuyComponent = () => {
  const steps = [
    {
      title: 'Browse Products',
      description:
        'Visitors may freely browse available digital DJ content on Jeff92 & Ayan Sumania. Each product includes a description, preview, and price.',
      icon: ReceiptText,
    },
    {
      title: 'Login or Create an Account',
      description:
        'To protect digital content and prevent unauthorized access, users must log in or create an account before adding items to the cart.',
      icon: UserRound,
    },
    {
      title: 'Add to Cart',
      description:
        'Once logged in, users may add selected digital products to their shopping cart.',
      icon: ShoppingCart,
    },
    {
      title: 'Review Order',
      description:
        'Users can review selected items, prices, discounts (if any), and total cost before proceeding to payment.',
      icon: BadgeCheck,
    },
    {
      title: 'Secure Checkout',
      description:
        'Users are redirected to a secure payment page powered by PayPal or its authorized payment partners to complete the transaction.',
      icon: CreditCard,
    },
    {
      title: 'Payment Confirmation',
      description:
        'After successful payment, the order is confirmed automatically.',
      icon: ShieldCheck,
    },
    {
      title: 'Access Digital Content',
      description:
        'Purchased digital products become available in the user’s Jeff92 & Ayan Sumania account for download immediately after payment confirmation.',
      icon: Download,
    },
  ]


  return (
    <div className="w-full">
      <ProfileMeta
        title="How to Buy"
        description="Learn how to purchase digital DJ content on Jeff92 & Ayan Sumania using secure payment processing."
      />


      <div className="flex w-full flex-col gap-6">
        {/* HEADER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 px-5 py-8 sm:px-8 lg:px-10">
          {/* Ambient glow */}
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
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Jeff92 & Ayan Sumania How It Works
              </span>
            </div>

            <BannerTitleComponent
              title="How to Buy"
              description="A simple step-by-step guide to purchasing digital products on Jeff92 & Ayan Sumania."
            />
          </div>
        </section>
        


        {/* INTRO */}
        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            p-5
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              right-[-120px]
              top-[-140px]
              h-[300px]
              w-[300px]
              rounded-full
              bg-[#B9FF00]/[0.035]
              blur-[100px]
            "
          />

          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B9FF00]
                  shadow-[0_0_8px_rgba(185,255,0,0.7)]
                "
              />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Jeff92 & Ayan Sumania Store
              </span>
            </div>

            <p className="text-sm leading-7 text-zinc-500">
              Jeff92 & Ayan Sumania is a digital platform offering downloadable DJ edits,
              remixes, and music content. All products available on this website
              are digital goods intended for personal or professional DJ use.
            </p>

            <p className="text-sm leading-7 text-zinc-500">
              Product details, previews, and prices are publicly visible on
              Jeff92 & Ayan Sumania. Prices are displayed clearly in{' '}
              <strong className="font-semibold text-zinc-300">
                US Dollar (USD)
              </strong>{' '}
              before checkout.
            </p>
          </div>
        </section>


        {/* STEP BY STEP */}
        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/[0.06]
              px-4
              py-4
              sm:px-5
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#B9FF00]
                    shadow-[0_0_8px_rgba(185,255,0,0.7)]
                  "
                />

                <h2 className="text-sm font-semibold text-zinc-100">
                  Step-by-Step Purchase Process
                </h2>
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                From browsing to download
              </p>
            </div>

            <span
              className="
                rounded-full
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-3
                py-1
                text-[10px]
                font-medium
                text-zinc-500
              "
            >
              {steps.length} Steps
            </span>
          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-3
              p-3
              md:grid-cols-2
              sm:p-4
            "
          >
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.05]
                    bg-white/[0.015]
                    p-4
                    transition-all
                    duration-200
                    hover:border-[#B9FF00]/15
                    hover:bg-white/[0.025]
                  "
                >
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-8
                      w-0.5
                      -translate-y-1/2
                      rounded-full
                      bg-[#B9FF00]
                      opacity-0
                      shadow-[0_0_8px_rgba(185,255,0,0.35)]
                      transition-opacity
                      group-hover:opacity-100
                    "
                  />

                  <div className="flex items-start gap-3">
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
                        border-white/[0.06]
                        bg-white/[0.025]
                        text-zinc-600
                        transition-all
                        group-hover:border-[#B9FF00]/15
                        group-hover:bg-[#B9FF00]/[0.06]
                        group-hover:text-[#B9FF00]
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#B9FF00]
                          "
                        >
                          Step {index + 1}
                        </span>

                        <span className="h-px w-5 bg-white/[0.08]" />
                      </div>

                      <h3 className="text-sm font-semibold text-zinc-200">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-zinc-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>


        {/* INFORMATION GRID */}
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* PAYMENT */}
          <InfoPanel
            icon={CreditCard}
            title="Payment Information"
          >
            All payments on Jeff92 & Ayan Sumania are securely processed by third-party
            payment providers such as{' '}
            <strong className="text-zinc-300">
              PayPal
            </strong>.
            Jeff92 & Ayan Sumania does not store full credit or debit card details on its
            servers.
          </InfoPanel>


          {/* REFUND */}
          <InfoPanel
            icon={ReceiptText}
            title="Refund Policy"
          >
            Jeff92 & Ayan Sumania provides digital products only. Due to the nature of
            digital goods, all sales are final unless otherwise required by
            applicable law. Please review our Refund Policy before making a
            purchase.
          </InfoPanel>


          {/* BUSINESS */}
          <InfoPanel
            icon={ShieldCheck}
            title="Business Information"
          >
            <div className="space-y-1">
              <p>
                <strong className="text-zinc-300">
                  Business Name:
                </strong>{' '}
                Jeff92 & Ayan Sumania
              </p>

              <p>
                <strong className="text-zinc-300">
                  Business Location:
                </strong>{' '}
                Philippines
              </p>
            </div>
          </InfoPanel>


          {/* HELP */}
          <InfoPanel
            icon={HelpCircle}
            title="Need Help?"
          >
            <p>
              If you have questions regarding purchases or payments, please
              contact us:
            </p>

            <p className="mt-2">
              <strong className="text-zinc-300">
                Email:
              </strong>{' '}
              <a
                href="mailto:music@jeff92ayansumania.com"
                className="
                  font-medium
                  text-[#B9FF00]
                  transition-colors
                  hover:text-[#B9FF00]
                "
              >
                music@jeff92ayansumania.com
              </a>
            </p>
          </InfoPanel>
        </section>
      </div>
    </div>
  )
}


const InfoPanel = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) => {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.025]
        p-5
      "
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#B9FF00]/10
            text-[#B9FF00]
          "
        >
          <Icon className="h-4 w-4" />
        </div>

        <h2 className="text-sm font-semibold text-zinc-100">
          {title}
        </h2>
      </div>

      <div className="text-xs leading-6 text-zinc-500">
        {children}
      </div>
    </div>
  )
}


export default HowToBuyComponent