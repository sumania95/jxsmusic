import React from 'react';
import { ProfileMeta } from '@/components/common/metadata';
import BannerTitleComponent from '@/components/common/banner-title';
import {
  AlertTriangle,
  BookOpen,
  Copyright,
  FileWarning,
  Gavel,
  Info,
  RefreshCcw,
  Scale,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';


const TermsOfService = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* SEO & Meta */}
      <ProfileMeta
        title="Terms and Conditions"
        description="Our Terms and Conditions for DJs, editors, and music creators using our platform."
      />

      {/* =====================================================
          HEADER
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
              Jeff92 & Ayan Sumania Legal
            </span>
          </div>

          <BannerTitleComponent
            title="Terms and Conditions"
            description="Understand the rules and guidelines for uploading and sharing your DJ edits and original music. By using our platform, you agree to these terms."
          />
        </div>
      </section>

      {/* =====================================================
          NOTICE
      ===================================================== */}
      <section
        className="
          rounded-2xl
          border
          border-[#B9FF00]/10
          bg-[#B9FF00]/[0.025]
          p-4
          sm:p-5
        "
      >
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
              bg-[#B9FF00]/10
              text-[#B9FF00]
            "
          >
            <Info className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Important Legal Notice
            </h3>

            <p className="mt-1 text-xs leading-6 text-zinc-500">
              Please read these Terms and Conditions carefully before using
              Jeff92 & Ayan Sumania. By registering, accessing, or using the Service, you
              agree to be bound by this Agreement.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TERMS
      ===================================================== */}
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
        "
      >
        <div className="border-b border-white/[0.06] px-4 py-4 sm:px-6">
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
              <BookOpen className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Terms of Service
              </h3>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Rules governing use of the Jeff92 & Ayan Sumania platform
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3 sm:p-5">
          <TermsSection
            icon={ShieldCheck}
            title="Acceptance of Terms and Conditions"
          >
            <p>
              This User Agreement (“Agreement”) is a legal and binding agreement
              between you (“You,” “Your,” “Yourself,” or “User”) and
              <strong className="text-zinc-200"> Jeff92 & Ayan Sumania </strong>
              (“We,” “Us,” or “Our”) governing your use of the Jeff92 & Ayan Sumania website,
              content, services, and related offerings (collectively, the
              “Service”).
            </p>

            <p>
              <strong className="text-zinc-200">
                PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING THE SERVICE.
              </strong>{' '}
              By registering, accessing, or using the Service in any manner, you
              acknowledge that you have read, understood, and agreed to be bound
              by these Terms and Conditions. If you do not agree, you must
              discontinue use immediately.
            </p>
          </TermsSection>

          <TermsSection
            icon={UserCheck}
            title="Registration Obligations"
          >
            <p>
              You agree to provide accurate, current, and complete information
              during registration. You are responsible for maintaining the
              confidentiality of your login credentials and for all activity
              under your account.
            </p>

            <p>
              You certify that you are a working professional DJ and that all
              submitted information is truthful. Jeff92 & Ayan Sumania reserves the right to
              verify applications and deny access if information is inaccurate
              or unverifiable.
            </p>
          </TermsSection>

          <TermsSection
            icon={Copyright}
            title="Content Usage & Copyright"
          >
            <p>
              All copyrights in sound recordings and musical works remain the
              property of their respective owners. You acknowledge that you
              already possess the original material used in any remix or mashup
              accessed through Jeff92 & Ayan Sumania.
            </p>

            <p>
              Content is provided strictly for professional DJ performance and
              promotional use in closed-circuit or public performance settings
              only. Redistribution, resale, duplication, or unauthorized use is
              strictly prohibited.
            </p>
          </TermsSection>

          <TermsSection
            icon={Copyright}
            title="Intellectual Property"
          >
            <p>
              All website content, logos, graphics, and software are owned by
              Jeff92 & Ayan Sumania or its licensors. No rights are transferred to you except
              limited access for personal, professional use.
            </p>
          </TermsSection>

          <TermsSection
            icon={FileWarning}
            title="DMCA & Copyright Infringement"
          >
            <p>
              Jeff92 & Ayan Sumania complies fully with the Digital Millennium Copyright Act
              (DMCA). Copyright holders may submit a proper DMCA Notice to:
            </p>

            <a
              href="mailto:dmca@jeff92ayansumania.com"
              className="
                inline-flex
                rounded-lg
                border
                border-[#B9FF00]/10
                bg-[#B9FF00]/[0.04]
                px-3
                py-2
                text-xs
                font-medium
                text-[#B9FF00]
                transition-colors
                hover:bg-[#B9FF00]/[0.08]
              "
            >
              dmca@jeff92ayansumania.com
            </a>

            <p>
              Upon valid notice, infringing content will be removed and
              offending accounts may be terminated.
            </p>
          </TermsSection>

          <TermsSection
            icon={AlertTriangle}
            title="Content Posting Rules"
          >
            <p>
              Users may submit links to mixes or remixes they own or have rights
              to. Posting content you do not own or falsely claiming ownership
              is strictly prohibited and may result in termination.
            </p>
          </TermsSection>

          <TermsSection
            icon={ShieldCheck}
            title="Termination"
          >
            <p>
              Jeff92 & Ayan Sumania may suspend or terminate your access at any time for
              violation of these Terms or applicable laws. You may terminate
              your account by discontinuing use of the Service.
            </p>
          </TermsSection>

          <TermsSection
            icon={RefreshCcw}
            title="Service Availability"
          >
            <p>
              The Service is provided “AS IS” and “AS AVAILABLE.” Jeff92 & Ayan Sumania does
              not guarantee uninterrupted access or error-free operation.
            </p>
          </TermsSection>

          <TermsSection
            icon={Scale}
            title="Limitation of Liability"
          >
            <p>
              To the maximum extent permitted by law, Jeff92 & Ayan Sumania shall not be
              liable for any indirect, incidental, consequential, or punitive
              damages arising from use of the Service.
            </p>
          </TermsSection>

          <TermsSection
            icon={ShieldCheck}
            title="Indemnification"
          >
            <p>
              You agree to indemnify and hold harmless Jeff92 & Ayan Sumania from any claims,
              damages, or expenses arising from your use of the Service or
              violation of these Terms.
            </p>
          </TermsSection>

          <TermsSection
            icon={Gavel}
            title="Governing Law"
          >
            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of the{' '}
              <strong className="text-zinc-200">
                Republic of the Philippines
              </strong>
              , without regard to its conflict of law principles. Any disputes
              arising out of or in connection with these Terms shall be subject
              to the exclusive jurisdiction of the competent courts of the
              Philippines.
            </p>
          </TermsSection>

          <TermsSection
            icon={RefreshCcw}
            title="Refund Policy"
          >
            <p>
              Due to the nature of digital products, all sales are final. No
              refunds are offered. If you experience download issues, please
              contact support for assistance.
            </p>
          </TermsSection>
        </div>
      </section>
    </div>
  );
};


export default TermsOfService;


/* =========================================================
   TERMS SECTION
========================================================= */

const TermsSection = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <article
      className="
        rounded-2xl
        border
        border-white/[0.05]
        bg-white/[0.015]
        p-4
        transition-colors
        hover:border-white/[0.08]
        hover:bg-white/[0.02]
        sm:p-5
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/[0.06]
            bg-white/[0.025]
            text-zinc-600
          "
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-zinc-200">
            {title}
          </h2>

          <div
            className="
              mt-3
              space-y-3
              text-xs
              leading-6
              text-zinc-500
              sm:text-sm
              sm:leading-7
            "
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
};