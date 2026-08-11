import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface Supplier {
  id: number;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
  status: 'Active' | 'Inactive';
  orders: number;
}

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Fresh Foods Suppliers',
    category: 'Fresh Produce',
    contact: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@freshfoods.com',
    location: 'MG Road, Bangalore',
    status: 'Active',
    orders: 45,
  },
  {
    id: 2,
    name: 'Premium Ingredients Co',
    category: 'Kitchen Supplies',
    contact: 'Priya Sharma',
    phone: '+91 98765 43211',
    email: 'priya@premiumingredients.com',
    location: 'Indiranagar, Bangalore',
    status: 'Active',
    orders: 38,
  },
  {
    id: 3,
    name: 'Spice Merchants India',
    category: 'Spices & Herbs',
    contact: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit@spicemerchants.com',
    location: 'Koramangala, Bangalore',
    status: 'Active',
    orders: 52,
  },
  {
    id: 4,
    name: 'Organic Produce Ltd',
    category: 'Organic Foods',
    contact: 'Sarah D\'Souza',
    phone: '+91 98765 43213',
    email: 'sarah@organicproduce.com',
    location: 'Whitefield, Bangalore',
    status: 'Active',
    orders: 28,
  },
  {
    id: 5,
    name: 'Dairy Products Co',
    category: 'Dairy & Beverages',
    contact: 'Karthik Menon',
    phone: '+91 98765 43214',
    email: 'karthik@dairyproducts.com',
    location: 'JP Nagar, Bangalore',
    status: 'Active',
    orders: 35,
  },
];

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier({ ...supplier });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? editingSupplier : s
      ));
      setIsEditDialogOpen(false);
      setEditingSupplier(null);
      toast.success('Supplier updated successfully!');
    }
  };

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success('Supplier deleted successfully!');
  };

  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: Math.max(...suppliers.map(s => s.id)) + 1,
      name: 'New Supplier',
      category: 'Liquor',
      contact: 'Contact Name',
      phone: '+91 00000 00000',
      email: 'email@example.com',
      location: 'Bangalore',
      status: 'Active',
      orders: 0,
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    toast.success('Supplier added successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="neon-text mb-2">Supplier Management</h1>
          <p className="text-muted-foreground">
            Manage your suppliers and vendor relationships
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter the details of the new supplier below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <Input placeholder="e.g., Premium Spirits Ltd" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue="fresh-produce">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh-produce">Fresh Produce</SelectItem>
                      <SelectItem value="kitchen-supplies">Kitchen Supplies</SelectItem>
                      <SelectItem value="spices">Spices & Herbs</SelectItem>
                      <SelectItem value="dairy">Dairy & Beverages</SelectItem>
                      <SelectItem value="organic">Organic Foods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input placeholder="Contact name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+91 00000 00000" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Address, Bangalore" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]"
                onClick={handleAddSupplier}
              >
                Add Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-border hover:neon-glow transition-all h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#d4af37] text-[#0a0a0f]">
                        {supplier.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{supplier.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {supplier.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    variant={supplier.status === 'Active' ? 'default' : 'secondary'}
                    className={
                      supplier.status === 'Active'
                        ? 'bg-green-500/20 text-green-500'
                        : ''
                    }
                  >
                    {supplier.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-muted-foreground">Contact:</span>
                    <span>{supplier.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-muted-foreground truncate">
                      {supplier.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-muted-foreground">
                      {supplier.location}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="text-[#d4af37]">{supplier.orders}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-effect">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier details below.
            </DialogDescription>
          </DialogHeader>
          {editingSupplier && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <Input 
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={editingSupplier.category} 
                    onValueChange={(value) => setEditingSupplier({ ...editingSupplier, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                      <SelectItem value="Kitchen Supplies">Kitchen Supplies</SelectItem>
                      <SelectItem value="Spices & Herbs">Spices & Herbs</SelectItem>
                      <SelectItem value="Dairy & Beverages">Dairy & Beverages</SelectItem>
                      <SelectItem value="Organic Foods">Organic Foods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input 
                    value={editingSupplier.contact}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={editingSupplier.phone}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={editingSupplier.email}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={editingSupplier.location}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editingSupplier.status} 
                  onValueChange={(value: 'Active' | 'Inactive') => setEditingSupplier({ ...editingSupplier, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingSupplier(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}