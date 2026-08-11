import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Download, Edit, Trash2, Minus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAppStore } from '../../store/AppStore';
import { toast } from 'sonner@2.0.3';

const categories = ['All', 'Main Course', 'Kitchen', 'Kitchen Supplies', 'Breakfast', 'Dessert', 'Appetizers', 'Beverages', 'Bakery'];

export function Inventory() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, currentUser } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [animatingStockIds, setAnimatingStockIds] = useState<Set<number>>(new Set());
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Main Course',
    stock: 0,
    unit: 'Portions',
    price: 0,
  });

  // Background images for header
  const headerImages = [
    'https://images.unsplash.com/photo-1649140041688-0f75446e707e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwZGlzaGVzfGVufDF8fHx8MTc2Mzk2MTcwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!newItem.name || newItem.stock <= 0 || newItem.price <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }

    const status = newItem.stock < 10 ? 'Low Stock' : 'In Stock';
    addInventoryItem({ ...newItem, status });
    toast.success('Item added successfully!');
    setIsAddDialogOpen(false);
    setNewItem({ name: '', category: 'Main Course', stock: 0, unit: 'Portions', price: 0 });
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem.name || editingItem.stock < 0 || editingItem.price <= 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }

    const status = editingItem.stock < 10 ? 'Low Stock' : 'In Stock';
    updateInventoryItem(editingItem.id, { ...editingItem, status });
    toast.success('Item updated successfully!');
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    deleteInventoryItem(id);
    toast.success('Item deleted successfully!');
    setDeleteItemId(null);
  };

  const handleQuickStockUpdate = (itemId: number, delta: number) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    const newStock = item.stock + delta;
    
    // Validate: don't go below 0
    if (newStock < 0) {
      toast.error('Stock cannot be negative!', {
        description: 'Use the edit button for manual adjustments'
      });
      return;
    }

    // Check permissions
    if (!currentUser?.permissions.editInventory) {
      toast.error('You do not have permission to edit inventory');
      return;
    }

    // Trigger animation
    setAnimatingStockIds(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setAnimatingStockIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 500);

    // Update stock
    const status = newStock < (item.reorderLevel || 10) ? 'Low Stock' : 'In Stock';
    updateInventoryItem(itemId, { stock: newStock, status });
    
    // Show toast with animation and icon
    const action = delta > 0 ? '📦 Added' : '📤 Removed';
    const emoji = delta > 0 ? '✅' : '➖';
    toast.success(`${emoji} ${item.name}`, {
      description: `${action} ${Math.abs(delta)} ${item.unit}. New stock: ${newStock}`
    });
  };

  const exportData = () => {
    const csv = [
      ['Name', 'Category', 'Stock', 'Unit', 'Price', 'Status'],
      ...filteredItems.map(item => [
        item.name,
        item.category,
        item.stock,
        item.unit,
        item.price,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    toast.success('Inventory exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header with Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-xl overflow-hidden glass-effect border border-border"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${headerImages[0]})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6">
          <div>
            <h1 className="neon-text mb-2">Inventory Management</h1>
            <p className="text-muted-foreground mb-2">
              Manage and track all your resto-bar inventory items
            </p>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)]">
                💡 Tip
              </Badge>
              <span className="text-muted-foreground">Use +/- buttons for quick stock updates</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </DialogTrigger>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Enter the details of the new inventory item below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  placeholder="e.g., Butter Chicken (Ready)" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Course">Main Course</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Kitchen Supplies">Kitchen Supplies</SelectItem>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portions">Portions</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liters">Liters</SelectItem>
                      <SelectItem value="Bottles">Bottles</SelectItem>
                      <SelectItem value="Pieces">Pieces</SelectItem>
                      <SelectItem value="Boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={newItem.stock || ''}
                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Unit (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0" 
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory items..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="glass-effect border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Stock
                      <span className="text-xs text-muted-foreground hidden md:inline">(Use +/- for quick updates)</span>
                    </div>
                  </TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <motion.div 
                          className="flex items-center gap-2 p-1 rounded-lg"
                          whileHover={{ backgroundColor: 'rgba(var(--primary-rgb, 212, 175, 55), 0.05)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 transition-all stock-increment-btn"
                                onClick={() => handleQuickStockUpdate(item.id, -1)}
                                disabled={item.stock === 0}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove 1 {item.unit}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={`${item.id}-${item.stock}`}
                              initial={{ scale: 1 }}
                              animate={{ 
                                scale: animatingStockIds.has(item.id) ? [1, 1.3, 1] : 1,
                                color: animatingStockIds.has(item.id) ? ['var(--foreground)', 'var(--primary)', 'var(--foreground)'] : 'var(--foreground)',
                              }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`min-w-[3rem] text-center font-medium ${
                                item.stock <= (item.reorderLevel || 10) / 2 ? 'text-red-500' : 
                                item.stock <= (item.reorderLevel || 10) ? 'text-yellow-500' : ''
                              }`}
                            >
                              {item.stock}
                            </motion.span>
                          </AnimatePresence>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-green-500/20 hover:border-green-500 hover:text-green-500 transition-all stock-increment-btn"
                                onClick={() => handleQuickStockUpdate(item.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add 1 {item.unit}</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === 'In Stock' ? 'default' : 'secondary'}
                        className={
                          item.status === 'In Stock'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-effect">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the item details below.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Course">Main Course</SelectItem>
                      <SelectItem value="Kitchen">Kitchen</SelectItem>
                      <SelectItem value="Kitchen Supplies">Kitchen Supplies</SelectItem>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={editingItem.unit} onValueChange={(value) => setEditingItem({ ...editingItem, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portions">Portions</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liters">Liters</SelectItem>
                      <SelectItem value="Bottles">Bottles</SelectItem>
                      <SelectItem value="Pieces">Pieces</SelectItem>
                      <SelectItem value="Boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Stock</Label>
                  <Input 
                    type="number"
                    value={editingItem.stock}
                    onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price per Unit (₹)</Label>
                  <Input 
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteItemId !== null} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent className="glass-effect">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inventory item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItemId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}