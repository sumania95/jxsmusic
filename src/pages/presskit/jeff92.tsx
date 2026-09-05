import MainLayout from "@/components/layout/main-layout";
import ArtistPressKit from "@/components/pages/presskit/artist-presskit";

export default function Jeff92PressKit() {
  return <MainLayout><ArtistPressKit
    name="DJ Jeff92"
    role="Open Format DJ · Professional Remix Editor"
    location="Surigao del Norte, Philippines"
    bio="DJ Jeff92 is an open-format DJ and professional remix editor known for crowd-moving club performances and DJ-ready arrangements. His work spans audio edits, video edits, mashups, extended versions and genre-blending remixes created for working DJs."
    styles={["Open Format", "Nu Disco", "House", "Hip-Hop", "OPM", "Club Edits"]}
    links={[{ label: "Instagram", href: "https://www.instagram.com/djjeff92/" }, { label: "YouTube", href: "https://www.youtube.com/@DJJeff92_Official" }, { label: "Bandcamp", href: "https://djjeff92.bandcamp.com/" }]}
  /></MainLayout>;
}
