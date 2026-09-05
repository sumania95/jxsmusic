import MainLayout from "@/components/layout/main-layout";
import UploaderGuideDashboard from "@/components/pages/restricted/editor";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function Uploader() {

  return (
    <MainLayout>
      <UploaderGuideDashboard/>
    </MainLayout>
  );
}
