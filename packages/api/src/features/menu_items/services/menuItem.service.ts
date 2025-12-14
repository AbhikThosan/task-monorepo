import { prisma } from '../../../config/database';
import type { MenuItemWithChildren } from '../../../types';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/menuItem.schema';

// Type for update input without id (id is passed separately)
type UpdateMenuItemData = Omit<UpdateMenuItemInput, 'id'>;

/**
 * Menu Item Service
 * Contains all business logic for menu items
 */

/**
 * Build a tree structure from flat array of menu items
 */
function buildMenuTree(items: Array<{ id: string; parentId: string | null; [key: string]: any }>): MenuItemWithChildren[] {
  const itemMap = new Map<string, MenuItemWithChildren>();
  const rootItems: MenuItemWithChildren[] = [];

  // First pass: create map of all items
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] } as unknown as MenuItemWithChildren);
  });

  // Second pass: build tree structure
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id)!;
    if (item.parentId === null) {
      rootItems.push(menuItem);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(menuItem);
      }
    }
  });

  // Sort by order
  const sortByOrder = (items: MenuItemWithChildren[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach((item) => {
      if (item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootItems);
  return rootItems;
}

/**
 * Get all menu items as a tree structure
 */
export async function getAllMenuItems(): Promise<MenuItemWithChildren[]> {
  const items = await prisma.menuItem.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' },
    ],
  });

  return buildMenuTree(items);
}

/**
 * Get all menu items as a flat array
 */
export async function getAllMenuItemsFlat() {
  return prisma.menuItem.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' },
    ],
  });
}

/**
 * Get a single menu item by ID
 */
export async function getMenuItemById(id: string) {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      children: true,
      parent: true,
    },
  });
}

/**
 * Create a new menu item
 */
export async function createMenuItem(input: CreateMenuItemInput) {
  // Validate parent exists if provided
  if (input.parentId) {
    const parent = await prisma.menuItem.findUnique({
      where: { id: input.parentId },
    });

    if (!parent) {
      throw new Error('Parent menu item not found');
    }
  }

  return prisma.menuItem.create({
    data: {
      label: input.label,
      url: input.url,
      parentId: input.parentId || null,
      order: input.order ?? 0,
    },
  });
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id: string, input: UpdateMenuItemData) {
  // Check if item exists
  const existingItem = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new Error('Menu item not found');
  }

  // Prevent circular reference (item cannot be its own parent)
  if (input.parentId === id) {
    throw new Error('A menu item cannot be its own parent');
  }

  // Validate parent exists if provided
  if (input.parentId) {
    const parent = await prisma.menuItem.findUnique({
      where: { id: input.parentId },
    });

    if (!parent) {
      throw new Error('Parent menu item not found');
    }

    // Prevent making a descendant a parent (would create circular reference)
    const descendants = await getDescendants(id);
    if (descendants.some((desc) => desc.id === input.parentId)) {
      throw new Error('Cannot set a descendant as parent');
    }
  }

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...(input.label !== undefined && { label: input.label }),
      ...(input.url !== undefined && { url: input.url }),
      ...(input.parentId !== undefined && { parentId: input.parentId || null }),
      ...(input.order !== undefined && { order: input.order }),
    },
  });
}

/**
 * Delete a menu item (cascades to children due to onDelete: Cascade in schema)
 */
export async function deleteMenuItem(id: string) {
  const item = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error('Menu item not found');
  }

  return prisma.menuItem.delete({
    where: { id },
  });
}

/**
 * Get all descendants of a menu item (helper function)
 */
async function getDescendants(parentId: string): Promise<Array<{ id: string }>> {
  const children = await prisma.menuItem.findMany({
    where: { parentId },
    select: { id: true },
  });

  const allDescendants = [...children];

  for (const child of children) {
    const grandChildren = await getDescendants(child.id);
    allDescendants.push(...grandChildren);
  }

  return allDescendants;
}

