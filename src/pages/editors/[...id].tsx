import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import EditorDetailsComponent from '@/components/pages/editors/details';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '@/server/api/root';
import superjson from 'superjson';
import { createTRPCSSRContext } from '@/utils/trpc/context-ssr';
import { ProfileMeta } from '@/components/common/metadata';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = Array.isArray(context.params?.id) ? context.params.id[0] : context.params?.id;
  if (!id) return { notFound: true };

  const ctx = await createTRPCSSRContext(context);

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  const editor = await ssg.editor.getEditor.fetch({ id });

  return { props: { editor } };
};

interface Props {
  editor: {
    id: string;
    image: string | null;
    username: string | null;
    biography: string | null;
    is_video_uploader:boolean;
    link_facebook:string | null;
    link_instagram:string | null;
    link_mixclound:string | null;
    link_soundcloud:string | null;
    link_spotify:string | null;
    link_twitch:string | null;
    link_twitter:string | null;
    link_youtube:string | null;
    _count: {
      track: number;
    };
  };
}

const EditorDetailPage = ({ editor }: Props) => {
  console.log("EDITOR PROP", editor); // will log only the editor object
  return (
    <>
      <ProfileMeta
        title={editor.username ?? ""}
        description={editor.biography ?? ""}
        image={editor.image ?? ""}
        url={`https://www.jeff92ayansumania.com/editors/${editor.id}`}
        type="profile"
      />

      <MainLayout>
        <EditorDetailsComponent editor={editor} />
      </MainLayout>
    </>
  );
};

export default EditorDetailPage;
