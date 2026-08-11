import { ReactNode, useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  History,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  UtensilsCrossed,
  Trash2,
  FileText,
  TrendingUp,
  Truck,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { NotificationCenter } from './NotificationCenter';
import { QuickThemeToggle } from './QuickThemeToggle';
import { useAppStore } from '../store/AppStore';
import { useTheme } from '../store/ThemeStore';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { id: 'stock-movement', label: 'Stock Movement', icon: History },
  { id: 'wastage', label: 'Wastage & Spoilage', icon: Trash2 },
  { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
  { id: 'activity-log', label: 'Activity Log', icon: FileText },
  { id: 'user-management', label: 'User Management', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAppStore();
  const { mode, toggleMode } = useTheme();

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter(item => {
    if (!currentUser) return true;
    
    switch (item.id) {
      case 'user-management':
        return currentUser.permissions.viewUsers;
      case 'analytics':
      case 'activity-log':
        return currentUser.permissions.viewReports;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow glass-effect border-r border-border overflow-y-auto relative">
          {/* Subtle background pattern */}
          <div 
            className="absolute inset-0 opacity-5 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1759922221495-78755ac90d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYW1iaWFuY2UlMjBsaWdodGluZ3xlbnwxfHx8fDE3NjA0MjQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            }}
          />
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border relative z-10">
            <UtensilsCrossed className="w-8 h-8 text-[#d4af37]" />
            <div>
              <h1 className="neon-text">Sixth Stage</h1>
              <p className="text-xs text-muted-foreground">Inventory Manager</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 relative z-10">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#d4af37] text-[#0a0a0f]'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 glass-effect border-r border-border">
            <div className="flex items-center justify-between px-6 py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-8 h-8 text-[#d4af37]" />
                <div>
                  <h1 className="neon-text">Sixth Stage</h1>
                  <p className="text-xs text-muted-foreground">Inventory Manager</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#d4af37] text-[#0a0a0f]'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 glass-effect border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10 w-64 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMode}
                className="relative group"
              >
                {mode === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--primary)] group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--primary)] group-hover:-rotate-12 transition-transform" />
                )}
              </Button>

              <NotificationCenter />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="bg-[#d4af37] text-[#0a0a0f]">
                        {currentUser?.name.substring(0, 2).toUpperCase() || 'AD'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{currentUser?.name || 'Admin'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('login')}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Quick Theme Toggle */}
        <QuickThemeToggle />
      </div>
    </div>
  );
}