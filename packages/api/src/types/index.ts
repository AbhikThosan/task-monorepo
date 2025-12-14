

import { MenuItem } from '@prisma/client';

// Menu Item types
export type MenuItemType = MenuItem;

export type MenuItemWithChildren = MenuItem & {
  children: MenuItemWithChildren[];
};

// Input types for creating/updating menu items
export interface CreateMenuItemInput {
  label: string;
  url: string;
  parentId?: string | null;
  order?: number;
}

export interface UpdateMenuItemInput {
  label?: string;
  url?: string;
  parentId?: string | null;
  order?: number;
}

