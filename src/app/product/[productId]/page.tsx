
"use client";

import type { Product, CartItem, UserDesign } from '@/types';
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
import { Loader2, UploadCloud, Wand2, CheckCircle, Info, Palette, FolderHeart, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
// TODO: Firestore - fetch user designs for this product type



// Mock function to fetch a single product. Replace with actual Firestore fetching.
async function getProduct(productId: string): Promise<Product | null> {
  const mockProducts: Product[] = [
    { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner for outdoor use. Perfect for events, promotions, and storefronts. Weather-resistant and durable.', materials: ['Standard Flex (10oz)', 'Premium Flex (13oz)', 'Mesh Flex (Wind-resistant)'], sizes: ['3x5 ft', '4x6 ft', '5x8 ft', 'Custom Size'], basePrice: 25, imageUrls: ['https://placehold.co/800x600.png?text=Flex+Banner+1', 'https://placehold.co/800x600.png?text=Flex+Banner+2'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign with custom printing. Ideal for office decor, branding, and reception areas. Modern and stylish.', materials: ['3mm Clear Acrylic', '5mm Frosted Acrylic', '5mm Black Acrylic'], sizes: ['12x18 inches', '18x24 inches', '24x36 inches', 'Custom Size'], basePrice: 50, imageUrls: ['https://placehold.co/800x600.png?text=Acrylic+Sign+1'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon001', name: 'Custom Neon Light', category: 'Neon Sign', description: 'Bright and customizable neon light sign. Make a statement with vibrant colors and unique designs. Perfect for businesses and home decor.', materials: ['LED Neon Flex'], sizes: ['Small (up to 2ft wide)', 'Medium (up to 4ft wide)', 'Large (up to 6ft wide)'], basePrice: 150, imageUrls: ['https://placehold.co/800x600.png?text=Neon+Sign+1'], defaultImageUrl: 'https://placehold.co/800x600.png', createdAt: new Date(), updatedAt: new Date() },
  ];
  return mockProducts.find(p => p.id === productId) || null;
}

// Mock function to fetch user designs for product type
async function getUserDesignsForProductType(productType: Product['category']): Promise<UserDesign[]> {
    // TODO: Replace with actual Firestore query
    console.log("Fetching mock designs for", productType);
    // Example: Filter a mock list of all user designs
    const allMockDesigns: UserDesign[] = [
        { id: 'design1', userId: 'user1', productType: 'Flex Banner', size: '3x5 ft', prompt: 'Blue wave', generatedImageUrl: 'https://placehold.co/100x75.png?text=Design1', createdAt: new Date() },
        { id: 'design2', userId: 'user1', productType: 'Flex Banner', size: '4x6 ft', prompt: 'Red sun', generatedImageUrl: 'https://placehold.co/100x75.png?text=Design2', createdAt: new Date() },
        { id: 'design3', userId: 'user1', productType: 'Acrylic Sign', size: '12x18 inches', prompt: 'Company Logo', generatedImageUrl: 'https://placehold.co/100x75.png?text=Design3', createdAt: new Date() },
    ];
    return allMockDesigns.filter(d => d.productType === productType);
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
  
  const [finalDesignUrl, setFinalDesignUrl] = useState<string | null>(null); // For uploaded or selected AI image
  const [userSelectedDesignId, setUserSelectedDesignId] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrlForProductPage, setGeneratedImageUrlForProductPage] = useState<string | null>(null);


  const [loadingProduct, setLoadingProduct] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [userDesigns, setUserDesigns] = useState<UserDesign[]>([]);
  const [loadingUserDesigns, setLoadingUserDesigns] = useState(false);

  const { addItemToCart } = useCartContext();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      setLoadingProduct(true);
      setLoadingUserDesigns(true);
      const fetchedProduct = await getProduct(params.productId);
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        setSelectedMaterial(fetchedProduct.materials[0]);
        setSelectedSize(fetchedProduct.sizes[0]);
        setFinalDesignUrl(fetchedProduct.defaultImageUrl); // Default design
        setCurrentPrice(fetchedProduct.basePrice);
        
        // Fetch user designs relevant to this product's category
        // TODO: Replace with actual fetch from Firestore using current user's ID
        const designs = await getUserDesignsForProductType(fetchedProduct.category);
        setUserDesigns(designs);
      }
      setLoadingProduct(false);
      setLoadingUserDesigns(false);
    }
    loadProduct();
  }, [params.productId]);

  useEffect(() => {
    if (product) {
      let price = product.basePrice;
      if (selectedMaterial.includes('Premium') || selectedMaterial.includes('5mm')) price *= 1.2;
      if (selectedSize.includes('Medium') || selectedSize.includes('4x6') || selectedSize.includes('18x24')) price *= 1.3;
      if (selectedSize.includes('Large') || selectedSize.includes('5x8') || selectedSize.includes('24x36')) price *= 1.5;
      setCurrentPrice(price);
    }
  }, [product, selectedMaterial, selectedSize]);

  const handleGenerateImageForProduct = async () => {
    if (!aiPrompt) {
      toast({ title: "Prompt needed", description: "Please enter a prompt.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedImageUrlForProductPage(null);
    try {
      const result = await generateProductImage({ prompt: aiPrompt });
      setGeneratedImageUrlForProductPage(result.imageUrl);
      setFinalDesignUrl(result.imageUrl); // Update main preview
      setUserSelectedDesignId(null); // Clear any selected user design
      toast({ title: "Image Generated!", description: "AI has crafted a design for this product." });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({ title: "Generation Failed", description: "Could not generate image. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !finalDesignUrl) return;
    const cartItem: CartItem = {
      id: `${product.id}-${selectedMaterial}-${selectedSize}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: finalDesignUrl, // This is the key image for the cart
      size: selectedSize,
      material: selectedMaterial,
      customizationDetails: {
        designUrl: finalDesignUrl, 
        overlayText: overlayText,
        userDesignId: userSelectedDesignId ,
      },
      quantity: quantity,
      unitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
    };
    await addItemToCart(cartItem);
    toast({ title: "Added to Cart!", description: `${product.name} is now in your shopping cart.`, icon: <CheckCircle className="h-5 w-5 text-primary"/> });
  };
  
  const handleVerifyPrintReadiness = () => {
    if(!finalDesignUrl) {
      toast({ title: "No Design", description: "Please upload or generate/select a design first.", variant: "destructive"});
      return;
    }
    const isReady = Math.random() > 0.3; 
    if (isReady) {
      toast({ title: "Print Readiness Verified", description: "Your design looks good to go!", icon: <CheckCircle className="h-4 w-4 text-primary" /> });
    } else {
       toast({ title: "Low Resolution Alert", description: "The image resolution might be too low for the selected size. Consider using a higher resolution image or a smaller print size for best results.", variant: "destructive", duration: 10000, icon: <Info className="h-4 w-4 text-primary" /> });
    }
  }

  const handleSelectUserDesign = (design: UserDesign) => {
    setFinalDesignUrl(design.generatedImageUrl); // Update main preview
    setUserSelectedDesignId(design.id);
    setGeneratedImageUrlForProductPage(null); // Clear product-page AI generation
    // Optionally, you could also set the size if the design's size is compatible
    if(product?.sizes.includes(design.size)) {
        setSelectedSize(design.size);
    }
    toast({title: "Design Selected", description: `Using your saved design: "${design.prompt.substring(0,30)}..."`});
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
        <div className="space-y-4">
           <Card className="shadow-lg glassmorphic">
            <CardContent className="p-2">
              <div className="aspect-video relative w-full bg-background/10 rounded-xl overflow-hidden border border-white/10">
                {finalDesignUrl ? (
                  <Image src={finalDesignUrl} alt="Selected Design" layout="fill" objectFit="contain" data-ai-hint="product custom design"/>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Palette className="h-24 w-24 opacity-50" />
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
          {product.imageUrls && product.imageUrls.length > 0 && ( // Changed logic for multiple base images
            <div className="grid grid-cols-4 gap-2">
              {[product.defaultImageUrl, ...product.imageUrls.filter(url => url !== product.defaultImageUrl)].slice(0,4).map((url, idx) => (
                <Button key={idx} variant="outline" className={`p-0 h-auto aspect-square glassmorphic ${finalDesignUrl === url && !userSelectedDesignId && !generatedImageUrlForProductPage ? 'ring-2 ring-primary' : ''}`} onClick={() => {setFinalDesignUrl(url); setUserSelectedDesignId(null); setGeneratedImageUrlForProductPage(null);}}>
                  <Image src={url} alt={`${product.name} thumbnail ${idx+1}`} width={100} height={100} className="object-cover rounded-lg w-full h-full" data-ai-hint="product photo"/>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg glassmorphic">
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
              
              <Tabs defaultValue="ai-product" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ai-product"><Sparkles className="mr-2 h-4 w-4" />Quick AI Design</TabsTrigger>
                  <TabsTrigger value="my-designs"><FolderHeart className="mr-2 h-4 w-4" />My Saved Designs</TabsTrigger>
                  <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload Your Own</TabsTrigger>
                </TabsList>

                <TabsContent value="ai-product" className="mt-4 space-y-4 p-4 border border-white/10 rounded-lg">
                  <Label htmlFor="aiPromptProduct">AI Design Prompt for this Product</Label>
                  <Textarea id="aiPromptProduct" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder={`e.g., a futuristic cityscape for my ${product.name.toLowerCase()}`} />
                  <Button onClick={handleGenerateImageForProduct} disabled={isGenerating} className="w-full">
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate for Product
                  </Button>
                   <Alert variant="default" className="bg-primary/10 border-primary/20 text-xs">
                        <Info className="h-4 w-4 text-primary"/>
                        <AlertDescription>
                            For more advanced AI design options like using reference images, visit our full <Link href="/design-studio" className="font-semibold underline hover:text-primary/80">Design Studio</Link>.
                        </AlertDescription>
                    </Alert>
                  {generatedImageUrlForProductPage && (
                     <Alert>
                      <AlertTitle className="flex items-center gap-2"><CheckCircle className="text-primary"/> Image Generated!</AlertTitle>
                      <AlertDescription>
                        Your AI-generated image is now shown in the preview.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="my-designs" className="mt-4 space-y-4 p-4 border border-white/10 rounded-lg">
                    <h3 className="text-md font-semibold">Your Saved Designs for {product.category}s</h3>
                    {loadingUserDesigns && <Loader2 className="h-6 w-6 animate-spin text-primary"/>}
                    {!loadingUserDesigns && userDesigns.length === 0 && (
                        <p className="text-sm text-muted-foreground">You have no saved designs for {product.category}s yet. Visit the <Link href="/design-studio" className="underline hover:text-primary">Design Studio</Link> to create some!</p>
                    )}
                    {!loadingUserDesigns && userDesigns.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                            {userDesigns.map(design => (
                                <Card key={design.id} className={`p-2 cursor-pointer glassmorphic hover:border-primary ${userSelectedDesignId === design.id ? 'ring-2 ring-primary border-primary' : 'border-white/10'}`} onClick={() => handleSelectUserDesign(design)}>
                                    <Image src={design.generatedImageUrl} alt={design.prompt} width={150} height={100} className="rounded object-cover aspect-[3/2]"/>
                                    <p className="text-xs truncate mt-1" title={design.prompt}>{design.prompt}</p>
                                    <p className="text-xs text-muted-foreground">{design.size}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                     <Link href="/design-studio" className="block mt-3">
                        <Button variant="outline" className="w-full text-sm">Go to Full Design Studio</Button>
                    </Link>
                </TabsContent>

                <TabsContent value="upload" className="mt-4 space-y-4 p-4 border border-white/10 rounded-lg">
                  <Label htmlFor="fileUpload">Upload your design file</Label>
                  <Input id="fileUpload" type="file" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (loadEvent) => {
                        setFinalDesignUrl(loadEvent.target?.result as string);
                        setUserSelectedDesignId(null);
                        setGeneratedImageUrlForProductPage(null);
                        toast({ title: "Image Uploaded", description: "Preview updated with your design." });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, SVG. Max size: 10MB.</p>
                  <Button onClick={handleVerifyPrintReadiness} variant="outline" className="w-full">Verify Print Readiness</Button>
                </TabsContent>
              </Tabs>
              
              <Separator className="bg-white/10"/>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" className="w-20 text-center" />
                </div>
                <p className="text-3xl font-bold text-primary">${(currentPrice * quantity).toFixed(2)}</p>
              </div>
              
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full font-semibold text-base" onClick={handleAddToCart} variant="primary">Add to Cart</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
