'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PropertyFiltersProps = {
  filters: {
    search: string;
    location: string;
    type: string;
    listingType: string;
    furnishedStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<PropertyFiltersProps['filters']>>;
  locations: string[];
  types: string[];
};

export default function PropertyFilters({ filters, setFilters, locations, types }: PropertyFiltersProps) {
  return (
    <div className="space-y-4">
        <div className="flex justify-center">
            <Tabs 
                value={filters.listingType}
                onValueChange={(value) => {
                    setFilters(prev => ({
                        ...prev, 
                        listingType: value,
                        furnishedStatus: value !== 'rent' ? 'all' : prev.furnishedStatus,
                    }))
                }}
                className="w-auto"
            >
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="rent">Rent</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-card p-6 shadow-md md:grid-cols-3">
            <div className="relative md:col-span-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by title or location..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
            </div>
            <div>
                <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({...prev, location: value === 'all' ? '' : value}))}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.type}
                    onValueChange={(value) => {
                        const newType = value === 'all' ? '' : value;
                        setFilters(prev => ({
                            ...prev,
                            type: newType,
                            furnishedStatus: newType === 'Land' ? 'all' : prev.furnishedStatus,
                        }));
                    }}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div>
                <Select
                    value={filters.furnishedStatus}
                    onValueChange={(value) => setFilters(prev => ({...prev, furnishedStatus: value}))}
                    disabled={filters.listingType !== 'rent'}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Furnishing" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Furnishing</SelectItem>
                    <SelectItem value="furnished">Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  );
}
