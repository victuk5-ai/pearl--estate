import Link from 'next/link';
import {
  Home,
  PlusCircle,
  List,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Header from '@/components/layout/header';
import { Icons } from '@/components/icons';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden border-r bg-muted/40 md:flex">
          <nav className="flex flex-col items-center justify-between gap-4 px-2 sm:py-5">
            <div className="flex flex-col items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/add-listing"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span className="sr-only">Add Listing</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Add Listing</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/my-listings"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <List className="h-5 w-5" />
                      <span className="sr-only">My Listings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">My Listings</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/admin"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="sr-only">Admin Approval</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Admin Approval</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://wa.me/256706631303?text=I%20need%20help%20with%20Pearl%20Estate."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white transition-colors hover:bg-green-600 md:h-8 md:w-8"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="sr-only">WhatsApp Admin</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">WhatsApp Admin</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="tel:+256706631303"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 md:h-8 md:w-8"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="sr-only">Call Admin</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">Call Admin</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
