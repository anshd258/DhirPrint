
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateCustomProductDesign } from '@/ai/flows/generate-custom-product-design';
import { Loader2, Wand2, UploadCloud, Image as ImageIcon, Package, Ruler, Info, CheckCircle, Trash2 } from 'lucide-react';
import type { Product } from '@/types'; // Assuming Product type has sizes
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock product data for types and sizes - replace with actual data fetching if needed
const mockProductsData: Pick<Product, 'id' | 'name' | 'category' | 'sizes' | 'defaultImageUrl'>[] = [
  { id: 'flex', name: 'Flex Banner', category: 'Flex Banner', sizes: ['3x5 ft', '4x6 ft', '5x8 ft', 'Custom Size'], defaultImageUrl: 'https://placehold.co/300x200.png' },
  { id: 'acrylic', name: 'Acrylic Sign', category: 'Acrylic Sign', sizes: ['12x18 inches', '18x24 inches', '24x36 inches', 'Custom Size'], defaultImageUrl: 'https://placehold.co/300x200.png' },
  { id: 'neon', name: 'Neon Sign', category: 'Neon Sign', sizes: ['Small (up to 2ft wide)', 'Medium (up to 4ft wide)', 'Large (up to 6ft wide)'], defaultImageUrl: 'https://placehold.co/300x200.png' },
];


