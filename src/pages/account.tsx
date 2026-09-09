import MainLayout from "@/components/layout/main-layout";
import MyAccountData from "@/components/pages/account";
import { requireAuth } from "@/server/authmiddleware";

export const getServerSideProps = requireAuth(async () => ({ props: {} }));

export default function AccountPage() {
  return (
    <MainLayout>
      <MyAccountData />
    </MainLayout>
  );
}
