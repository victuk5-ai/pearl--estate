'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function MyListingsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const myQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'listings'), where('brokerId', '==', user.uid));
  }, [db, user]);

  const { data: myProperties, loading } = useCollection(myQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Listings</CardTitle>
        <CardDescription>Manage your property listings and track their approval status.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : myProperties.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price (UGX)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myProperties.map((property: any) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-white",
                          property.status === 'approved'
                            ? 'bg-green-600'
                            : 'bg-yellow-500'
                        )}
                      >
                        {property.status === 'approved' ? 'Live' : 'Pending Approval'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-UG').format(property.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" className="bg-premium text-white hover:bg-premium/90">
                        <Link href="/premium">
                          <Zap className="mr-2 h-4 w-4" />
                          Boost to Top
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
            <p className="text-lg text-muted-foreground mb-4">You haven't added any listings yet.</p>
            <Button asChild>
              <Link href="/dashboard/add-listing">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}