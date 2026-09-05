import MainLayout from "@/components/layout/main-layout";
import ArtistPressKit from "@/components/pages/presskit/artist-presskit";

export default function AyanSumaniaPressKit() {
  return <MainLayout><ArtistPressKit
    name="Ayan Sumania"
    role="DJ · Audio & Video Remix Editor"
    location="Philippines"
    bio="Ayan Sumania is a DJ and remix editor whose collaborative work with Jeff92 focuses on high-energy, dancefloor-ready audio and video edits. The catalog is built around clean transitions, professional arrangements and flexible versions for club, mobile and video DJs."
    styles={["Open Format", "Audio Edits", "Video Edits", "Mashups", "Club Versions", "Dancefloor Remixes"]}
    links={[{ label: "Joint remix page", href: "https://www.facebook.com/Jeff92xSumaniaAudioVideoRemixes/" }, { label: "Editor catalog", href: "https://app.crooklynclan.net/editors/jeff92-%26-ayan-sumania" }]}
  /></MainLayout>;
}
