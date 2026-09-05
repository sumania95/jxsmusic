import MainLayout from "@/components/layout/main-layout";
import PublishedComponent from "@/components/pages/restricted/editor/published";
import { requireUploader } from "@/server/authmiddleware";

export const getServerSideProps = requireUploader(async () => {
  return {
    props: {},
  };
});
export default function Published() {

  return (
     <MainLayout>
        <PublishedComponent/>
      </MainLayout>
  );
}
