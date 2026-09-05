import React from 'react';
import { ProfileMeta } from '@/components/common/metadata';
import BannerTitleComponent from '@/components/common/banner-title';

const PrivacyPolicy = () => {
  return (
    <div className="w-full text-zinc-200">
      <ProfileMeta
        title="Privacy Policy"
        description="How Jeff92 & Ayan Sumania collects, uses, and protects your personal information."
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
          {/* Jeff92 & Ayan Sumania Label */}
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
              Jeff92 & Ayan Sumania Legal
            </span>
          </div>

          <BannerTitleComponent
            title="Privacy Policy"
            description="Your privacy and data protection are important to us."
          />
        </div>
      </section>

      {/* =========================================================
          PRIVACY POLICY
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
            left-[-150px]
            top-[-200px]
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#B9FF00]/[0.025]
            blur-[120px]
          "
        />

        <div className="relative px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* Last Updated */}
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B9FF00]/70" />

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
            >
              Last Updated: January 2026
            </p>
          </div>

          {/* =====================================================
              01
          ====================================================== */}
          <div className="group border-b border-white/10 pb-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                01
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Information We Collect
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  We may collect personal information such as your name, email
                  address, billing details, account credentials, and transaction
                  records. We also collect non-personal data such as IP address,
                  browser type, and usage analytics.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              02
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                02
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  How We Use Information
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Information is used to operate the platform, process payments,
                  provide customer support, prevent fraud, and improve our
                  services.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              03
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                03
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Payment Processing
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Payments are securely processed by third-party payment
                  providers such as PayPal. Jeff92 & Ayan Sumania does not store full
                  payment card information.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              04
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                04
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Cookies & Tracking
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  We use cookies and similar technologies to maintain sessions,
                  analyze usage, and improve user experience. You may disable
                  cookies in your browser settings.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              05
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                05
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Data Sharing
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  We do not sell your personal data. Information may be shared
                  only with trusted service providers, legal authorities, or in
                  the event of a business transfer.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              06
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                06
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Data Security
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Reasonable administrative and technical safeguards are
                  implemented to protect your data. However, no system is
                  completely secure.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              07
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                07
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Data Retention
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Personal data is retained only as long as necessary for legal,
                  operational, or contractual purposes.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              08
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                08
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Children&apos;s Privacy
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  Jeff92 & Ayan Sumania does not knowingly collect data from individuals
                  under 18. If such data is discovered, it will be removed
                  promptly.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              09
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                09
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Your Rights
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  You may request access, correction, or deletion of your
                  personal data by contacting us.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              10
          ====================================================== */}
          <div className="group border-b border-white/10 py-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                10
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Policy Updates
                </h2>

                <p className="max-w-4xl text-sm leading-7 text-zinc-400">
                  This Privacy Policy may be updated at any time. Continued use
                  of the Service constitutes acceptance of changes.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              11 CONTACT
          ====================================================== */}
          <div className="pt-8">
            <div className="flex items-start gap-4">
              <span
                className="
                  pt-1
                  text-[10px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#B9FF00]
                "
              >
                11
              </span>

              <div className="flex-1">
                <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-100">
                  Contact Us
                </h2>

                <p className="mb-5 max-w-4xl text-sm leading-7 text-zinc-400">
                  If you have questions regarding this Privacy Policy or your
                  personal information, you may contact Jeff92 & Ayan Sumania using the
                  information below.
                </p>

                {/* Contact Box */}
                <div
                  className="
                    max-w-xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.025]
                  "
                >
                  {/* Email */}
                  <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4">
                    <span
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-zinc-600
                      "
                    >
                      Email
                    </span>

                    <a
                      href="mailto:music@jeff92ayansumania.com"
                      className="
                        text-sm
                        font-medium
                        text-zinc-200
                        transition-colors
                        hover:text-[#B9FF00]
                      "
                    >
                      music@jeff92ayansumania.com
                    </a>
                  </div>

                  {/* Website */}
                  <div className="flex flex-col gap-1 px-5 py-4">
                    <span
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-zinc-600
                      "
                    >
                      Website
                    </span>

                    <a
                      href="https://www.jeff92ayansumania.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        text-sm
                        font-medium
                        text-zinc-200
                        transition-colors
                        hover:text-[#B9FF00]
                      "
                    >
                      www.jeff92ayansumania.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
