import { router, publicProcedure } from './procedures';
import { menuItemRouter } from '../features/menu_items/routers/menuItem.router';

/**
 * Main App Router
 * Combines all feature routers
 */
export const appRouter = router({
  // Feature routers
  menuItems: menuItemRouter,

  // Keep greeting for testing
  greeting: publicProcedure.query(() => {
      return {
        message: 'Hello from tRPC!',
        timestamp: new Date().toISOString(),
      };
    }),
});

export type AppRouter = typeof appRouter;