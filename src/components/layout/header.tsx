'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Menu, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = user?.email === 'Victuk5@gmail.com';

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#properties', label: 'Properties' },
    { href: '/dashboard', label: 'Broker Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden items-center md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Pearl Estate
            </span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Button key={link.label} variant="ghost" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {isAdmin && (
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
                <Link href="/admin-portal">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Portal
                </Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-block"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="flex items-center space-x-2">
                  <Icons.logo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">Pearl Estate</span>
                </Link>
                <div className="mt-6 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Button key={link.href} variant="ghost" asChild className="justify-start">
                        <Link href={link.href}>
                            {link.label}
                        </Link>
                    </Button>
                  ))}
                  {isAdmin && (
                    <Button variant="outline" asChild className="justify-start border-primary text-primary">
                      <Link href="/admin-portal">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Portal
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Pearl Estate</span>
          </Link>
          <div className="flex items-center space-x-2">
            {user ? (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}