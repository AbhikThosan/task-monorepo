import { z } from 'zod';

/**
 * Zod validation schemas for Menu Items
 * Used for input validation in tRPC procedures
 */

// UUID validation regex pattern
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// UUID string schema (replaces deprecated .uuid())
const uuidSchema = z.string().regex(uuidRegex, 'Invalid UUID format');

// Schema for creating a menu item
export const createMenuItemSchema = z.object({
  label: z.string().min(1, 'Label is required').max(255, 'Label is too long'),
  url: z.string().min(1, 'URL is required').max(500, 'URL is too long'),
  parentId: uuidSchema.nullable().optional(),
  order: z.number().int().min(0).optional().default(0),
});

// Schema for updating a menu item
export const updateMenuItemSchema = z.object({
  id: uuidSchema,
  label: z.string().min(1).max(255).optional(),
  url: z.string().min(1).max(500).optional(),
  parentId: uuidSchema.nullable().optional(),
  order: z.number().int().min(0).optional(),
});

// Schema for deleting a menu item
export const deleteMenuItemSchema = z.object({
  id: uuidSchema,
});

// Schema for getting a single menu item
export const getMenuItemSchema = z.object({
  id: uuidSchema,
});

// Type inference from schemas
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type DeleteMenuItemInput = z.infer<typeof deleteMenuItemSchema>;
export type GetMenuItemInput = z.infer<typeof getMenuItemSchema>;

