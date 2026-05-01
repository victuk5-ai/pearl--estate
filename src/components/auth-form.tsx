'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from './icons';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type AuthFormProps = {
  type: 'login' | 'register';
};

const ADMIN_EMAIL = 'Victuk5@gmail.com';

export default function AuthForm({ type }: AuthFormProps) {
  const isLogin = type === 'login';
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirect = (userEmail: string | null) => {
    if (userEmail === ADMIN_EMAIL) {
      router.push('/admin-portal');
    } else {
      router.push('/dashboard');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
        handleRedirect(userCredential.user.email);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast({ title: 'Account created!', description: 'Welcome to Pearl Estate.' });
        handleRedirect(userCredential.user.email);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Logged in with Google.' });
      handleRedirect(userCredential.user.email);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
       <Link href="/" className="absolute left-8 top-8 flex items-center text-lg font-semibold tracking-tight text-primary">
        <Icons.logo className="mr-2 h-6 w-6" />
        <span className="font-headline">Pearl Estate</span>
      </Link>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {isLogin ? 'Login' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your email below to login to your account'
              : 'Enter your email below to create an account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="grid gap-4">
            {!isLogin && (
                 <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Login' : 'Create account'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLogin ? 'Login with Google' : 'Sign up with Google'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Link href={isLogin ? '/register' : '/login'} className="underline ml-1">
              {isLogin ? 'Sign up' : 'Login'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
