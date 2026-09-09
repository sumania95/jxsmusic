import MainLayout from "@/components/layout/main-layout";
import MyDownloadsComponents from "@/components/pages/my-downloads";
import { requireAuth } from "@/server/authmiddleware";

export const getServerSideProps = requireAuth(async () => {
  return {
    props: {},
  };
});

export default function MyDownloads() {
  return (
   <MainLayout>
    <MyDownloadsComponents/>
  </MainLayout>
  );
}
