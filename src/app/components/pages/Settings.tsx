import { motion } from 'motion/react';
import { Save, Bell, Moon, Sun, Globe, Lock, User, Check, MousePointer2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTheme, accentColors } from '../../store/ThemeStore';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const { mode, accentColor, customCursorEnabled, toggleMode, setAccentColor, toggleCustomCursor } = useTheme();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="neon-text mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#d4af37]" />
                Business Information
              </CardTitle>
              <CardDescription>
                Update your resto-bar information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Sixth Stage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Bangalore, Karnataka" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 MG Road, Bangalore, Karnataka 560001"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="info@sixthstage.com" />
                </div>
              </div>
              <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#d4af37]" />
                Regional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="INR (₹)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="IST (UTC+5:30)" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#d4af37]" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: 'low-stock',
                  title: 'Low Stock Alerts',
                  description: 'Get notified when inventory items are running low',
                },
                {
                  id: 'new-orders',
                  title: 'New Purchase Orders',
                  description: 'Receive alerts for new purchase orders',
                },
                {
                  id: 'deliveries',
                  title: 'Delivery Updates',
                  description: 'Get updates on order deliveries and shipments',
                },
                {
                  id: 'reports',
                  title: 'Daily Reports',
                  description: 'Receive daily inventory and sales reports',
                },
                {
                  id: 'suppliers',
                  title: 'Supplier Updates',
                  description: 'Notifications about supplier activities',
                },
              ].map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="space-y-1">
                    <p>{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#d4af37]" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f]">
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="space-y-1">
                    <p>Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="space-y-1">
                    <p>Session Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Auto logout after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          {/* Sixth Stage Gallery */}
          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle>Sixth Stage Gallery</CardTitle>
              <CardDescription>
                Visual showcase of our resto-bar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'https://images.unsplash.com/photo-1648411897425-7713de428509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBpbnRlcmlvciUyMGRhcmslMjBlbGVnYW50fGVufDF8fHx8MTc2MDQzNzIxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  'https://images.unsplash.com/photo-1671741974888-21b409f4767c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NjAzOTE5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  'https://images.unsplash.com/photo-1709396759401-ac2c8e7a069f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzYwNDE5MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  'https://images.unsplash.com/photo-1675152617502-227aed25340d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBjb3VudGVyJTIwbmlnaHR8ZW58MXx8fHwxNzYwNDM3MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  'https://images.unsplash.com/photo-1759912316272-a414bf146476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3Bpcml0cyUyMGJvdHRsZXN8ZW58MXx8fHwxNzYwNDM2Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  'https://images.unsplash.com/photo-1759922221495-78755ac90d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYW1iaWFuY2UlMjBsaWdodGluZ3xlbnwxfHx8fDE3NjA0MjQ4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                ].map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={image}
                      alt={`Sixth Stage ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border">
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="space-y-1">
                  <p>Theme Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className={`w-4 h-4 ${mode === 'light' ? 'text-[var(--primary)]' : 'text-muted-foreground'}`} />
                  <Switch 
                    checked={mode === 'dark'} 
                    onCheckedChange={(checked) => {
                      toggleMode();
                      toast.success(`Switched to ${checked ? 'dark' : 'light'} mode`);
                    }}
                  />
                  <Moon className={`w-4 h-4 ${mode === 'dark' ? 'text-[var(--primary)]' : 'text-muted-foreground'}`} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label>Accent Color</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your preferred accent color for the interface
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {accentColors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAccentColor(color);
                        toast.success(`Accent color changed to ${color.name}`);
                      }}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        accentColor.name === color.name
                          ? 'border-[var(--primary)] shadow-lg'
                          : 'border-border hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color.value }}
                        >
                          {accentColor.name === color.name && (
                            <Check className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MousePointer2 className="w-4 h-4 text-[var(--primary)]" />
                      <p>Custom Cursor</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable custom animated cursor (disabled by default for best compatibility)
                    </p>
                  </div>
                  <Switch 
                    checked={customCursorEnabled} 
                    onCheckedChange={(checked) => {
                      toggleCustomCursor();
                      toast.success(`Custom cursor ${checked ? 'enabled' : 'disabled'}`, {
                        description: checked 
                          ? 'Refresh the page if you experience any issues' 
                          : 'Default system cursor restored'
                      });
                    }}
                  />
                </div>
                {customCursorEnabled && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-sm text-yellow-500">
                      ⚠️ <strong>Note:</strong> If your cursor feels misaligned or clicks don't work properly, 
                      disable this option and refresh the page.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm">
                  <span className="text-[var(--primary)] font-medium">Current Theme:</span>{' '}
                  {mode === 'dark' ? 'Dark' : 'Light'} mode with {accentColor.name} accent
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
