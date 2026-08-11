import { motion } from 'motion/react';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAppStore } from '../../store/AppStore';
import { useState } from 'react';

export function StockMovement() {
  const { stockMovements } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredMovements = stockMovements.filter((movement) => {
    const matchesSearch = movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || movement.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIn = stockMovements.filter(m => m.type === 'In').reduce((acc, m) => acc + m.quantity, 0);
  const totalOut = stockMovements.filter(m => m.type === 'Out').reduce((acc, m) => acc + m.quantity, 0);
  const totalAdjustments = stockMovements.filter(m => m.type === 'Adjustment').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="neon-text mb-2">Stock Movement History</h1>
        <p className="text-muted-foreground">
          Track all inventory movements and adjustments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Stock In</CardTitle>
              <ArrowUpCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-500">{totalIn}</div>
              <p className="text-xs text-muted-foreground mt-1">Total items received</p>
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
              <CardTitle className="text-sm">Stock Out</CardTitle>
              <ArrowDownCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-500">{totalOut}</div>
              <p className="text-xs text-muted-foreground mt-1">Total items consumed</p>
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
              <CardTitle className="text-sm">Adjustments</CardTitle>
              <RefreshCw className="w-4 h-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-[#d4af37]">{totalAdjustments}</div>
              <p className="text-xs text-muted-foreground mt-1">Stock corrections</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search movements..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="In">Stock In</SelectItem>
                  <SelectItem value="Out">Stock Out</SelectItem>
                  <SelectItem value="Adjustment">Adjustments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement History Table */}
      <Card className="glass-effect border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement, index) => (
                    <motion.tr
                      key={movement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {movement.date}
                        </div>
                      </TableCell>
                      <TableCell>{movement.itemName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            movement.type === 'In'
                              ? 'bg-green-500/20 text-green-500 border-green-500/50'
                              : movement.type === 'Out'
                              ? 'bg-red-500/20 text-red-500 border-red-500/50'
                              : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                          }
                        >
                          {movement.type === 'In' && <ArrowUpCircle className="w-3 h-3 mr-1" />}
                          {movement.type === 'Out' && <ArrowDownCircle className="w-3 h-3 mr-1" />}
                          {movement.type === 'Adjustment' && <RefreshCw className="w-3 h-3 mr-1" />}
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell className="text-muted-foreground">{movement.notes}</TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
