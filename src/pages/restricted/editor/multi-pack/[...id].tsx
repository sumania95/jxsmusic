import MainLayout from "@/components/layout/main-layout";
import AlbumUpdateForm from "@/components/pages/restricted/editor/multi-pack/helper/update-album-form";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function EditorMultipackPage() {

  return (
    <MainLayout>
      <AlbumUpdateForm/>
    </MainLayout>
  );
}
