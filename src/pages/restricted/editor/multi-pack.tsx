import MainLayout from "@/components/layout/main-layout";
import MultiPacksComponent from "@/components/pages/restricted/editor/multi-pack";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function EditorMultipackPage() {

  return (
    <MainLayout>
      <MultiPacksComponent/>
    </MainLayout>
  );
}
