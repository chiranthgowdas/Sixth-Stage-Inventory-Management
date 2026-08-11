import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, AlertTriangle, Package, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useAppStore } from '../store/AppStore';
import { toast } from 'sonner@2.0.3';

export function NotificationCenter() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'low-stock':
        return <Package className="w-4 h-4" />;
      case 'expiry':
        return <AlertTriangle className="w-4 h-4" />;
      case 'delivery':
        return <Calendar className="w-4 h-4" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4" />;
      case 'wastage':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-500';
    if (type === 'low-stock') return 'text-yellow-500';
    if (type === 'expiry') return 'text-orange-500';
    if (type === 'delivery') return 'text-blue-500';
    if (type === 'approval') return 'text-green-500';
    if (type === 'wastage') return 'text-red-400';
    return 'text-[#d4af37]';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    toast.success('All notifications marked as read');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-96 glass-effect border border-border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-[#d4af37]">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-96">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                    <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground text-center">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-secondary/20' : ''
                        }`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              notification.priority === 'high'
                                ? 'bg-red-500/20'
                                : 'bg-[#d4af37]/20'
                            }`}
                          >
                            <span className={getColor(notification.type, notification.priority)}>
                              {getIcon(notification.type)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <Badge
                                  variant="default"
                                  className="bg-[#d4af37] text-[#0a0a0f] text-xs px-1.5 py-0 h-5"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
