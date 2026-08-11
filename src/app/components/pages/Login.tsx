import { useState } from 'react';
import { motion } from 'motion/react';
import { UtensilsCrossed, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAppStore } from '../../store/AppStore';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const { loginUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    const user = loginUser(email, password);

    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      onLogin();
    } else {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 glass-effect">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo & Title */}
          <div className="text-center space-y-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block"
            >
              <UtensilsCrossed className="w-16 h-16 text-[#d4af37] mx-auto" />
            </motion.div>
            <div>
              <h1 className="neon-text">Sixth Stage</h1>
              <p className="text-muted-foreground mt-2">Inventory Management System</p>
            </div>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@sixthstage.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-sm text-[#d4af37] hover:text-[#f4d03f] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#d4af37] hover:bg-[#f4d03f] text-[#0a0a0f] group"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-[#d4af37] hover:text-[#f4d03f] transition-colors"
                >
                  Register here
                </button>
              </p>
            </div>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-effect p-4 rounded-lg border border-border"
          >
            <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p className="text-[#d4af37]">Admin: admin@sixthstage.com / admin123</p>
              <p className="text-[#d4af37]">Manager: rajesh@sixthstage.com / manager123</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Background Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM5NTk4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Sixth Stage Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-[#d4af37]/10" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-4 neon-text">Welcome to Sixth Stage</h2>
            <p className="text-lg">
              Premium restaurant in the heart of Bangalore, Karnataka
            </p>
            <p className="text-muted-foreground mt-2">
              Manage your inventory efficiently with our modern dashboard
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}