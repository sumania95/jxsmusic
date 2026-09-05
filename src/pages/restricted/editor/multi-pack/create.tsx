import MainLayout from "@/components/layout/main-layout";
import AlbumCreateForm from "@/components/pages/restricted/editor/multi-pack/helper/new-album-form";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function EditorMultipackPage() {

  return (
    <MainLayout>
      <AlbumCreateForm/>
    </MainLayout>
  );
}
