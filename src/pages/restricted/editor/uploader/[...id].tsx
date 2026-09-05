import MainLayout from "@/components/layout/main-layout";
import TrackUploaderComponentForm from "@/components/pages/restricted/editor/uploader/helper/new-update-form";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function Published() {
  return (
     <MainLayout>
        <TrackUploaderComponentForm/>
      </MainLayout>
  );
}