'use server';

import { generateListingDescription, ListingDescriptionGeneratorInput } from '@/ai/flows/listing-description-generator';
import { z } from 'zod';

const ListingDescriptionGeneratorInputSchema = z.object({
  propertyType: z.string().describe('The type of property (e.g., house, land, apartment).'),
  location: z.string().describe('The specific location of the property (e.g., Kampala, Kololo, Entebbe).'),
  bedrooms: z.number().optional().describe('Number of bedrooms.'),
  bathrooms: z.number().optional().describe('Number of bathrooms.'),
  squareFootage: z.number().optional().describe('The square footage of the property.'),
  lotSize: z.string().optional().describe('The size of the lot (e.g., 1 acre, 50x100 ft).'),
  amenities: z.array(z.string()).optional().describe('A list of key amenities (e.g., swimming pool, garden, balcony).'),
  keyFeatures: z.string().describe('Any unique selling points or special features of the property.'),
  targetAudience: z.string().optional().describe('The ideal buyer demographic (e.g., families, investors, young professionals).'),
});


export async function generateDescriptionAction(input: ListingDescriptionGeneratorInput) {
  const validatedInput = ListingDescriptionGeneratorInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { description: null, error: 'Invalid input.' };
  }

  try {
    const result = await generateListingDescription(validatedInput.data);
    return { description: result.description, error: null };
  } catch (error) {
    console.error('AI description generation failed:', error);
    return { description: null, error: 'Failed to generate description. Please try again.' };
  }
}
