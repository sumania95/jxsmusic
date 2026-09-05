import MainLayout from "@/components/layout/main-layout";
import UploaderComponent from "@/components/pages/restricted/editor/uploader";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});

export default function Uploader() {

  return (
     <MainLayout>
      <UploaderComponent/>
    </MainLayout>
  );
}
