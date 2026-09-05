import MainLayout from "@/components/layout/main-layout";
import BecomeEditorForm from "@/components/pages/become-editor";
import { requireAuth } from "@/server/authmiddleware";

export const getServerSideProps = requireAuth(async () => {
  return {
    props: {},
  };
});

export default function ChartPage() {

  return (
    <MainLayout>
        <BecomeEditorForm/>
    </MainLayout>
  );
}
