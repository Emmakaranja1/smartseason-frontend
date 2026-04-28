import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Map as MapIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();

  const from = location.state?.from?.pathname || '/';

  // Handle redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.name || 'User'}!`);
      
      // Redirect based on role if no 'from' path
      if (from === '/') {
        navigate(user.role === 'ADMIN' ? '/admin' : '/agent');
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2670" 
          alt="Natural Green Farm" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 3 }}
            className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-900/50 mb-4"
          >
            <MapIcon size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">SmartSeason</h1>
          <p className="text-emerald-50 font-medium mt-2 drop-shadow-sm">Field Monitoring System</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/95 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-stone-900">Welcome back</CardTitle>
            <CardDescription className="text-stone-500">Access your agricultural coordinator dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-stone-200 h-12 bg-stone-50/50 focus:bg-white transition-all text-stone-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-stone-200 h-12 bg-stone-50/50 focus:bg-white transition-all pr-12 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-8 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
              
                          </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-emerald-50/70 mt-8 drop-shadow-sm font-medium">
          &copy; {new Date().getFullYear()} SmartSeason Field Monitoring System
        </p>
      </motion.div>
    </div>
  );
};