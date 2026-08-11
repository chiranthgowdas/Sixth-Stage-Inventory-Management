import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useAppStore } from '../../store/AppStore';
import { useMemo } from 'react';

const recentOrders = [
  { id: 'PO-2024-156', supplier: 'Fresh Foods Suppliers', amount: '₹45,600', status: 'Pending' },
  { id: 'PO-2024-155', supplier: 'Premium Ingredients Co', amount: '₹12,300', status: 'Delivered' },
  { id: 'PO-2024-154', supplier: 'Spice Merchants India', amount: '₹8,900', status: 'In Transit' },
  { id: 'PO-2024-153', supplier: 'Organic Produce Ltd', amount: '₹67,200', status: 'Delivered' },
];

export function Dashboard() {
  const { inventoryItems, stockMovements, users } = useAppStore();

  const stats = useMemo(() => {
    const totalValue = inventoryItems.reduce((acc, item) => acc + (item.stock * item.price), 0);
    const totalItems = inventoryItems.reduce((acc, item) => acc + item.stock, 0);
    const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock').length;
    const activeUsers = users.filter(u => u.status === 'Active').length;

    return [
      {
        title: 'Total Inventory Value',
        value: `₹${totalValue.toLocaleString()}`,
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
      },
      {
        title: 'Total Items',
        value: totalItems.toString(),
        change: '+5.2%',
        trend: 'up',
        icon: Package,
      },
      {
        title: 'Low Stock Alerts',
        value: lowStockCount.toString(),
        change: lowStockCount > 5 ? `${lowStockCount} items low` : 'All good',
        trend: lowStockCount > 5 ? 'warning' : 'up',
        icon: AlertTriangle,
      },
      {
        title: 'Active Users',
        value: activeUsers.toString(),
        change: `${users.length} total`,
        trend: 'up',
        icon: Users,
      },
    ];
  }, [inventoryItems, users]);

  const lowStockItems = useMemo(() => {
    return inventoryItems
      .filter(item => item.status === 'Low Stock')
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        stock: item.stock,
        reorder: 20,
        category: item.category
      }));
  }, [inventoryItems]);

  const recentActivity = useMemo(() => {
    return stockMovements.slice(0, 4).map(movement => ({
      action: movement.type === 'In' ? 'Stock In' : movement.type === 'Out' ? 'Stock Out' : 'Adjustment',
      item: movement.itemName,
      quantity: movement.quantity,
      user: movement.user,
      time: movement.date
    }));
  }, [stockMovements]);

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1759419038843-29749ac4cd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50fGVufDF8fHx8MTc2Mzg4NTY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="neon-text mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your inventory today.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-border hover:neon-glow transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <Icon className="w-4 h-4 text-[#d4af37]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-[#d4af37]">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    {stat.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    {stat.trend === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="glass-effect border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  All items are well stocked!
                </p>
              ) : (
                lowStockItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg glass-effect"
                  >
                    <div className="flex-1">
                      <p>{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-red-500">{item.stock} left</p>
                        <p className="text-xs text-muted-foreground">
                          Reorder at {item.reorder}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Reorder
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg glass-effect"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.action === 'Stock In'
                          ? 'bg-green-500/20'
                          : activity.action === 'Stock Out'
                          ? 'bg-red-500/20'
                          : 'bg-yellow-500/20'
                      }`}
                    >
                      {activity.action === 'Stock In' && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                      {activity.action === 'Stock Out' && (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      {activity.action === 'Adjustment' && (
                        <Package className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action} • {activity.quantity} units • {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card className="glass-effect border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Purchase Orders</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.status === 'Delivered'
                            ? 'bg-green-500/20 text-green-500'
                            : order.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-blue-500/20 text-blue-500'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}