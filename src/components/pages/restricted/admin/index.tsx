import BannerTitleComponent from "@/components/common/banner-title";
import { ProfileMeta } from "@/components/common/metadata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import React from "react";

import AdminPublishedComponent from "./tracks";
import AdminTagData from "./tags";
import AdminGenreData from "./genre";
import AdminWebhookData from "./webhook";
import AdminUserRequestData from "./request";
import AdminReviews from "./reviews";
import AdminBookings from "./bookings";

import {
  FileQuestion,
  Music2,
  Tags,
  Webhook,
  Layers3,
  Star,
  CalendarDays,
} from "lucide-react";

const AdminDataComponent = () => {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "1",
  });

  return (
    <div className="flex w-full flex-col gap-5">
      <ProfileMeta
        title="Administration Section"
        description="Admin management section"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute top-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#B9FF00]/[0.035] blur-[100px]" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9FF00] shadow-[0_0_10px_rgba(185,255,0,0.7)]" />

            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
              Jeff92 & Ayan Sumania Administration
            </span>
          </div>

          <BannerTitleComponent
            title="Administration Section"
            description="Manage tracks, metadata, users, orders, requests, coupons, and system integrations."
          />
        </div>
      </section>

      {/* =====================================================
          ADMIN TABS
      ===================================================== */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {/* NAVIGATION */}
          <div className="border-b border-white/[0.06] p-3 sm:p-4">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1.5 rounded-2xl border border-white/[0.06] bg-[#111518]/20 p-1 sm:grid-cols-4 xl:grid-cols-10">
              <AdminTab value="1" icon={Music2} label="Tracks" />

              <AdminTab value="2" icon={Layers3} label="Genres" />

              <AdminTab value="3" icon={Tags} label="Tags" />

              <AdminTab value="7" icon={FileQuestion} label="Request" />

              <AdminTab value="5" icon={Webhook} label="Webhook" />
              <AdminTab value="10" icon={Star} label="Reviews" />
              <AdminTab value="11" icon={CalendarDays} label="Bookings" />
            </TabsList>
          </div>

          {/* TRACKS */}
          <TabsContent value="1" className="m-0 p-3 sm:p-4">
            <AdminPublishedComponent />
          </TabsContent>

          {/* GENRES */}
          <TabsContent value="2" className="m-0 p-3 sm:p-4">
            <AdminGenreData />
          </TabsContent>

          {/* TAGS */}
          <TabsContent value="3" className="m-0 p-3 sm:p-4">
            <AdminTagData />
          </TabsContent>

          {/* REQUEST */}
          <TabsContent value="7" className="m-0 p-3 sm:p-4">
            <AdminUserRequestData />
          </TabsContent>

          {/* WEBHOOK */}
          <TabsContent value="5" className="m-0 p-3 sm:p-4">
            <AdminWebhookData />
          </TabsContent>
          <TabsContent value="10" className="m-0 p-3 sm:p-4">
            <AdminReviews />
          </TabsContent>
          <TabsContent value="11" className="m-0 p-3 sm:p-4"><AdminBookings /></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminDataComponent;

/* =========================================================
   ADMIN TAB
========================================================= */

type AdminTabProps = {
  value: string;
  icon: React.ElementType;
  label: string;
};

const AdminTab = ({ value, icon: Icon, label }: AdminTabProps) => {
  return (
    <TabsTrigger
      value={value}
      className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-[9px] font-medium text-zinc-500 transition-all hover:bg-white/[0.04] hover:text-zinc-200 data-[state=active]:bg-[#B9FF00] data-[state=active]:text-black data-[state=active]:shadow-none sm:text-[10px] lg:px-3"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />

      <span className="truncate">{label}</span>
    </TabsTrigger>
  );
};
