import { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, Search, TrendingDown, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../store/AppStore';
import { toast } from 'sonner@2.0.3';

export function Wastage() {
  const { wastageRecords, inventoryItems, addWastageRecord, currentUser } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWastage, setNewWastage] = useState({
    itemId: 0,
    quantity: 0,
    reason: '',
  });

  const filteredWastage = wastageRecords.filter((record) =>
    record.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWastageValue = wastageRecords.reduce((sum, w) => sum + w.costImpact, 0);
  const totalWastageItems = wastageRecords.reduce((sum, w) => sum + w.quantity, 0);
  const wastageByCategory = wastageRecords.reduce((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + w.costImpact;
    return acc;
  }, {} as Record<string, number>);

  const topWastageCategory = Object.entries(wastageByCategory).sort((a, b) => b[1] - a[1])[0];

  const handleAddWastage = () => {
    if (!newWastage.itemId || newWastage.quantity <= 0 || !newWastage.reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const item = inventoryItems.find(i => i.id === newWastage.itemId);
    if (!item) {
      toast.error('Item not found');
      return;
    }

    if (newWastage.quantity > item.stock) {
      toast.error('Wastage quantity exceeds available stock');
      return;
    }

    addWastageRecord({
      itemId: newWastage.itemId,
      itemName: item.name,
      quantity: newWastage.quantity,
      date: new Date().toISOString().split('T')[0],
      reason: newWastage.reason,
      user: currentUser?.name || 'Unknown',
      costImpact: newWastage.quantity * item.costPrice,
      category: item.category,
    });

    toast.success('Wastage recorded successfully');
    setIsAddDialogOpen(false);
    setNewWastage({ itemId: 0, quantity: 0, reason: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-xl overflow-hidden glass-effect border border-border"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1628624747186-a19c3b6e4f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2FzdGV8ZW58MXx8fHwxNzYwNDM3MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="w-8 h-8 text-red-500" />
              <h1 className="neon-text">Wastage & Spoilage Tracking</h1>
            </div>
            <p className="text-muted-foreground">
              Monitor and manage inventory wastage to reduce costs
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Wastage
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect">
                <DialogHeader>
                  <DialogTitle>Log Wastage/Spoilage</DialogTitle>
                  <DialogDescription>
                    Record wastage or spoilage details to track inventory loss
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Item</Label>
                    <Select
                      value={newWastage.itemId.toString()}
                      onValueChange={(value) =>
                        setNewWastage({ ...newWastage, itemId: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name} ({item.stock} {item.unit} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity Wasted</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={newWastage.quantity || ''}
                      onChange={(e) =>
                        setNewWastage({ ...newWastage, quantity: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reason for Wastage</Label>
                    <Textarea
                      placeholder="E.g., Spoilage, Breakage, Expiry, etc."
                      value={newWastage.reason}
                      onChange={(e) =>
                        setNewWastage({ ...newWastage, reason: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  {newWastage.itemId > 0 && newWastage.quantity > 0 && (
                    <div className="p-3 rounded-lg glass-effect border border-red-500/30">
                      <p className="text-sm text-muted-foreground">Estimated Cost Impact</p>
                      <p className="text-xl text-red-500 mt-1">
                        ₹
                        {(
                          newWastage.quantity *
                          (inventoryItems.find(i => i.id === newWastage.itemId)?.costPrice || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleAddWastage}
                  >
                    Log Wastage
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Wastage Value</CardTitle>
              <DollarSign className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-500">₹{totalWastageValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {wastageRecords.length} incidents recorded
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Items Wasted</CardTitle>
              <Package className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-500">{totalWastageItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Total units lost</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-effect border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Top Wastage Category</CardTitle>
              <TrendingDown className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-yellow-500">
                {topWastageCategory ? topWastageCategory[0] : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {topWastageCategory ? `₹${topWastageCategory[1].toLocaleString()}` : 'No data'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search wastage records..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Wastage Records */}
      <Card className="glass-effect border-border">
        <CardHeader>
          <CardTitle>Wastage History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWastage.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No wastage records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWastage.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg glass-effect hover:neon-glow transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4>{record.itemName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {record.category}
                          </Badge>
                          <span>{record.quantity} units</span>
                          <span>•</span>
                          <span>{record.user}</span>
                          <span>•</span>
                          <span>{formatDate(record.date)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Cost Impact</p>
                        <p className="text-lg text-red-500">₹{record.costImpact.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
