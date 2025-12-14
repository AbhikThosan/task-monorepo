import { useState } from 'react';
import { trpc } from './lib/trpc';
import { MenuItemTree } from './components/MenuItemTree';
import { MenuItemForm } from './components/MenuItemForm';
import type { MenuItem } from './types/menuItem';

function App() {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.menuItems.delete.useMutation({
    onSuccess: () => {
      utils.menuItems.getTree.invalidate();
      utils.menuItems.getAll.invalidate();
    },
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item? All children will also be deleted.')) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item. Please check the console for details.');
      }
    }
  };

  const handleFormSuccess = () => {
    utils.menuItems.getTree.invalidate();
    utils.menuItems.getAll.invalidate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu Items Management</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Create Menu Item
          </button>
        </div>

        <MenuItemTree onEdit={handleEdit} onDelete={handleDelete} />

        {(showCreateForm || editingItem) && (
          <MenuItemForm
            item={editingItem}
            onClose={() => {
              setShowCreateForm(false);
              setEditingItem(null);
            }}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default App;