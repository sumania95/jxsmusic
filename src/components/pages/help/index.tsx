import React from "react";
import BannerTitleComponent from "@/components/common/banner-title";
import { ProfileMeta } from "@/components/common/metadata";
import {
  CircleHelp,
  Download,
  Headphones,
  KeyRound,
  Mail,
  ShoppingBag,
} from "lucide-react";


const HelpComponent = () => {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to the Forgot Password page and follow the instructions to reset your password.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact us via the Contact Us page or email music@jeff92ayansumania.com.",
    },
    {
      question: "Where can I view my purchases?",
      answer:
        "Your purchases can be viewed in your account dashboard under 'Orders'.",
    },
    {
      question: "What file formats are available for download?",
      answer:
        "All music tracks are provided in MP3 format at 320 kbps with complete metadata (title, artist, year, genre, key).",
    },
    {
      question: "Can I download my purchased tracks multiple times?",
      answer:
        "Yes, once a purchase is completed, you can download your tracks from your dashboard anytime.",
    },
    {
      question: "What if I have issues with my downloads?",
      answer:
        "If you encounter issues with downloading or corrupted files, please contact our support team via the Contact Us page.",
    },
  ];


  const faqIcons = [
    KeyRound,
    Mail,
    ShoppingBag,
    Headphones,
    Download,
    CircleHelp,
  ];


  return (
    <>
      <ProfileMeta
        title="Help"
        description="Customer support and FAQs for Jeff92 & Ayan Sumania"
      />

      <div className="flex w-full flex-col gap-6">

        {/* =====================================================
            JEFF92 & AYAN SUMANIA HEADER
        ===================================================== */}
        <section
          className="
            relative
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
                Jeff92 & Ayan Sumania Support
              </span>
            </div>

            <BannerTitleComponent
              title="Help"
              description="Find answers to common questions about using Jeff92 & Ayan Sumania as a customer"
            />
          </div>
        </section>


        {/* =====================================================
            FAQ SECTION
        ===================================================== */}
        <section
          className="
            w-full
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-white/[0.06]
              px-4
              py-4
              sm:px-5
            "
          >
            <div className="flex items-center gap-3">
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
                <CircleHelp className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Frequently Asked Questions
                </h3>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-zinc-600
                  "
                >
                  Common questions about Jeff92 & Ayan Sumania
                </p>
              </div>
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
              {faqs.length}
            </span>
          </div>


          {/* FAQ ITEMS */}
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
            {faqs.map((faq, idx) => {
              const Icon = faqIcons[idx] ?? CircleHelp;

              return (
                <div
                  key={idx}
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
                  {/* Hover accent */}
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
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-5 bg-white/[0.08]" />
                      </div>

                      <h4
                        className="
                          text-sm
                          font-semibold
                          leading-6
                          text-zinc-200
                        "
                      >
                        {faq.question}
                      </h4>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-6
                          text-zinc-500
                        "
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* =====================================================
            SUPPORT
        ===================================================== */}
        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[#B9FF00]/10
            bg-[#B9FF00]/[0.025]
            p-4
            sm:p-5
          "
        >
          {/* Glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-120px]
              h-[250px]
              w-[250px]
              rounded-full
              bg-[#B9FF00]/[0.04]
              blur-[80px]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B9FF00]/10
                  text-[#B9FF00]
                "
              >
                <Mail className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  Still need help?
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Contact the Jeff92 & Ayan Sumania support team for further assistance.
                </p>
              </div>
            </div>

            <a
              href="mailto:music@jeff92ayansumania.com"
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-xl
                bg-[#B9FF00]
                px-5
                text-xs
                font-semibold
                text-black
                transition-colors
                hover:bg-[#B9FF00]
              "
            >
              Contact Support
            </a>
          </div>
        </section>

      </div>
    </>
  );
};


export default HelpComponent;