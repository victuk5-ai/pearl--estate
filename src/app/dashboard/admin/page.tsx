'use client';

import { useState, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { properties as allProperties } from '@/lib/data';
import type { Property } from '@/lib/types';
import { Check, X } from 'lucide-react';

export default function AdminApprovalPage() {
  const { toast } = useToast();
  const initialPendingProperties = useMemo(() => allProperties.filter((p) => p.status === 'pending'), []);
  const [pendingProperties, setPendingProperties] = useState<Property[]>(initialPendingProperties);

  const handleApprove = (propertyId: string, propertyTitle: string) => {
    setPendingProperties(prev => prev.filter(p => p.id !== propertyId));
    toast({
      title: 'Property Approved',
      description: `"${propertyTitle}" has been approved and is now live.`,
    });
  };

  const handleReject = (propertyId: string, propertyTitle: string) => {
    setPendingProperties(prev => prev.filter(p => p.id !== propertyId));
    toast({
      variant: 'destructive',
      title: 'Property Rejected',
      description: `"${propertyTitle}" has been rejected.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Admin Approval</CardTitle>
        <CardDescription>Review and approve or reject new property submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingProperties.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price (UGX)</TableHead>
                  <TableHead>Broker</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-UG').format(property.price)}
                    </TableCell>
                    <TableCell>{property.broker.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(property.id, property.title)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(property.id, property.title)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border rounded-md">
            <p className="text-lg">No pending properties to review.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
