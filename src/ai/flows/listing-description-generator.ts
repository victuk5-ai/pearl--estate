'use server';
/**
 * @fileOverview An AI tool to generate compelling and detailed property descriptions.
 *
 * - generateListingDescription - A function that handles the property description generation process.
 * - ListingDescriptionGeneratorInput - The input type for the generateListingDescription function.
 * - ListingDescriptionGeneratorOutput - The return type for the generateListingDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
export type ListingDescriptionGeneratorInput = z.infer<typeof ListingDescriptionGeneratorInputSchema>;

const ListingDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed property description.'),
});
export type ListingDescriptionGeneratorOutput = z.infer<typeof ListingDescriptionGeneratorOutputSchema>;

export async function generateListingDescription(input: ListingDescriptionGeneratorInput): Promise<ListingDescriptionGeneratorOutput> {
  return listingDescriptionGeneratorFlow(input);
}

const generateListingDescriptionPrompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: { schema: ListingDescriptionGeneratorInputSchema },
  output: { schema: ListingDescriptionGeneratorOutputSchema },
  prompt: `You are a professional real estate copywriter for Pearl Estate, specializing in the Ugandan market. Your task is to craft a compelling, detailed, and attractive property description that highlights the best features of a property, aiming to captivate potential buyers. Focus on painting a vivid picture of the lifestyle the property offers.

Property Type: {{{propertyType}}}
Location: {{{location}}}
{{#if bedrooms}}Bedrooms: {{{bedrooms}}}{{/if}}
{{#if bathrooms}}Bathrooms: {{{bathrooms}}}{{/if}}
{{#if squareFootage}}Square Footage: {{{squareFootage}}} sq ft{{/if}}
{{#if lotSize}}Lot Size: {{{lotSize}}}{{/if}}
{{#if amenities}}Amenities: {{#each amenities}}- {{{this}}}
{{/each}}{{/if}}
Key Features: {{{keyFeatures}}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}

Generate a detailed property description that is at least 200 words long, appealing to the target audience and emphasizing the unique selling points. Use engaging language and consider the local context of Uganda.`,
});

const listingDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'listingDescriptionGeneratorFlow',
    inputSchema: ListingDescriptionGeneratorInputSchema,
    outputSchema: ListingDescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await generateListingDescriptionPrompt(input);
    return output!;
  }
);
