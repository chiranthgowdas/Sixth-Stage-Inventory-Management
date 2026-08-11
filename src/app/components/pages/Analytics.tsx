import { motion } from 'motion/react';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppStore } from '../../store/AppStore';
import { useMemo } from 'react';

const monthlyData = [
  { month: 'Jan', sales: 45000, purchases: 32000, profit: 13000 },
  { month: 'Feb', sales: 52000, purchases: 38000, profit: 14000 },
  { month: 'Mar', sales: 48000, purchases: 35000, profit: 13000 },
  { month: 'Apr', sales: 61000, purchases: 42000, profit: 19000 },
  { month: 'May', sales: 55000, purchases: 40000, profit: 15000 },
  { month: 'Jun', sales: 67000, purchases: 45000, profit: 22000 },
];

export function Analytics() {
  const { inventoryItems, stockMovements } = useAppStore();

  // Calculate real-time statistics
  const stats = useMemo(() => {
    const totalValue = inventoryItems.reduce((acc, item) => acc + (item.stock * item.price), 0);
    const totalItems = inventoryItems.reduce((acc, item) => acc + item.stock, 0);
    const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock').length;
    const totalMovements = stockMovements.length;

    // Category breakdown
    const categoryStats = inventoryItems.reduce((acc, item) => {
      const existing = acc.find(c => c.name === item.category);
      if (existing) {
        existing.value += item.stock;
      } else {
        acc.push({ 
          name: item.category, 
          value: item.stock,
          color: item.category === 'Liquor' ? '#d4af37' : 
                 item.category === 'Beer' ? '#f59e0b' :
                 item.category === 'Kitchen' ? '#3b82f6' : '#8b5cf6'
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

    // Top items by value
    const topItems = [...inventoryItems]
      .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        sold: item.stock,
        revenue: item.stock * item.price
      }));

    return {
      totalValue,
      totalItems,
      lowStockItems,
      totalMovements,
      categoryStats,
      topItems
    };
  }, [inventoryItems, stockMovements]);

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1671741974888-21b409f4767c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NjAzOTE5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="neon-text mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Track your inventory performance and business insights
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Inventory Value', value: `₹${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: '#d4af37' },
          { title: 'Total Items', value: stats.totalItems.toString(), icon: Package, color: '#3b82f6' },
          { title: 'Low Stock Alerts', value: stats.lowStockItems.toString(), icon: TrendingUp, color: '#ef4444' },
          { title: 'Stock Movements', value: stats.totalMovements.toString(), icon: BarChart3, color: '#8b5cf6' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">
                    {stat.title}
                  </CardTitle>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </CardHeader>
                <CardContent>
                  <div style={{ color: stat.color }}>{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="top-items">Top Items</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle>Sales vs Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                  <XAxis dataKey="month" stroke="#8b8b9a" />
                  <YAxis stroke="#8b8b9a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13131a',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#d4af37" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="purchases" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle>Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                  <XAxis dataKey="month" stroke="#8b8b9a" />
                  <YAxis stroke="#8b8b9a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13131a',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.categoryStats.map((category, index) => {
                    const total = stats.categoryStats.reduce((sum, cat) => sum + cat.value, 0);
                    const percent = total > 0 ? ((category.value / total) * 100).toFixed(0) : 0;
                    return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </motion.div>
                  )})}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-items">
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle>Top Items by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg glass-effect hover:neon-glow transition-all"
                  >
                    <div className="flex-1">
                      <p>{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sold} units in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#d4af37]">₹{item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total value</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
