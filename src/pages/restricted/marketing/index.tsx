import type { GetServerSideProps } from "next";
import { render } from "react-email";

import MainLayout from "@/components/layout/main-layout";
import MarketingDataComponent from "@/components/pages/restricted/marketing";
import { WeeklyUploadEmail } from "@/components/email/weekly-template";
import { requireAdmin } from "@/server/authmiddleware";

type AdminPageProps = {
  emailHtml: string;
};

export const getServerSideProps = requireAdmin(async () => {
  const emailHtml = await render(
    <WeeklyUploadEmail
      customerName="Alex"
      trackCount={14}
      latestTracks={[
        {
          id: "track-1",
          title: "Midnight Drive",
          artistName: "Alex",
          trackUrl: "https://example.com/tracks/track-1",
          uploadedAt: new Date(),
        },
        {
          id: "track-2",
          title: "Summer Lights",
          artistName: "Alex",
          trackUrl: "https://example.com/tracks/track-2",
          uploadedAt: new Date(),
        },
        {
          id: "track-3",
          title: "After Hours",
          artistName: "Alex",
          trackUrl: "https://example.com/tracks/track-3",
          uploadedAt: new Date(),
        },
      ]}
      dashboardUrl="https://example.com/tracks"
      preferencesUrl="https://example.com/settings/notifications"
    />,
  );

  return {
    props: {
      emailHtml,
    },
  };
});

export default function AdminPage({
  emailHtml,
}: AdminPageProps) {
  return (
    <MainLayout>
      <MarketingDataComponent emailHtml={emailHtml} />
    </MainLayout>
  );
}