export default function DesignStudioPage() {
  const [productType, setProductType] = useState<Product['category'] | ''>('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [mainPrompt, setMainPrompt] = useState<string>('');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageDataUri, setReferenceImageDataUri] = useState<string | null>(null);
  const [referenceImagePrompt, setReferenceImagePrompt] = useState<string>('');
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productType) {
      const product = mockProductsData.find(p => p.category === productType);
      if (product) {
        setAvailableSizes(product.sizes);
        setSelectedSize(product.sizes[0] || '');
      } else {
        setAvailableSizes([]);
        setSelectedSize('');
      }
    } else {
      setAvailableSizes([]);
      setSelectedSize('');
    }
  }, [productType]);

  const handleReferenceImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReferenceImage(null);
      setReferenceImageDataUri(null);
    }
  };

  const handleGenerateDesign = async () => {
    if (!productType || !selectedSize || !mainPrompt) {
      toast({ title: "Missing Information", description: "Please select product type, size, and enter a main prompt.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    try {
      const result = await generateCustomProductDesign({
        productType,
        size: selectedSize,
        mainPrompt,
        specialRequirements: specialRequirements || undefined,
        referenceImageDataUri: referenceImageDataUri || undefined,
        referenceImagePrompt: referenceImagePrompt || undefined,
      });
      setGeneratedImageUrl(result.generatedImageUrl);
      toast({ title: "Design Generated!", description: "Your custom design is ready.", icon: <CheckCircle className="h-5 w-5 text-primary" /> });
    } catch (error: any) {
      console.error("Error generating design:", error);
      toast({ title: "Generation Failed", description: error.message || "Could not generate design. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveDesign = () => {
    // TODO: Implement Firestore saving logic for the generatedImageUrl
    // This would involve uploading the data URI to Firebase Storage, then saving the URL and other details to a 'userDesigns' collection.
    if (!generatedImageUrl) {
        toast({ title: "No Design", description: "Please generate a design first.", variant: "destructive"});
        return;
    }
    toast({ title: "Save Design", description: "Save functionality to be implemented. For now, you can download the image." });
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          <Wand2 className="inline-block h-10 w-10 mr-3 text-primary" />
          Event Design Studio
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Craft unique designs for your products using AI. Describe your vision, add special touches, and even provide a reference image to guide the AI.
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl glassmorphic">
          <CardHeader>
            <CardTitle className="text-2xl">Design Parameters</CardTitle>
            <CardDescription>Tell us what you&apos;re envisioning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="productType" className="font-medium flex items-center mb-1"><Package className="mr-2 h-4 w-4 text-primary"/>Product Type</Label>
              <Select value={productType} onValueChange={(value) => setProductType(value as Product['category'])}>
                <SelectTrigger id="productType"><SelectValue placeholder="Select product type" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {mockProductsData.map(p => <SelectItem key={p.id} value={p.category}>{p.name}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {productType && availableSizes.length > 0 && (
              <div>
                <Label htmlFor="selectedSize" className="font-medium flex items-center mb-1"><Ruler className="mr-2 h-4 w-4 text-primary"/>Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize} disabled={!productType}>
                  <SelectTrigger id="selectedSize"><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Available Sizes</SelectLabel>
                        {availableSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="mainPrompt" className="font-medium">Main Design Prompt</Label>
              <Textarea id="mainPrompt" value={mainPrompt} onChange={(e) => setMainPrompt(e.target.value)} placeholder="e.g., A vibrant birthday banner with balloons and confetti, for a 5 year old." rows={3} />
            </div>
            
            <div>
              <Label htmlFor="specialRequirements" className="font-medium">Special Requirements (Optional)</Label>
              <Textarea id="specialRequirements" value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} placeholder="e.g., Use a cartoonish font, primary colors blue and yellow, include a picture of a lion." rows={3} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="referenceImage" className="font-medium flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-primary"/>Reference Image (Optional)</Label>
                <Input id="referenceImage" type="file" accept="image/*" onChange={handleReferenceImageChange} className="text-xs file:text-primary file:font-medium"/>
                {referenceImage && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon className="h-4 w-4 text-primary"/> 
                        <span>{referenceImage.name}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={() => { setReferenceImage(null); setReferenceImageDataUri(null); (document.getElementById('referenceImage') as HTMLInputElement).value = ''; }}>
                            <Trash2 className="h-3 w-3"/>
                        </Button>
                    </div>
                )}
            </div>
            {referenceImage && (
                 <div>
                    <Label htmlFor="referenceImagePrompt" className="font-medium">Notes for Reference Image (Optional)</Label>
                    <Textarea id="referenceImagePrompt" value={referenceImagePrompt} onChange={(e) => setReferenceImagePrompt(e.target.value)} placeholder="e.g., Use the color palette from this image, or match this style." rows={2} />
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateDesign} disabled={isGenerating || !productType || !selectedSize || !mainPrompt} className="w-full text-base py-3">
              {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Wand2 className="mr-2 h-5 w-5"/> Generate Design
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl glassmorphic">
                <CardHeader>
                    <CardTitle className="text-2xl">Generated Design Preview</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="aspect-video w-full bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border overflow-hidden">
                    {isGenerating && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
                    {!isGenerating && generatedImageUrl && (
                    <Image src={generatedImageUrl} alt="Generated Design" width={600} height={400} className="object-contain max-w-full max-h-[50vh]" />
                    )}
                    {!isGenerating && !generatedImageUrl && (
                    <div className="text-center text-muted-foreground p-8">
                        <ImageIcon className="h-20 w-20 mx-auto mb-4" />
                        <p>Your AI-generated design will appear here.</p>
                    </div>
                    )}
                </div>
                </CardContent>
                {generatedImageUrl && !isGenerating && (
                    <CardFooter className="justify-end">
                        <Button onClick={handleSaveDesign} variant="primary">Save Design</Button>
                    </CardFooter>
                )}
            </Card>

            {/* Placeholder for "My Designs" gallery */}
            <Card className="shadow-lg glassmorphic">
                <CardHeader>
                    <CardTitle className="text-xl">My Saved Designs</CardTitle>
                    <CardDescription>Browse and reuse your previously generated designs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="default" className="bg-primary/5 border-primary/20">
                        <Info className="h-5 w-5 text-primary" />
                        <AlertTitle className="text-primary">Coming Soon!</AlertTitle>
                        <AlertDescription>
                            This section will display your saved designs. You'll be able to filter them by product type and select them for your orders.
                        </AlertDescription>
                    </Alert>
                    {/* TODO: Implement listing of userDesigns from Firestore */}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
