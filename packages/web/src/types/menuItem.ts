/**
 * Shared MenuItem types
 * Used across all components for consistency
 */

export type MenuItem = {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
};

export type MenuItemWithChildren = MenuItem & {
  children: MenuItem[];
};

