export type Property = {
  id: string;
  title: string;
  type: 'House' | 'Land' | 'Apartment' | 'Hostel';
  location: string;
  price: number;
  rental?: boolean;
  rentalPeriod?: 'month' | 'semester';
  furnished?: boolean;
  verified?: boolean;
  landTenure?: 'Mailo' | 'Freehold' | 'Leasehold' | 'Kibanja';
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  lotSize?: string;
  description: string;
  features: string[];
  imageIds: string[];
  isPremium: boolean;
  broker: {
    name: string;
    phone: string;
  };
  status?: 'pending' | 'approved';
};

export type BannerAd = {
  id: string;
  title: string;
  description: string;
  link: string;
  imageId: string;
}
