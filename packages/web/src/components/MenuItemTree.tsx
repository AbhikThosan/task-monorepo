import { trpc } from '../lib/trpc';
import { useState } from 'react';
import type { MenuItem } from '../types/menuItem';

function MenuItemNode({ item, onEdit, onDelete }: { item: MenuItem; onEdit: (item: MenuItem) => void; onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const children = item.children || [];

  return (
    <div className="ml-4 border-l-2 border-gray-300 pl-4">
      <div className="flex items-center gap-2 py-1">
        {children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span className="font-medium">{item.label}</span>
        <span className="text-sm text-gray-500">({item.url})</span>
        <span className="text-xs text-gray-400">Order: {item.order}</span>
        <button
          onClick={() => onEdit(item)}
          className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <MenuItemNode
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MenuItemTree({ onEdit, onDelete }: { onEdit: (item: MenuItem) => void; onDelete: (id: string) => void }) {
  const { data: menuItems, isLoading, refetch } = trpc.menuItems.getTree.useQuery();

  if (isLoading) {
    return <div className="p-4">Loading menu items...</div>;
  }

  if (!menuItems || menuItems.length === 0) {
    return <div className="p-4 text-gray-500">No menu items found. Create one to get started!</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Menu Items Tree</h2>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <MenuItemNode
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

