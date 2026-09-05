import MainLayout from "@/components/layout/main-layout";
import AccountingBackOffice from "@/components/pages/restricted/accounting";
import { requireAdmin } from "@/server/authmiddleware";
export const getServerSideProps = requireAdmin(async () => ({ props: {} }));
export default function AccountingPage() { return <MainLayout><AccountingBackOffice /></MainLayout>; }
