import MainLayout from '@/components/layout/main-layout';
import AdminDataComponent from '@/components/pages/restricted/admin';
import { requireAdmin } from '@/server/authmiddleware';
import React from 'react'


export const getServerSideProps = requireAdmin(async () => {
  return {
    props: {},
  };
});

export default function AdminPage() {

  return (
     <MainLayout>
      <AdminDataComponent/>
    </MainLayout>
  );
}