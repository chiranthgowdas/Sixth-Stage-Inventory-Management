import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Active' | 'Inactive';
  avatar?: string;
  permissions: {
    viewInventory: boolean;
    editInventory: boolean;
    deleteInventory: boolean;
    viewReports: boolean;
    viewUsers: boolean;
    editUsers: boolean;
    viewSuppliers: boolean;
    editSuppliers: boolean;
    approvePurchaseOrders: boolean;
  };
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  costPrice: number;
  status: string;
  lastUpdated?: string;
  reorderLevel: number;
  expiryDate?: string;
  barcode?: string;
  image?: string;
}

export interface StockMovementRecord {
  id: number;
  itemId: number;
  itemName: string;
  type: 'In' | 'Out' | 'Adjustment' | 'Wastage';
  quantity: number;
  date: string;
  user: string;
  notes: string;
  reason?: string;
}

export interface WastageRecord {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  date: string;
  reason: string;
  user: string;
  costImpact: number;
  category: string;
  image?: string;
}

export interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'low-stock' | 'expiry' | 'delivery' | 'approval' | 'wastage';
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  supplierId: number;
  items: { itemId: number; itemName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Shipped' | 'Received' | 'Paid';
  createdDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  createdBy: string;
  approvedBy?: string;
  notes?: string;
}

interface AppState {
  users: User[];
  inventoryItems: InventoryItem[];
  stockMovements: StockMovementRecord[];
  wastageRecords: WastageRecord[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  purchaseOrders: PurchaseOrder[];
  currentUser: User | null;
}

interface AppContextType extends AppState {
  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  registerUser: (user: Omit<User, 'id' | 'status' | 'permissions'>) => boolean;
  loginUser: (email: string, password: string) => User | null;
  logoutUser: () => void;
  
  // Inventory Management
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;
  
  // Stock Movement
  addStockMovement: (movement: Omit<StockMovementRecord, 'id'>) => void;
  
  // Wastage
  addWastageRecord: (wastage: Omit<WastageRecord, 'id'>) => void;
  
