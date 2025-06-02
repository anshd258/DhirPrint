
"use client";

import type { Product, CartItem } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { generateProductImage } from '@/ai/flows/generate-product-image';
import { Loader2, UploadCloud, Wand2, CheckCircle, Info, Palette } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock function to fetch a single product. Replace with actual Firestore fetching.
async function getProduct(productId: string): Promise<Product | null> {
  // TODO: Replace with actual Firestore fetching
  // Example:
  // const productRef = doc(db, 'products', productId);
  // const productSnap = await getDoc(productRef);
  // if (productSnap.exists()) {
  //   return { id: productSnap.id, ...productSnap.data() } as Product;
  // }
  // return null;

  const mockProducts: Product[] = [
    { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner for outdoor use. Perfect for events, promotions, and storefronts. Weather-resistant and durable.', materials: ['Standard Flex (10oz)', 'Premium Flex (13oz)', 'Mesh Flex (Wind-resistant)'], sizes: ['3x5 ft', '4x6 ft', '5x8 ft', 'Custom Size'], basePrice: 25, imageUrls: ['https://placehold.co/800x600.png?text=Flex+Banner+1', 'https://placehold.co/800x600.png?text=Flex+Banner+2'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign with custom printing. Ideal for office decor, branding, and reception areas. Modern and stylish.', materials: ['3mm Clear Acrylic', '5mm Frosted Acrylic', '5mm Black Acrylic'], sizes: ['12x18 inches', '18x24 inches', '24x36 inches', 'Custom Size'], basePrice: 50, imageUrls: ['https://placehold.co/800x600.png?text=Acrylic+Sign+1'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon001', name: 'Custom Neon Light', category: 'Neon Sign', description: 'Bright and customizable neon light sign. Make a statement with vibrant colors and unique designs. Perfect for businesses and home decor.', materials: ['LED Neon Flex'], sizes: ['Small (up to 2ft wide)', 'Medium (up to 4ft wide)', 'Large (up to 6ft wide)'], basePrice: 150, imageUrls: ['https://placehold.co/800x600.png?text=Neon+Sign+1'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
  ];
  return mockProducts.find(p => p.id === productId) || null;
}

interface ProductPageParams {
  productId: string;
}

export default function ProductPage({ params }: { params: ProductPageParams }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [overlayText, setOverlayText] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [finalDesignUrl, setFinalDesignUrl] = useState<string | null>(null); // For uploaded or selected AI image
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { addItemToCart } = useCartContext();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      setLoadingProduct(true);
      const fetchedProduct = await getProduct(params.productId);
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        setSelectedMaterial(fetchedProduct.materials[0]);
        setSelectedSize(fetchedProduct.sizes[0]);
        setFinalDesignUrl(fetchedProduct.defaultImageUrl); // Default design
        setCurrentPrice(fetchedProduct.basePrice);
      }
      setLoadingProduct(false);
    }
    loadProduct();
  }, [params.productId]);

  useEffect(() => {
    if (product) {
      // Mock price calculation
      let price = product.basePrice;
      if (selectedMaterial.includes('Premium') || selectedMaterial.includes('5mm')) price *= 1.2;
      if (selectedSize.includes('Medium') || selectedSize.includes('4x6') || selectedSize.includes('18x24')) price *= 1.3;
      if (selectedSize.includes('Large') || selectedSize.includes('5x8') || selectedSize.includes('24x36')) price *= 1.5;
      setCurrentPrice(price);
    }
  }, [product, selectedMaterial, selectedSize]);


  const handleGenerateImage = async () => {
    if (!aiPrompt) {
      toast({ title: "Prompt needed", description: "Please enter a prompt for AI image generation.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    try {
      // TODO: Implement actual image generation and store in aiImages collection in Firestore.
      // The flow returns a data URI. For a real app, upload this to Firebase Storage and get URL.
      const result = await generateProductImage({ prompt: aiPrompt });
      setGeneratedImageUrl(result.imageUrl); // This is a data URI
      setFinalDesignUrl(result.imageUrl); // Auto-select generated image
      toast({ title: "Image Generated!", description: "AI has crafted your design." });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({ title: "Generation Failed", description: "Could not generate image. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !finalDesignUrl) return;
    const cartItem: CartItem = {
      id: `${product.id}-${selectedMaterial}-${selectedSize}-${Date.now()}`, // Simple unique ID
      productId: product.id,
      productName: product.name,
      productImage: finalDesignUrl,
      size: selectedSize,
      material: selectedMaterial,
      customizationDetails: {
        designUrl: finalDesignUrl, // Could be uploaded or AI generated
        overlayText: overlayText,
      },
      quantity: quantity,
      unitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
    };
    addItemToCart(cartItem);
  };
  
  // TODO: Implement verifyPrintReadiness logic
  const handleVerifyPrintReadiness = () => {
    if(!finalDesignUrl) {
      toast({ title: "No Design", description: "Please upload or generate a design first.", variant: "destructive"});
      return;
    }
    // Mocking check
    const isReady = Math.random() > 0.3; // Simulate DPI check
    if (isReady) {
      toast({ title: "Print Readiness Verified", description: "Your design looks good to go!", icon: <CheckCircle className="h-4 w-4 text-primary" /> });
    } else {
       toast({ title: "Low Resolution Alert", description: "The image resolution might be too low for the selected size. Consider using a higher resolution image or a smaller print size for best results.", variant: "destructive", duration: 10000, icon: <Info className="h-4 w-4 text-primary" /> });
    }
  }

  if (loadingProduct) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery & Design Preview */}
        <div className="space-y-4">
           <Card className="shadow-lg">
            <CardContent className="p-2">
              <div className="aspect-video relative w-full bg-muted rounded overflow-hidden">
                {finalDesignUrl ? (
                  <Image src={finalDesignUrl} alt="Selected Design" layout="fill" objectFit="contain" data-ai-hint="product design"/>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Palette className="h-24 w-24" />
                  </div>
                )}
                {overlayText && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-white bg-black/50 px-4 py-2 rounded" style={{ textShadow: '2px 2px 4px #000000' }}>
                      {overlayText}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Thumbnail selection for product images if available */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {[product.defaultImageUrl, ...product.imageUrls].slice(0,4).map((url, idx) => (
                <Button key={idx} variant="outline" className={`p-0 h-auto aspect-square ${finalDesignUrl === url ? 'ring-2 ring-primary' : ''}`} onClick={() => setFinalDesignUrl(url)}>
                  <Image src={url} alt={`${product.name} thumbnail ${idx+1}`} width={100} height={100} className="object-cover rounded w-full h-full" data-ai-hint="product thumbnail"/>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Customization */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">{product.name}</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">{product.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground leading-relaxed">{product.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material" className="text-sm font-medium">Material</Label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger id="material"><SelectValue placeholder="Select material" /></SelectTrigger>
                    <SelectContent>
                      {product.materials.map((mat) => <SelectItem key={mat} value={mat}>{mat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size" className="text-sm font-medium">Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger id="size"><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="overlayText" className="text-sm font-medium">Overlay Text (Optional)</Label>
                <Input id="overlayText" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} placeholder="Your Text Here" />
              </div>
              
              <Tabs defaultValue="ai-generate" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ai-generate"><Wand2 className="mr-2 h-4 w-4" />Generate with AI</TabsTrigger>
                  <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload Design</TabsTrigger>
                </TabsList>
                <TabsContent value="ai-generate" className="mt-4 space-y-4 p-4 border rounded-md">
                  <Label htmlFor="aiPrompt">AI Design Prompt</Label>
                  <Textarea id="aiPrompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., a futuristic cityscape for a tech banner" />
                  <Button onClick={handleGenerateImage} disabled={isGenerating} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Design
                  </Button>
                  {generatedImageUrl && (
                     <Alert>
                      <AlertTitle className="flex items-center gap-2"><CheckCircle className="text-primary"/> Image Generated!</AlertTitle>
                      <AlertDescription>
                        Your AI-generated image is now shown in the preview.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                <TabsContent value="upload" className="mt-4 space-y-4 p-4 border rounded-md">
                  <Label htmlFor="fileUpload">Upload your design file</Label>
                  <Input id="fileUpload" type="file" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (loadEvent) => {
                        setFinalDesignUrl(loadEvent.target?.result as string);
                        // TODO: Upload to Firebase Storage
                        toast({ title: "Image Uploaded", description: "Preview updated with your design." });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, SVG. Max size: 10MB.</p>
                  <Button onClick={handleVerifyPrintReadiness} variant="outline" className="w-full">Verify Print Readiness</Button>
                </TabsContent>
              </Tabs>
              
              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" className="w-20 text-center" />
                </div>
                <p className="text-3xl font-bold text-primary">${(currentPrice * quantity).toFixed(2)}</p>
              </div>
              
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
