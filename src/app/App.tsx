import { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Dashboard } from './components/pages/Dashboard';
import { Inventory } from './components/pages/Inventory';
import { Suppliers } from './components/pages/Suppliers';
import { PurchaseOrders } from './components/pages/PurchaseOrders';
import { StockMovement } from './components/pages/StockMovement';
import { Analytics } from './components/pages/Analytics';
import { UserManagement } from './components/pages/UserManagement';
import { Settings } from './components/pages/Settings';
import { ActivityLog } from './components/pages/ActivityLog';
import { Wastage } from './components/pages/Wastage';
import { Toaster } from './components/ui/sonner';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { AppStoreProvider, useAppStore } from './store/AppStore';
import { ThemeProvider, useTheme } from './store/ThemeStore';
import { X, MousePointer2 } from 'lucide-react';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showCursorAlert, setShowCursorAlert] = useState(true);
  const { currentUser, logoutUser } = useAppStore();
  const { customCursorEnabled, setCustomCursorEnabled } = useTheme();

  useEffect(() => {
    // Ensure cursor is always visible on load (failsafe)
    document.body.classList.remove('custom-cursor-enabled');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      handleLogout();
    } else {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <>
        <CustomCursor enabled={customCursorEnabled} />
        <LoadingScreen />
      </>
    );
  }

  if (!currentUser) {
    if (currentPage === 'register') {
      return (
        <>
          <CustomCursor enabled={customCursorEnabled} />
          <Register onNavigate={handleNavigate} />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <CustomCursor enabled={customCursorEnabled} />
        <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'suppliers':
        return <Suppliers />;
      case 'purchase-orders':
        return <PurchaseOrders />;
      case 'stock-movement':
        return <StockMovement />;
      case 'wastage':
        return <Wastage />;
      case 'analytics':
        return <Analytics />;
      case 'activity-log':
        return <ActivityLog />;
      case 'user-management':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <CustomCursor enabled={customCursorEnabled} />
      
      {/* Custom Cursor Alert */}
      {customCursorEnabled && showCursorAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] max-w-2xl w-full px-4">
          <Alert className="glass-effect border-yellow-500/30 bg-yellow-500/10">
            <MousePointer2 className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span className="text-sm">
                <strong className="text-yellow-500">Custom cursor enabled.</strong> If clicks don't work properly, 
                disable it in Settings → Branding.
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCustomCursorEnabled(false);
                    setShowCursorAlert(false);
                  }}
                  className="shrink-0"
                >
                  Disable Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCursorAlert(false)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <DashboardLayout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </DashboardLayout>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppStoreProvider>
        <AppContent />
      </AppStoreProvider>
    </ThemeProvider>
  );
}
