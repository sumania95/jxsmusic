import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

export async function getServerAuthSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  const session = await auth(req, res);
  return session;
}


const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
