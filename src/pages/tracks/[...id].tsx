import React from 'react'
import MainLayout from '@/components/layout/main-layout';
import TrackDetailComponent from '@/components/pages/tracks/by-track';
import type { GetServerSidePropsContext } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '@/server/api/root';
import superjson from 'superjson';
import { createTRPCSSRContext } from '@/utils/trpc/context-ssr';
import { ProfileMeta } from '@/components/common/metadata';
import { api } from '@/utils/api';
import { formatTrackTitle } from '@/lib/utils';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = Array.isArray(context.params?.id) ? context.params.id[0] : context.params?.id;
  if (!id) return { notFound: true };

  const ctx = await createTRPCSSRContext(context);

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  await ssg.track.getIdMain.fetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(), // ✅ superjson-safe
      id, // pass id only
    },
  };
};

interface Props {
  id: string;
}

const TrackDetailPage = ({id}:Props) => {
  const { data: track } = api.track.getIdMain.useQuery({ id });
  if (!track) return null;

  return (
    <>
      <ProfileMeta
        title={formatTrackTitle(track.title,track.is_explicit) ?? ""}
        description={track.artist ?? ""}
        image={track.user.image ?? ""}
        url={`https://www.jeff92ayansumania.com/tracks/${track.id}`}
        type="profile"
      />
      <MainLayout>
        <TrackDetailComponent/>
      </MainLayout>
    </>
  )
}

export default TrackDetailPage