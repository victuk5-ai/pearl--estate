'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { bannerAds } from '@/lib/data';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PropertyCard from '@/components/property-card';
import PropertyFilters from '@/components/property-filters';
import GoPremium from '@/components/go-premium';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const getImage = (id: string): ImagePlaceholder | undefined => PlaceHolderImages.find(p => p.id === id);

export default function Home() {
  const db = useFirestore();
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    listingType: 'all',
    furnishedStatus: 'all',
  });

  const listingsQuery = useMemo(() => {
    if (!db) return null;
    // We fetch all approved listings and filter them in memory for flexibility
    return query(collection(db, 'listings'), where('status', '==', 'approved'));
  }, [db]);

  const { data: rawListings, loading } = useCollection(listingsQuery);

  const filteredProperties = useMemo(() => {
    if (!rawListings) return [];
    
    return rawListings
      .filter((p: any) => {
        const searchLower = filters.search.toLowerCase();
        return (
          p.title.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower)
        );
      })
      .filter((p: any) => (filters.location ? p.location === filters.location : true))
      .filter((p: any) => (filters.type ? p.type === filters.type : true))
      .filter((p: any) => {
        if (filters.listingType === 'all') return true;
        if (filters.listingType === 'rent') return p.isRental;
        if (filters.listingType === 'buy') return !p.isRental;
        return true;
      })
      .filter((p: any) => {
        if (filters.furnishedStatus === 'all') return true;
        if (p.propertyType === 'Land') return true;
        return p.furnishedStatus === filters.furnishedStatus;
      });
  }, [rawListings, filters]);

  const uniqueLocations = useMemo(() => [...new Set(rawListings?.map((p: any) => p.location) || [])], [rawListings]);
  const uniqueTypes = useMemo(() => [...new Set(rawListings?.map((p: any) => p.propertyType) || [])], [rawListings]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-64 w-full md:h-[400px]">
           <Carousel
            opts={{
              loop: true,
            }}
            className="h-full w-full"
          >
            <CarouselContent className="h-full">
              {bannerAds.map((ad) => {
                const adImage = getImage(ad.imageId);
                return (
                  <CarouselItem key={ad.id} className="relative h-full">
                    {adImage && (
                      <Image
                        src={adImage.imageUrl}
                        alt={ad.title}
                        fill
                        className="object-cover"
                        data-ai-hint={adImage.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                      <h2 className="font-headline text-3xl font-bold md:text-5xl">{ad.title}</h2>
                      <p className="mt-2 max-w-xl text-lg">{ad.description}</p>
                      <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href={ad.link}>Learn More</Link>
                      </Button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </section>

        <section id="properties" className="container py-12">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
            Featured Properties
          </h2>
          
          <PropertyFilters 
            filters={filters} 
            setFilters={setFilters} 
            locations={uniqueLocations as string[]} 
            types={uniqueTypes as string[]} 
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property: any) => (
                <PropertyCard 
                  key={property.id} 
                  property={{
                    ...property,
                    type: property.propertyType,
                    rental: property.isRental,
                    imageIds: property.imageUrls, // Using standard property card expectations
                    broker: { name: property.brokerName, phone: property.brokerPhone }
                  } as any} 
                />
              ))}
            </div>
          ) : (
             <div className="mt-16 flex flex-col items-center justify-center text-center">
                <p className="text-lg text-muted-foreground">No properties match your current filters.</p>
                <Button variant="link" onClick={() => setFilters({ search: '', location: '', type: '', listingType: 'all', furnishedStatus: 'all'})}>
                    Clear filters
                </Button>
            </div>
          )}
        </section>
      </main>
      <GoPremium />
      <Footer />
    </div>
  );
}