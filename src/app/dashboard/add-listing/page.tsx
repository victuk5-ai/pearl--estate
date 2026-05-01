'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, X, ImagePlus, Loader2, MessageSquare, Phone, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useUser, useFirestore, useStorage } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title is required.' }),
  propertyType: z.string({ required_error: 'Please select a property type.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  landTenure: z.string({ required_error: 'Please select a land tenure system.' }),
  price: z.coerce.number({ required_error: 'Price is required.' }).positive(),
  isRental: z.boolean().default(false),
  furnishedStatus: z.enum(['furnished', 'unfurnished']).optional(),
});

const ADMIN_EMAIL = 'Victuk5@gmail.com';

export default function AddListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();

  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      title: '',
      isRental: false,
    },
  });

  const isRental = form.watch('isRental');
  const propertyType = form.watch('propertyType');
  const location = form.watch('location');

  const showHostelOption = location && (location.toLowerCase().includes('banda') || location.toLowerCase().includes('nakawa'));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, { file, url: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to add a listing.',
      });
      return;
    }

    if (previews.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Images Required',
        description: 'Please upload at least one image of the property.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const listingRef = doc(collection(db, 'listings'));
      const listingId = listingRef.id;
      const imageUrls: string[] = [];

      for (const item of previews) {
        const imageRef = ref(storage, `property_images/${listingId}/${item.file.name}`);
        const snapshot = await uploadBytes(imageRef, item.file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadUrl);
      }

      const listingData = {
        ...values,
        id: listingId,
        imageUrls,
        brokerId: user.uid,
        brokerName: user.displayName || user.email || 'Unknown Broker',
        brokerPhone: user.phoneNumber || 'No phone',
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      setDoc(listingRef, listingData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: listingRef.path,
            operation: 'create',
            requestResourceData: listingData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: 'Success',
        description: 'Property sent to admin for approval.',
      });
      
      form.reset();
      setPreviews([]);

      if (user.email === ADMIN_EMAIL) {
        router.push('/admin-portal');
      } else {
        router.push('/dashboard/my-listings');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Something went wrong.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (userLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">Login Required</CardTitle>
          <CardDescription className="max-w-sm mb-6">
            Only registered brokers can list properties on Pearl Estate. Please log in to your account.
          </CardDescription>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Property</CardTitle>
        <CardDescription>Fill out the details of your property to create a new listing.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 50x100ft Plot in Gayaza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        {showHostelOption && <SelectItem value="Hostel">Hostel</SelectItem>}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Kampala" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="landTenure"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Land Tenure System</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pearl Estate recommends verifying all titles at the Ministry of Lands before payment.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select land tenure system" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mailo">Mailo</SelectItem>
                      <SelectItem value="Freehold">Freehold</SelectItem>
                      <SelectItem value="Leasehold">Leasehold</SelectItem>
                      <SelectItem value="Kibanja">Kibanja (Customary)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{isRental ? 'Monthly Rent (UGX)' : 'Price (UGX)'}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder={isRental ? 'e.g., 1500000' : 'e.g., 50000000'} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="isRental"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            List this property for rent
                            </FormLabel>
                            <FormDescription>
                            Check this if this is a rental property.
                            </FormDescription>
                        </div>
                    </FormItem>
                )}
                />
            </div>
            
            {isRental && propertyType !== 'Land' && (
                <FormField
                control={form.control}
                name="furnishedStatus"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Furnishing</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="furnished" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Furnished
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="unfurnished" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Unfurnished
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}

            <div className="space-y-4">
              <FormLabel>Property Images</FormLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={preview.url}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(index)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/50 transition-colors hover:bg-muted">
                  <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
              <FormDescription>
                Upload clear JPG or PNG photos of the property.
              </FormDescription>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Need help listing your property?</h3>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                    <a 
                        href="https://wa.me/256706631303?text=I%20need%20help%20with%20Pearl%20Estate." 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Admin via WhatsApp
                    </a>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <a href="tel:+256706631303">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Admin Directly
                    </a>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}