import MainLayout from "@/components/layout/main-layout";
import MyOrdersComponents from "@/components/pages/my-orders";
import { requireAuth } from "@/server/authmiddleware";

export const getServerSideProps = requireAuth(async () => {
  return {
    props: {},
  };
});

export default function MyOrders() {
  return (
   <MainLayout>
    <MyOrdersComponents/>
  </MainLayout>
  );
}
