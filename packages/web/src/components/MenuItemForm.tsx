import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import type { MenuItem } from '../types/menuItem';

type MenuItemFormProps = {
  item?: MenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function MenuItemForm({ item, onClose, onSuccess }: MenuItemFormProps) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState<string | null>(null);

  const { data: allItems } = trpc.menuItems.getAll.useQuery();
  const createMutation = trpc.menuItems.create.useMutation();
  const updateMutation = trpc.menuItems.update.useMutation();

  useEffect(() => {
    if (item) {
      setLabel(item.label);
      setUrl(item.url);
      setOrder(item.order);
      setParentId(item.parentId);
    } else {
      setLabel('');
      setUrl('');
      setOrder(0);
      setParentId(null);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (item) {
        // Update existing item
        await updateMutation.mutateAsync({
          id: item.id,
          label,
          url,
          order,
          parentId,
        });
      } else {
        // Create new item
        await createMutation.mutateAsync({
          label,
          url,
          order,
          parentId: parentId || undefined,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item. Please check the console for details.');
    }
  };

  // Filter out the current item and its descendants from parent options
  const getAvailableParents = () => {
    if (!allItems) return [];
    if (!item) return allItems;

    // Filter out the item itself and all its descendants
    const excludeIds = new Set([item.id]);
    const getDescendants = (parentId: string) => {
      allItems
        .filter((i) => i.parentId === parentId)
        .forEach((child) => {
          excludeIds.add(child.id);
          getDescendants(child.id);
        });
    };
    getDescendants(item.id);

    return allItems.filter((i) => !excludeIds.has(i.id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {item ? 'Edit Menu Item' : 'Create Menu Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Menu item label"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="/path/to/page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parent (optional)</label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">None (Top Level)</option>
              {getAvailableParents().map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : item
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

