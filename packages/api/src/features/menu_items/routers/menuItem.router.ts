import { z } from 'zod';
import { router, publicProcedure } from '../../../trpc/procedures';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  deleteMenuItemSchema,
  getMenuItemSchema,
} from '../schemas/menuItem.schema';
import {
  getAllMenuItems,
  getAllMenuItemsFlat,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/menuItem.service';

/**
 * Menu Item Router
 * tRPC procedures for menu item operations
 */
export const menuItemRouter = router({
  /**
   * Get all menu items as a tree structure
   */
  getTree: publicProcedure.query(async () => {
    return getAllMenuItems();
  }),

  /**
   * Get all menu items as a flat array
   */
  getAll: publicProcedure.query(async () => {
    return getAllMenuItemsFlat();
  }),

  /**
   * Get a single menu item by ID
   */
  getById: publicProcedure
    .input(getMenuItemSchema)
    .query(async ({ input }) => {
      const item = await getMenuItemById(input.id);
      if (!item) {
        throw new Error('Menu item not found');
      }
      return item;
    }),

  /**
   * Create a new menu item
   */
  create: publicProcedure
    .input(createMenuItemSchema)
    .mutation(async ({ input }) => {
      return createMenuItem(input);
    }),

  /**
   * Update a menu item
   */
  update: publicProcedure
    .input(updateMenuItemSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateMenuItem(id, data);
    }),

  /**
   * Delete a menu item
   */
  delete: publicProcedure
    .input(deleteMenuItemSchema)
    .mutation(async ({ input }) => {
      return deleteMenuItem(input.id);
    }),
});

