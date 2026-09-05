import { ProfileMeta } from "@/components/common/metadata";
import MainLayout from "@/components/layout/main-layout";
import ChartsComponent from "@/components/pages/charts/new-chart";

export default function ChartPage() {

  return (
    <>
    <ProfileMeta
      title={"Music Charts for Genres & Tags"}
      description="Explore DJ edits, remixes, and tracks across multiple music genres and DJ tags including House, EDM, Hip Hop, Afro, Latin, Mashups, Transitions, Acapellas, Throwbacks, and more. Curated for DJs, parties, and live performances."
      image="/images/jeff92-ayan-brand-logo.svg"
      url="https://www.jeff92ayansumania.com/charts"
      type="profile"
    />
    <MainLayout>
      {/* <GenresComponent/> */}
      <ChartsComponent/>
    </MainLayout>
    </>
  );
}
