import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Printer, Palette, Lightbulb, ArrowRight, Sparkles, Zap, ShoppingBag, Settings, ShieldCheck, BarChart, Search } from "lucide-react";

// Mock product data - in a real app, this would come from a DB
const mockProducts = [
  { id: 'neon001', name: 'Custom Neon Light', category: 'Neon Sign', description: 'Bright and customizable neon light sign. Make a statement with vibrant colors and unique designs.', basePrice: 150, defaultImageUrl: 'https://placehold.co/600x800.png', imageHint: "custom lighting" },
  { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner for outdoor use. Perfect for events and promotions.', basePrice: 25, defaultImageUrl: 'https://placehold.co/600x400.png', imageHint: "outdoor advertising" },
  { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign with custom printing. Ideal for office decor and branding.', basePrice: 50, defaultImageUrl: 'https://placehold.co/600x400.png', imageHint: "office signage" },
];

const featuredProduct = mockProducts[0]; // Custom Neon Light
const secondaryProducts = mockProducts.slice(1); // Flex Banner and Acrylic Sign

const heroFeatures = [
    { title: "Banners", icon: <Printer size={16}/>, link: "/products/flex-banners" },
    { title: "Signs", icon: <Palette size={16}/>, link: "/products/acrylic-signs" },
    { title: "Neon", icon: <Lightbulb size={16}/>, link: "/products/neon-signs" },
    { title: "AI Design", icon: <Sparkles size={16}/>, link: "/product/ai-designer" }, // Example link
];

const features = [
  {
    title: "AI-Powered Design Studio",
    description: "Generate unique designs instantly with our cutting-edge AI tools, tailored to your brand.",
    icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
  },
  {
    title: "Premium Quality Materials",
    description: "We use top-tier materials and printing techniques for results that impress and last.",
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
  },
  {
    title: "Limitless Customization",
    description: "From size and material to intricate design details, control every aspect of your print.",
    icon: <Settings className="h-10 w-10 text-primary mb-4" />,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[70vh] md:min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-md "
            data-ai-hint="abstract space"
          >
            <source src="/assets/videos/bgvideo.webm" type="video/webm" />
          </video>
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.15) 0%, transparent 70%)' // Softer glow
            }}
          />
        </div>

        <div className="container mx-auto grid md:grid-cols-12 gap-8 items-center relative z-10 p-4">
          <div className="md:col-span-7 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-foreground tracking-tight">
              AI-Powered Custom Prints
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              Craft stunning, personalized prints with ease. From vibrant flex banners to glowing neon signs, bring your vision to life using the power of AI.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/products">
                <Button size="lg" variant="primary" className="text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
                  Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-semibold">
                Design with AI
              </Button>
            </div>
          </div>

          <div className="md:col-span-5">
            <Card className="glassmorphic p-6 md:p-8 rounded-2xl">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Quick Configure</CardTitle>
                <p className="text-sm text-muted-foreground">Select a product type to start.</p>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {heroFeatures.slice(0,2).map(feature => (
                     <Link href={feature.link} key={feature.title}>
                        <Button variant="secondary" className="w-full justify-between px-3 py-2 text-sm h-auto bg-white/5 hover:bg-white/10 text-foreground">
                            <div className="flex items-center gap-2">
                                {feature.icon}
                                <span>{feature.title}</span>
                            </div>
                            <ArrowRight size={16} className="text-muted-foreground"/>
                        </Button>
                     </Link>
                  ))}
                </div>
                 <div className="grid grid-cols-2 gap-3">
                  {heroFeatures.slice(2,4).map(feature => (
                     <Link href={feature.link} key={feature.title}>
                        <Button variant="secondary" className="w-full justify-between px-3 py-2 text-sm h-auto bg-white/5 hover:bg-white/10 text-foreground">
                             <div className="flex items-center gap-2">
                                {feature.icon}
                                <span>{feature.title}</span>
                            </div>
                            <ArrowRight size={16} className="text-muted-foreground"/>
                        </Button>
                     </Link>
                  ))}
                </div>
                <Button variant="default" className="w-full text-base py-3 mt-4 bg-foreground text-background hover:bg-foreground/90">
                  Start Your Design <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Designs Section - New Layout */}
      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Popular Designs</h2>
            <Link href="/products" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                More designs <ArrowRight size={16}/>
            </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column - Featured Product */}
          <Link href={`/product/${featuredProduct.id}`} className="block group">
            <Card className="glassmorphic rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between min-h-[300px] hover:border-primary/50 transition-all duration-300">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{featuredProduct.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{featuredProduct.description}</p>
              </div>
              <Button variant="default" className="w-full mt-auto bg-foreground text-background hover:bg-foreground/90 py-3 text-base">
                Customize This Design <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </Card>
          </Link>

          {/* Right Column - Secondary Products */}
          <div className="space-y-6 lg:space-y-8">
            {secondaryProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="block group">
                <Card className="glassmorphic rounded-2xl p-6 flex flex-col justify-between min-h-[180px] hover:border-primary/50 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                    <div className="bg-card/80 text-sm text-primary-foreground px-3 py-1 rounded-full font-medium">
                      from ${product.basePrice.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 flex-grow">{product.description}</p>
                  <div className="flex justify-end mt-auto">
                    <Button variant="secondary" size="icon" className="bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full h-9 w-9">
                        <ArrowRight size={18}/>
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Why <span className="text-primary">DhirPrint AI</span>?</h2>
            <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">
              Experience the future of custom printing with our innovative platform.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="glassmorphic p-6 md:p-8 text-center rounded-2xl">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16 md:py-24 glassmorphic rounded-2xl relative overflow-hidden">
        <div 
            className="absolute inset-0 -z-10" 
            style={{ 
              background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)' 
            }}
          />
        <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Ready to Create?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Start designing your custom prints today or explore our full product catalog.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/products">
            <Button size="lg" variant="primary" className="px-8 py-6 font-semibold text-base shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
              Start Designing Now
            </Button>
          </Link>
          <Link href="/contact"> 
            <Button variant="outline" size="lg" className="px-8 py-6 font-semibold text-base">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
