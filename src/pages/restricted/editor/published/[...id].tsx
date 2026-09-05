import MainLayout from "@/components/layout/main-layout";
import TrackUpdateReleasesComponentForm from "@/components/pages/restricted/editor/published/helper/new-update-form";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function Published() {
  return (
     <MainLayout>
        <TrackUpdateReleasesComponentForm/>
      </MainLayout>
  );
}