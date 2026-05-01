'use client';

import { useState, useMemo } from 'react';
import type { Property } from '@/lib/types';
import PropertyCard from './property-card';
import PropertyFilters from './property-filters';
import { Button } from './ui/button';

type PropertyListingsProps = {
  properties: Property[];
};

export default function PropertyListings({ properties }: PropertyListingsProps) {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    listingType: 'all', // 'buy', 'rent'
    furnishedStatus: 'all', // 'furnished', 'unfurnished'
  });

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const searchLower = filters.search.toLowerCase();
        return (
          p.title.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower)
        );
      })
      .filter((p) => (filters.location ? p.location === filters.location : true))
      .filter((p) => (filters.type ? p.type === filters.type : true))
      .filter((p) => {
        if (filters.listingType === 'all') return true;
        if (filters.listingType === 'rent') return p.rental;
        if (filters.listingType === 'buy') return !p.rental;
        return true;
      })
      .filter((p) => {
        if (filters.furnishedStatus === 'all') return true;
        if (p.type === 'Land') return true;
        if (filters.furnishedStatus === 'furnished') return p.furnished;
        if (filters.furnishedStatus === 'unfurnished') return !p.furnished;
        return true;
      })
      .sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
  }, [properties, filters]);

  const uniqueLocations = [...new Set(properties.map(p => p.location))];
  const uniqueTypes = [...new Set(properties.map(p => p.type))];

  return (
    <section id="properties" className="container py-12">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
        Featured Properties
      </h2>
      <PropertyFilters filters={filters} setFilters={setFilters} locations={uniqueLocations} types={uniqueTypes} />

      {filteredProperties.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
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
  );
}
