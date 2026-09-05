import MainLayout from "@/components/layout/main-layout";
import CreditsComponent from "@/components/pages/credits";
import { requireAuth } from "@/server/authmiddleware";

export const getServerSideProps = requireAuth(async () => ({ props: {} }));

export default function AccountPage() {
  return (
    <MainLayout>
      <CreditsComponent />
    </MainLayout>
  );
}
