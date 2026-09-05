import React from 'react'
import MainLayout from '@/components/layout/main-layout';
import MultiPackDetailComponent from '@/components/pages/multi-packs/by-pack';
import type { GetServerSidePropsContext } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '@/server/api/root';
import superjson from 'superjson';
import { createTRPCSSRContext } from '@/utils/trpc/context-ssr';
import { ProfileMeta } from '@/components/common/metadata';
import { api } from '@/utils/api';
import { defaultPageLimit } from '@/state/globalState';
import { useAtom } from 'jotai';
import { parseAsInteger, useQueryState } from 'nuqs';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const slug = Array.isArray(context.params?.slug) ? context.params.slug[0] : context.params?.slug;
  if (!slug) return { notFound: true };

  const ctx = await createTRPCSSRContext(context);

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  await ssg.album.getId.fetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(), // ✅ superjson-safe
      slug, // pass id only
    },
  };
};

interface Props {
  slug: string;
}

const MultiPackDetailPage = ({slug}:Props) => {
  const { data: album } = api.album.getId.useQuery({ 
    slug,

  });
    if (!album) return null;
  return (
    <>
      <ProfileMeta
        title={album.name ?? ""}
        description={album.artist ?? ""}
        image={album.image ?? album.user.image ?? ""}
        url={`https://www.jeff92ayansumania.com/multi-packs/${slug}`}
        type="profile"
      />
      <MainLayout>
        <MultiPackDetailComponent {...album}/>
      </MainLayout>
    </>
  )
}

export default MultiPackDetailPage