// marketing-data-client.tsx

"use client";

import BannerTitleComponent from "@/components/common/banner-title";
import { ProfileMeta } from "@/components/common/metadata";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import type { ElementType } from "react";
import { IoMdDocument } from "react-icons/io";

type MarketingDataClientProps = {
  emailHtml: string;
};

export function MarketingDataClient({
  emailHtml,
}: MarketingDataClientProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "1",
  });

  return (
    <div className="flex w-full flex-col gap-5">
      <ProfileMeta
        title="Marketing Section"
        description="Marketing management section"
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -top-[180px] -right-[120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
              Jeff92 & Ayan Sumania Marketing
            </span>
          </div>

          <BannerTitleComponent
            title="Marketing Section"
            description="Manage emails."
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full"
        >
          <div className="border-b border-white/[0.06] p-3 sm:p-4">
            <TabsList className="flex h-auto w-full gap-1.5 rounded-2xl border border-white/[0.06] bg-[#111518]/20 p-1">
              <MarketingTab
                value="1"
                icon={IoMdDocument}
                label="Email Preview"
              />
            </TabsList>
          </div>

          <TabsContent value="1" className="m-0 p-3 sm:p-4">
            <div className="rounded-2xl bg-slate-100 p-4 sm:p-8">
              <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Weekly email preview
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Preview rendered using sample customer data.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        Desktop preview
                      </span>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    </div>

                    <iframe
                      title="Weekly upload email preview"
                      srcDoc={emailHtml}
                      sandbox=""
                      className="h-[850px] w-full border-0 bg-white"
                    />
                  </section>

                  <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-900">
                      Preview information
                    </h2>

                    <dl className="mt-5 space-y-4 text-sm">
                      <PreviewInfo
                        label="Subject"
                        value="You uploaded 14 tracks this week"
                      />

                      <PreviewInfo
                        label="Template"
                        value="Weekly upload report"
                      />

                      <PreviewInfo
                        label="Recipients"
                        value="Active weekly subscribers"
                      />
                    </dl>
                  </aside>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function PreviewInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-900">{value}</dd>
    </div>
  );
}

type MarketingTabProps = {
  value: string;
  icon: ElementType;
  label: string;
};

function MarketingTab({
  value,
  icon: Icon,
  label,
}: MarketingTabProps) {
  return (
    <TabsTrigger
      value={value}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 text-[9px] font-medium text-zinc-500 transition-all hover:bg-white/[0.04] hover:text-zinc-200 data-[state=active]:bg-[#B9FF00] data-[state=active]:text-black sm:text-[10px] lg:px-3"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </TabsTrigger>
  );
}