  // Activity Logs
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  
  // Purchase Orders
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdDate'>) => void;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDefaultPermissions = (role: User['role']) => {
  if (role === 'Admin') {
    return {
      viewInventory: true,
      editInventory: true,
      deleteInventory: true,
      viewReports: true,
      viewUsers: true,
      editUsers: true,
      viewSuppliers: true,
      editSuppliers: true,
      approvePurchaseOrders: true,
    };
  } else if (role === 'Manager') {
    return {
      viewInventory: true,
      editInventory: true,
      deleteInventory: true,
      viewReports: true,
      viewUsers: true,
      editUsers: false,
      viewSuppliers: true,
      editSuppliers: true,
      approvePurchaseOrders: true,
    };
  } else {
    return {
      viewInventory: true,
      editInventory: true,
      deleteInventory: false,
      viewReports: false,
      viewUsers: false,
      editUsers: false,
      viewSuppliers: true,
      editSuppliers: false,
      approvePurchaseOrders: false,
    };
  }
};

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@sixthstage.com',
    password: 'admin123',
    role: 'Admin',
    status: 'Active',
    permissions: getDefaultPermissions('Admin'),
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    email: 'rajesh@sixthstage.com',
    password: 'manager123',
    role: 'Manager',
    status: 'Active',
    permissions: getDefaultPermissions('Manager'),
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@sixthstage.com',
    password: 'staff123',
    role: 'Staff',
    status: 'Active',
    permissions: getDefaultPermissions('Staff'),
  },
];

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Butter Chicken (Ready)', category: 'Main Course', stock: 45, unit: 'Portions', price: 450, costPrice: 180, status: 'In Stock', reorderLevel: 15, barcode: '7312040017201', lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 2, name: 'Paneer Tikka Masala', category: 'Main Course', stock: 6, unit: 'Portions', price: 380, costPrice: 150, status: 'Low Stock', reorderLevel: 10, barcode: '5099873089989', lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 3, name: 'Fresh Tomatoes', category: 'Kitchen', stock: 12, unit: 'Kg', price: 150, costPrice: 80, status: 'Low Stock', reorderLevel: 20, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-28' },
  { id: 4, name: 'Olive Oil (Premium)', category: 'Kitchen Supplies', stock: 5, unit: 'Bottles', price: 680, costPrice: 450, status: 'Low Stock', reorderLevel: 10, lastUpdated: new Date().toISOString(), expiryDate: '2025-06-15' },
  { id: 5, name: 'Chicken Biryani (Ready)', category: 'Main Course', stock: 28, unit: 'Portions', price: 420, costPrice: 200, status: 'In Stock', reorderLevel: 10, barcode: '5010677850087', lastUpdated: new Date().toISOString(), expiryDate: '2024-11-25' },
  { id: 6, name: 'Basmati Rice (Premium)', category: 'Kitchen Supplies', stock: 10, unit: 'Kg', price: 180, costPrice: 120, status: 'Low Stock', reorderLevel: 15, lastUpdated: new Date().toISOString(), expiryDate: '2025-03-30' },
  { id: 7, name: 'Masala Dosa Batter', category: 'Breakfast', stock: 156, unit: 'Portions', price: 120, costPrice: 50, status: 'In Stock', reorderLevel: 50, barcode: '7501064191954', lastUpdated: new Date().toISOString(), expiryDate: '2024-11-27' },
  { id: 8, name: 'Chicken Tandoori (Marinated)', category: 'Main Course', stock: 32, unit: 'Portions', price: 480, costPrice: 220, status: 'In Stock', reorderLevel: 12, barcode: '5010677850124', lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 9, name: 'Fresh Coriander', category: 'Kitchen', stock: 8, unit: 'Kg', price: 300, costPrice: 200, status: 'Low Stock', reorderLevel: 12, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 10, name: 'Gulab Jamun (Ready)', category: 'Dessert', stock: 18, unit: 'Portions', price: 120, costPrice: 60, status: 'In Stock', reorderLevel: 8, barcode: '5000267013527', lastUpdated: new Date().toISOString(), expiryDate: '2024-12-15' },
  { id: 11, name: 'Dal Makhani (Ready)', category: 'Main Course', stock: 35, unit: 'Portions', price: 280, costPrice: 110, status: 'In Stock', reorderLevel: 15, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 12, name: 'Fresh Onions', category: 'Kitchen', stock: 8, unit: 'Kg', price: 80, costPrice: 40, status: 'Low Stock', reorderLevel: 15, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-30' },
  { id: 13, name: 'Naan Bread (Frozen)', category: 'Bakery', stock: 100, unit: 'Pieces', price: 30, costPrice: 12, status: 'In Stock', reorderLevel: 50, lastUpdated: new Date().toISOString(), expiryDate: '2025-01-30' },
  { id: 14, name: 'Samosa (Frozen)', category: 'Appetizers', stock: 7, unit: 'Boxes', price: 250, costPrice: 120, status: 'Low Stock', reorderLevel: 10, lastUpdated: new Date().toISOString(), expiryDate: '2024-12-20' },
  { id: 15, name: 'Mango Lassi Mix', category: 'Beverages', stock: 42, unit: 'Liters', price: 180, costPrice: 90, status: 'In Stock', reorderLevel: 20, lastUpdated: new Date().toISOString(), expiryDate: '2024-12-10' },
  { id: 16, name: 'Green Chutney', category: 'Kitchen Supplies', stock: 15, unit: 'Kg', price: 200, costPrice: 100, status: 'In Stock', reorderLevel: 10, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-28' },
  { id: 17, name: 'Rasgulla (Ready)', category: 'Dessert', stock: 5, unit: 'Boxes', price: 350, costPrice: 180, status: 'Low Stock', reorderLevel: 8, lastUpdated: new Date().toISOString(), expiryDate: '2024-12-05' },
  { id: 18, name: 'Palak Paneer (Ready)', category: 'Main Course', stock: 22, unit: 'Portions', price: 380, costPrice: 160, status: 'In Stock', reorderLevel: 15, lastUpdated: new Date().toISOString(), expiryDate: '2024-11-26' },
  { id: 19, name: 'Chai Tea Mix', category: 'Beverages', stock: 25, unit: 'Kg', price: 450, costPrice: 220, status: 'In Stock', reorderLevel: 10, lastUpdated: new Date().toISOString(), expiryDate: '2025-03-15' },
  { id: 20, name: 'Kulfi Ice Cream', category: 'Dessert', stock: 40, unit: 'Pieces', price: 80, costPrice: 35, status: 'In Stock', reorderLevel: 20, lastUpdated: new Date().toISOString(), expiryDate: '2025-02-28' },
];

const initialStockMovements: StockMovementRecord[] = [
  { id: 1, itemId: 1, itemName: 'Butter Chicken (Ready)', type: 'In', quantity: 24, date: '2024-10-10', user: 'Rajesh Kumar', notes: 'Received from Fresh Foods Suppliers' },
  { id: 2, itemId: 2, itemName: 'Paneer Tikka Masala', type: 'Out', quantity: 12, date: '2024-10-12', user: 'Admin User', notes: 'Kitchen consumption' },
  { id: 3, itemId: 7, itemName: 'Masala Dosa Batter', type: 'In', quantity: 72, date: '2024-10-13', user: 'Rajesh Kumar', notes: 'Weekly stock replenishment' },
];

const initialWastage: WastageRecord[] = [
  { id: 1, itemId: 3, itemName: 'Fresh Tomatoes', quantity: 2, date: '2024-10-14', reason: 'Spoilage - Overripe', user: 'Priya Sharma', costImpact: 160, category: 'Kitchen' },
  { id: 2, itemId: 9, itemName: 'Fresh Coriander', quantity: 1, date: '2024-10-13', reason: 'Wilted leaves', user: 'Priya Sharma', costImpact: 200, category: 'Kitchen' },
];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventory);
  const [stockMovements, setStockMovements] = useState<StockMovementRecord[]>(initialStockMovements);
  const [wastageRecords, setWastageRecords] = useState<WastageRecord[]>(initialWastage);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for expiring items and low stock
  useEffect(() => {
    if (currentUser) {
      checkAndCreateNotifications();
    }
  }, [inventoryItems, currentUser]);

  const checkAndCreateNotifications = () => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    inventoryItems.forEach(item => {
      // Low stock notification
      if (item.stock <= item.reorderLevel) {
        const existingNotif = notifications.find(
          n => n.type === 'low-stock' && n.message.includes(item.name) && !n.read
        );
        if (!existingNotif) {
          addNotification({
            title: 'Low Stock Alert',
            message: `${item.name} is running low (${item.stock} ${item.unit} remaining)`,
            type: 'low-stock',
            priority: item.stock < item.reorderLevel / 2 ? 'high' : 'medium',
          });
        }
      }

      // Expiry notification
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        if (expiryDate <= sevenDaysFromNow && expiryDate > today) {
          const existingNotif = notifications.find(
            n => n.type === 'expiry' && n.message.includes(item.name) && !n.read
          );
          if (!existingNotif) {
            addNotification({
              title: 'Expiry Alert',
              message: `${item.name} expiring on ${item.expiryDate}`,
              type: 'expiry',
              priority: 'high',
            });
          }
        }
      }
    });
  };

  // User Management Functions
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.max(...users.map(u => u.id), 0) + 1 };
    setUsers([...users, newUser]);
    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'User Added',
      details: `Added new user: ${newUser.name} (${newUser.role})`,
      type: 'success',
    });
  };

  const updateUser = (id: number, updatedUser: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updatedUser } : u));
    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'User Updated',
      details: `Updated user settings for user ID: ${id}`,
      type: 'info',
    });
  };

  const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'User Deleted',
      details: `Deleted user: ${user?.name}`,
      type: 'warning',
    });
  };

  const registerUser = (user: Omit<User, 'id' | 'status' | 'permissions'>): boolean => {
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    const newUser = { 
      ...user, 
      id: Math.max(...users.map(u => u.id), 0) + 1, 
      status: 'Active' as const,
      permissions: getDefaultPermissions(user.role),
    };
    setUsers([...users, newUser]);
    addActivityLog({
      user: 'System',
      action: 'User Registered',
      details: `New user registered: ${newUser.name} (${newUser.email})`,
      type: 'success',
    });
    return true;
  };

  const loginUser = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password && u.status === 'Active');
    if (user) {
      setCurrentUser(user);
      addActivityLog({
        user: user.name,
        action: 'Login',
        details: `User logged in successfully`,
        type: 'info',
      });
      return user;
    }
    return null;
  };

  const logoutUser = () => {
    if (currentUser) {
      addActivityLog({
        user: currentUser.name,
        action: 'Logout',
        details: `User logged out`,
        type: 'info',
      });
    }
    setCurrentUser(null);
  };

  // Inventory Management Functions
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = { 
      ...item, 
      id: Math.max(...inventoryItems.map(i => i.id), 0) + 1,
      lastUpdated: new Date().toISOString()
    };
    setInventoryItems([...inventoryItems, newItem]);
    
    addStockMovement({
      itemId: newItem.id,
      itemName: newItem.name,
      type: 'In',
      quantity: newItem.stock,
      date: new Date().toISOString().split('T')[0],
      user: currentUser?.name || 'System',
      notes: 'Initial stock'
    });

    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'Item Added',
      details: `Added new item: ${newItem.name} (${newItem.stock} ${newItem.unit})`,
      type: 'success',
    });
  };

  const updateInventoryItem = (id: number, updatedItem: Partial<InventoryItem>) => {
    const oldItem = inventoryItems.find(i => i.id === id);
    const newItemData = { ...updatedItem, lastUpdated: new Date().toISOString() };
    
    setInventoryItems(inventoryItems.map(i => 
      i.id === id ? { ...i, ...newItemData } : i
    ));

    if (oldItem && updatedItem.stock !== undefined && oldItem.stock !== updatedItem.stock) {
      const diff = updatedItem.stock - oldItem.stock;
      addStockMovement({
        itemId: id,
        itemName: oldItem.name,
        type: diff > 0 ? 'In' : 'Out',
        quantity: Math.abs(diff),
        date: new Date().toISOString().split('T')[0],
        user: currentUser?.name || 'System',
        notes: diff > 0 ? 'Stock added' : 'Stock removed'
      });

      addActivityLog({
        user: currentUser?.name || 'System',
        action: 'Stock Updated',
        details: `Updated ${oldItem.name}: ${oldItem.stock} → ${updatedItem.stock} ${oldItem.unit}`,
        type: 'info',
      });
    }
  };

  const deleteInventoryItem = (id: number) => {
    const item = inventoryItems.find(i => i.id === id);
    if (item) {
      addStockMovement({
        itemId: id,
        itemName: item.name,
        type: 'Out',
        quantity: item.stock,
        date: new Date().toISOString().split('T')[0],
        user: currentUser?.name || 'System',
        notes: 'Item deleted from inventory'
      });

      addActivityLog({
        user: currentUser?.name || 'System',
        action: 'Item Deleted',
        details: `Deleted item: ${item.name}`,
        type: 'warning',
      });
    }
    setInventoryItems(inventoryItems.filter(i => i.id !== id));
  };

  // Stock Movement Functions
  const addStockMovement = (movement: Omit<StockMovementRecord, 'id'>) => {
    const newMovement = { ...movement, id: Math.max(...stockMovements.map(m => m.id), 0) + 1 };
    setStockMovements([newMovement, ...stockMovements]);
  };

  // Wastage Functions
  const addWastageRecord = (wastage: Omit<WastageRecord, 'id'>) => {
    const newWastage = { ...wastage, id: Math.max(...wastageRecords.map(w => w.id), 0) + 1 };
    setWastageRecords([newWastage, ...wastageRecords]);

    // Update inventory
    const item = inventoryItems.find(i => i.id === wastage.itemId);
    if (item) {
      updateInventoryItem(wastage.itemId, { stock: item.stock - wastage.quantity });
    }

    // Add to stock movements
    addStockMovement({
      itemId: wastage.itemId,
      itemName: wastage.itemName,
      type: 'Wastage',
      quantity: wastage.quantity,
      date: wastage.date,
      user: wastage.user,
      notes: `Wastage: ${wastage.reason}`,
      reason: wastage.reason,
    });

    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'Wastage Recorded',
      details: `Wastage: ${wastage.itemName} - ${wastage.quantity} units (${wastage.reason})`,
      type: 'error',
    });

    addNotification({
      title: 'Wastage Recorded',
      message: `${wastage.itemName}: ${wastage.quantity} units wasted - ${wastage.reason}`,
      type: 'wastage',
      priority: 'medium',
    });
  };

  // Activity Log Functions
  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Math.max(...activityLogs.map(l => l.id), 0) + 1,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Notification Functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Math.max(...notifications.map(n => n.id), 0) + 1,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Purchase Order Functions
  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'createdDate'>) => {
    const newPO = {
      ...po,
      id: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);

    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'PO Created',
      details: `Created purchase order ${newPO.id} for ${newPO.supplier}`,
      type: 'success',
    });

    if (po.status === 'Pending') {
      addNotification({
        title: 'PO Pending Approval',
        message: `Purchase order ${newPO.id} requires approval`,
        type: 'approval',
        priority: 'medium',
      });
    }
  };

  const updatePurchaseOrder = (id: string, updatedPO: Partial<PurchaseOrder>) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, ...updatedPO } : po));

    addActivityLog({
      user: currentUser?.name || 'System',
      action: 'PO Updated',
      details: `Updated purchase order ${id}`,
      type: 'info',
    });

    if (updatedPO.status === 'Approved') {
      addNotification({
        title: 'PO Approved',
        message: `Purchase order ${id} has been approved`,
        type: 'approval',
        priority: 'high',
      });
    } else if (updatedPO.status === 'Shipped') {
      addNotification({
        title: 'PO Shipped',
        message: `Purchase order ${id} has been shipped`,
        type: 'delivery',
        priority: 'medium',
      });
    }
  };

  const value: AppContextType = {
    users,
    inventoryItems,
    stockMovements,
    wastageRecords,
    activityLogs,
    notifications,
    purchaseOrders,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    logoutUser,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addStockMovement,
    addWastageRecord,
    addActivityLog,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addPurchaseOrder,
    updatePurchaseOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}