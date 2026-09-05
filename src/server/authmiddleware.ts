import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

const redirectToLogin = {
  redirect: {
    destination: "/auth/login",
    permanent: false,
  },
};

const redirectHome = {
  redirect: {
    destination: "/",
    permanent: false,
  },
};


export const requireAuth =
  <P extends Record<string, unknown> = Record<string, unknown>>(
    func: GetServerSideProps<P>,
  ): GetServerSideProps<P> =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await auth(ctx);

    if (!session) {
      return redirectToLogin;
    }

    return func(ctx);
  };

export const requireAdmin =
  <P extends Record<string, unknown> = Record<string, unknown>>(
    func: GetServerSideProps<P>,
  ): GetServerSideProps<P> =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await auth(ctx);

    if (!session) {
      return redirectToLogin;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { is_superadmin: true },
    });

    if (!user?.is_superadmin) {
      return redirectHome;
    }

    return func(ctx);
  };

export const requireAccounting =
  <P extends Record<string, unknown> = Record<string, unknown>>(
    func: GetServerSideProps<P>,
  ): GetServerSideProps<P> =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await auth(ctx);

    if (!session) {
      return redirectToLogin;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { is_admin: true },
    });

    if (!user?.is_admin) {
      return redirectHome;
    }

    return func(ctx);
  };

export const requireUploader =
  <P extends Record<string, unknown> = Record<string, unknown>>(
    func: GetServerSideProps<P>,
  ): GetServerSideProps<P> =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await auth(ctx);

    if (!session) {
      return redirectToLogin;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { is_uploader: true },
    });

    if (!user?.is_uploader) {
      return redirectHome;
    }

    return func(ctx);
  };
