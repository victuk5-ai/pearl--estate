'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function GoPremium() {
  return (
    <Button
      asChild
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-premium text-white shadow-lg transition-transform hover:scale-110 hover:bg-premium/90 focus:ring-4 focus:ring-premium/50"
      aria-label="Go Premium"
    >
      <Link href="/premium">
        <Zap className="h-8 w-8" />
      </Link>
    </Button>
  );
}
