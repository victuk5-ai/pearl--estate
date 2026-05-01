'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Milestone, Zap, Phone, Loader2, MessageSquare, BadgeCheck } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const image = PlaceHolderImages.find(p => p.id === property.imageIds[0]);
  const { toast } = useToast();

  const formattedPrice = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(property.price);
  
  const priceSuffix = property.rental
    ? property.type === 'Hostel'
      ? '/semester'
      : '/month'
    : '';
  const priceDisplay = `${formattedPrice}${priceSuffix}`;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [adStep, setAdStep] = useState<'loading' | 'contact'>('loading');
  const [isMessaging, setIsMessaging] = useState(false);

  const handleCallBroker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdStep('loading');
    setDialogOpen(true);

    setTimeout(() => {
      setAdStep('contact');
    }, 5000);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMessaging(true);
    setTimeout(() => {
      setIsMessaging(false);
      toast({
        title: 'Message Sent (Simulated)',
        description: `Your inquiry about "${property.title}" has been sent to the broker.`,
      });
    }, 2000);
  };


  return (
    <>
      <Link href={`/properties/${property.id}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
          <CardContent className="flex flex-1 flex-col p-0">
            <div className="relative h-56 w-full">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              )}
               {property.verified && (
                <Badge className="absolute left-3 top-3 border-transparent bg-blue-500 text-white shadow hover:bg-blue-600">
                    <BadgeCheck className="mr-1 h-4 w-4" />
                    Verified
                </Badge>
              )}
              {property.isPremium && (
                <Badge variant="destructive" className="absolute right-3 top-3 bg-premium text-white">
                  <Zap className="mr-1 h-4 w-4"/>
                  Featured
                </Badge>
              )}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                 {property.landTenure && <Badge variant="outline" className="mb-1 border-primary-foreground/50 text-primary-foreground">{property.landTenure}</Badge>}
                 <h3 className="font-headline text-lg font-bold text-white">
                  {property.title}
                </h3>
                <p className="text-sm text-primary-foreground/80">{property.location}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xl font-bold text-primary">{priceDisplay}</p>
              <div className="mt-2 flex items-center space-x-4 text-muted-foreground">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="mr-1 h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="mr-1 h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                 {property.lotSize && (
                  <div className="flex items-center">
                    <Milestone className="mr-1 h-4 w-4" />
                    <span>{property.lotSize}</span>
                  </div>
                )}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <Button onClick={handleCallBroker} variant="secondary">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                </Button>
                <Button onClick={handleWhatsAppClick} className="bg-green-500 text-white hover:bg-green-600">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      {mounted && (
        <>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent className="flex h-screen w-screen max-w-full flex-col items-center justify-center overflow-hidden p-0 sm:rounded-none">
                {adStep === 'loading' ? (
                     <div className="flex flex-col items-center justify-center p-6 text-center">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline text-2xl md:text-4xl">Loading contact details...</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="my-8 flex h-64 w-full max-w-md items-center justify-center rounded-lg bg-secondary">
                            <p className="text-muted-foreground">Video ad placeholder (5s)</p>
                        </div>
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="flex w-full max-w-md flex-col items-center justify-center p-6 text-center">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline text-2xl md:text-4xl">Contact Broker</AlertDialogTitle>
                            <AlertDialogDescription>
                               You can now contact the broker for this property.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="my-8 w-full space-y-4">
                            <div className="rounded-lg border bg-secondary p-4 text-center">
                                <p className="text-lg font-semibold">{property.broker.name}</p>
                                <p className="mt-1 block text-3xl font-bold text-primary">
                                    07xx xxx xxx
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    This is a simulated number for demo purposes.
                                </p>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel size="lg" className="w-full">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isMessaging} onOpenChange={setIsMessaging}>
            <AlertDialogContent>
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                <p className="mt-4 text-lg font-medium">
                  Messaging broker about "{property.title}"...
                </p>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
