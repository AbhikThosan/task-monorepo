import { initTRPC } from '@trpc/server';
import { prisma } from '../config/database';

/**
 * Create tRPC context
 * This runs on every request and provides data to all procedures
 */
export const createContext = async () => {
  return {
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

