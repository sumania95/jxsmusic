import type { NextApiRequest, NextApiResponse } from "next";

export interface CreateNextContextOptions {
  req: NextApiRequest;
  res: NextApiResponse;
  info?: string;
}

export async function createTRPCContext({ req, res, info }: CreateNextContextOptions) {
  // Context for API routes (full NextApiRequest)
  return { req, res, info };
}
