import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useLoginAttempts } from '@/hooks/useLoginAttempts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Loader2, AlertTriangle, Lock, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const { signIn, user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { 
    isLocked, 
    lockoutRemaining, 
    formatLockoutTime, 
    recentAttempts,
    logAttempt,
    isCheckingLockout 
  } = useLoginAttempts(email);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && !roleLoading) {
      if (isAdmin) {
        navigate('/admin');
      } else if (checkingRole) {
        // Log failed attempt - not an admin
        logAttempt(false, 'User does not have admin privileges', user.id);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        setCheckingRole(false);
        setIsLoading(false);
      }
    }
  }, [user, isAdmin, roleLoading, navigate, checkingRole, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Too many failed attempts. Try again in ${formatLockoutTime(lockoutRemaining)}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCheckingRole(true);

    const { error } = await signIn(email, password);

    if (error) {
      // Log failed attempt
      await logAttempt(false, error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      setCheckingRole(false);
    } else {
      // Log successful attempt - will be checked for admin role in useEffect
      // We'll log the final result after role check
    }
  };

  // Log successful admin login
  useEffect(() => {
    if (user && isAdmin && checkingRole) {
      logAttempt(true, undefined, user.id);
    }
  }, [user, isAdmin, checkingRole]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Sign in to access the admin panel</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your admin credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-500">
                This area is restricted to authorized administrators only.
              </AlertDescription>
            </Alert>

            {isLocked && (
              <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                <Lock className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive flex items-center gap-2">
                  <span>Account temporarily locked.</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {formatLockoutTime(lockoutRemaining)}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                  disabled={isLocked}
                />
                {isCheckingLockout && email.includes('@') && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking status...
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 pr-10"
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {checkingRole ? 'Verifying access...' : 'Signing in...'}
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Account Locked
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>

            {/* Recent Login History */}
            {recentAttempts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Login Attempts</h4>
                <div className="space-y-2">
                  {recentAttempts.slice(0, 3).map((attempt) => (
                    <div 
                      key={attempt.id} 
                      className={`flex items-center justify-between text-xs p-2 rounded-md ${
                        attempt.success 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {attempt.success ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>{attempt.success ? 'Successful login' : attempt.failure_reason || 'Failed attempt'}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2 text-center text-sm">
              <div>
                <span className="text-muted-foreground">First time setup? </span>
                <Link to="/admin-register" className="text-primary hover:underline font-medium">
                  Register as Admin
                </Link>
              </div>
              <div>
                <span className="text-muted-foreground">Not an admin? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  User login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
