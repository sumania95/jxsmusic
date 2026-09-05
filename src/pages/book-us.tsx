import MainLayout from "@/components/layout/main-layout";
import BookUs from "@/components/pages/book-us";
import { requireAuth } from "@/server/authmiddleware";
export const getServerSideProps = requireAuth(async () => ({ props: {} }));
export default function BookUsPage() { return <MainLayout><BookUs /></MainLayout>; }
