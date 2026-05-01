'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useStorage } from '@/firebase';
import { collection, query, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Loader2, ShieldAlert, Trash2, Edit, ImagePlus } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';

const ADMIN_EMAIL = 'Victuk5@gmail.com';

export default function AdminPortalPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [newPhotos, setNewPhotos] = useState<{ file: File; url: string }[]>([]);

  const listingsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'listings'));
  }, [db]);

  const { data: allListings, loading: dataLoading } = useCollection(listingsQuery);

  const pendingListings = useMemo(() => allListings.filter((l: any) => l.status === 'pending'), [allListings]);
  const liveListings = useMemo(() => allListings.filter((l: any) => l.status === 'approved'), [allListings]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleApprove = async (id: string, title: string) => {
    if (!isAdmin) return;
    setIsActionLoading(id);
    try {
      const docRef = doc(db, 'listings', id);
      await updateDoc(docRef, { status: 'approved' });
      toast({
        title: 'Listing Approved',
        description: `"${title}" is now Live.`,
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Approval Failed', description: error.message });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setIsActionLoading(id);
    try {
      const docRef = doc(db, 'listings', id);
      await deleteDoc(docRef);
      toast({
        title: 'Listing Deleted',
        description: `"${title}" has been removed.`,
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPhotos((prev) => [...prev, { file, url: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpdateListing = async () => {
    if (!editingListing || !isAdmin) return;
    setIsActionLoading(editingListing.id);

    try {
      let imageUrls = editingListing.imageUrls || [];

      if (newPhotos.length > 0) {
        imageUrls = [];
        for (const item of newPhotos) {
          const imageRef = ref(storage, `property_images/${editingListing.id}/${item.file.name}`);
          const snapshot = await uploadBytes(imageRef, item.file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          imageUrls.push(downloadUrl);
        }
      }

      const docRef = doc(db, 'listings', editingListing.id);
      await updateDoc(docRef, {
        title: editingListing.title,
        price: Number(editingListing.price),
        location: editingListing.location,
        imageUrls: imageUrls,
        updatedAt: serverTimestamp(),
      });

      toast({ title: 'Success', description: 'Listing updated successfully.' });
      setEditingListing(null);
      setNewPhotos([]);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
      setIsActionLoading(null);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold font-headline">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">This area is reserved for the platform administrator (Victuk5@gmail.com).</p>
        <Button asChild className="mt-6" variant="outline">
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  const ListingsTable = ({ listings }: { listings: any[] }) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Broker</TableHead>
            <TableHead>Price (UGX)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing: any) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {listing.imageUrls?.[0] && (
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image src={listing.imageUrls[0]} alt="" fill className="object-cover" />
                    </div>
                  )}
                  {listing.title}
                </div>
              </TableCell>
              <TableCell>{listing.location}</TableCell>
              <TableCell>{listing.brokerName}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-UG').format(listing.price)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {listing.status === 'pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(listing.id, listing.title)}
                    disabled={isActionLoading === listing.id}
                  >
                    {isActionLoading === listing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingListing({ ...listing })}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(listing.id, listing.title)}
                  disabled={isActionLoading === listing.id}
                >
                  {isActionLoading === listing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 py-8">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="font-headline text-4xl font-bold">Admin Portal</h1>
              <p className="text-muted-foreground mt-1 text-lg">Manage all property listings on Pearl Estate.</p>
            </div>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="pending">
                Pending ({pendingListings.length})
              </TabsTrigger>
              <TabsTrigger value="live">
                Live ({liveListings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {dataLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : pendingListings.length > 0 ? (
                <ListingsTable listings={pendingListings} />
              ) : (
                <div className="text-center py-20 border rounded-lg bg-card text-muted-foreground">No pending listings.</div>
              )}
            </TabsContent>

            <TabsContent value="live">
              {dataLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : liveListings.length > 0 ? (
                <ListingsTable listings={liveListings} />
              ) : (
                <div className="text-center py-20 border rounded-lg bg-card text-muted-foreground">No live listings.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={!!editingListing} onOpenChange={(open) => !open && setEditingListing(null)}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>Modify listing details or replace photos.</DialogDescription>
          </DialogHeader>
          
          {editingListing && (
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={editingListing.title} 
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (UGX)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={editingListing.price} 
                    onChange={(e) => setEditingListing({ ...editingListing, price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={editingListing.location} 
                    onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Replace Photos (Optional)</Label>
                <div className="grid grid-cols-4 gap-4">
                  {newPhotos.length > 0 ? (
                    newPhotos.map((p, i) => (
                      <div key={i} className="relative aspect-square rounded border overflow-hidden">
                        <Image src={p.url} alt="" fill className="object-cover" />
                      </div>
                    ))
                  ) : (
                    editingListing.imageUrls?.map((url: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded border overflow-hidden opacity-50">
                        <Image src={url} alt="" fill className="object-cover" />
                      </div>
                    ))
                  )}
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded border border-dashed hover:bg-muted transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] mt-1">Add New</span>
                    <input type="file" multiple className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingListing(null)}>Cancel</Button>
            <Button onClick={handleUpdateListing} disabled={isActionLoading === editingListing?.id}>
              {isActionLoading === editingListing?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}