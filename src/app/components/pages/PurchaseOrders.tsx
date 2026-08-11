import { motion } from 'motion/react';
import { Plus, Search, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
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

const purchaseOrders = [
  {
    id: 'PO-2024-156',
    supplier: 'Fresh Foods Suppliers',
    date: '2024-10-12',
    items: 12,
    amount: 45600,
    status: 'Pending',
  },
  {
    id: 'PO-2024-155',
    supplier: 'Premium Ingredients Co',
    date: '2024-10-10',
    items: 8,
    amount: 12300,
    status: 'Delivered',
  },
  {
    id: 'PO-2024-154',
    supplier: 'Spice Merchants India',
    date: '2024-10-08',
    items: 15,
    amount: 8900,
    status: 'In Transit',
  },
  {
    id: 'PO-2024-153',
    supplier: 'Organic Produce Ltd',
    date: '2024-10-05',
    items: 20,
    amount: 67200,
    status: 'Delivered',
  },
  {
    id: 'PO-2024-152',
    supplier: 'Fresh Foods Suppliers',
    date: '2024-10-03',
    items: 10,
    amount: 38500,
    status: 'Cancelled',
  },
  {
    id: 'PO-2024-151',
    supplier: 'Dairy Products Co',
    date: '2024-09-28',
    items: 25,
    amount: 22400,
    status: 'Delivered',
  },
];

export function PurchaseOrders() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 rounded-xl overflow-hidden glass-effect border border-border"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1675668410450-7008c2e02c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMHNoZWxmfGVufDF8fHx8MTc2MDQzNDg4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6">
          <div>
            <h1 className="neon-text mb-2">Purchase Orders</h1>
            <p className="text-muted-foreground">
              Create and track purchase orders with suppliers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]">
              <Plus className="w-4 h-4 mr-2" />
              Create New Order
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="glass-effect border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search purchase orders..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card className="glass-effect border-border">
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>
                      <span className="text-[#d4af37]">{order.id}</span>
                    </TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'Delivered'
                            ? 'default'
                            : order.status === 'Cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={
                          order.status === 'Delivered'
                            ? 'bg-green-500/20 text-green-500'
                            : order.status === 'In Transit'
                            ? 'bg-blue-500/20 text-blue-500'
                            : order.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : ''
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Orders', value: '156', color: '#d4af37' },
          { title: 'Pending', value: '12', color: '#f59e0b' },
          { title: 'In Transit', value: '8', color: '#3b82f6' },
          { title: 'Delivered', value: '136', color: '#10b981' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-effect border-border">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}