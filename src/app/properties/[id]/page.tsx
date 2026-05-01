import { notFound } from 'next/navigation';
import Image from 'next/image';
import { properties } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Bed, Bath, Milestone, User, Phone, Sofa, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function PropertyPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

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

  const images = property.imageIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container py-8 md:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                     <Carousel className="w-full overflow-hidden rounded-lg shadow-lg">
                        <CarouselContent>
                            {images.map((image, index) => image && (
                            <CarouselItem key={index}>
                                <div className="relative h-96">
                                <Image
                                    src={image.imageUrl}
                                    alt={`${property.title} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
                                />
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>

                    <Card className="mt-8">
                        <CardHeader>
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <h1 className="font-headline text-3xl font-bold text-primary">{property.title}</h1>
                                        {property.verified && (
                                            <Badge className="border-transparent bg-blue-500 text-white shadow hover:bg-blue-600">
                                                <BadgeCheck className="mr-1 h-5 w-5" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-lg text-muted-foreground">{property.location}</p>
                                        {property.landTenure && <Badge variant="secondary">{property.landTenure}</Badge>}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-primary shrink-0">{priceDisplay}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                                {property.bedrooms && <div className="flex items-center gap-2"><Bed /><span>{property.bedrooms} Bedrooms</span></div>}
                                {property.bathrooms && <div className="flex items-center gap-2"><Bath /><span>{property.bathrooms} Bathrooms</span></div>}
                                {property.lotSize && <div className="flex items-center gap-2"><Milestone /><span>{property.lotSize}</span></div>}
                                {property.areaSqFt && <div className="flex items-center gap-2"><Milestone /><span>{property.areaSqFt} sq ft</span></div>}
                                {property.type !== 'Land' && property.furnished !== undefined && (
                                    <div className="flex items-center gap-2"><Sofa /><span>{property.furnished ? 'Furnished' : 'Unfurnished'}</span></div>
                                )}
                            </div>
                            <h2 className="mt-6 font-headline text-2xl font-semibold">About this {property.type.toLowerCase()}</h2>
                            <p className="mt-2 leading-relaxed">{property.description}</p>
                            
                            <h2 className="mt-6 font-headline text-2xl font-semibold">Features</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {property.features.map(feature => (
                                    <Badge key={feature} variant="secondary">{feature}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Contact Broker</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 font-semibold"><User/>{property.broker.name}</div>
                                    <div className="flex items-center gap-2 text-muted-foreground"><Phone/>{property.broker.phone}</div>
                                </div>
                            </div>
                            <form className="mt-6 space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input id="name" type="text" placeholder="John Doe" />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="email">Your Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder={`I'm interested in the ${property.title}...`} />
                                </div>
                                <Button type="submit" className="w-full">Send Inquiry</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
