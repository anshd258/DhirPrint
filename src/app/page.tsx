
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Printer, Palette, Lightbulb, ArrowRight, Sparkles, Zap, ShoppingBag, Settings, ShieldCheck, BarChart } from "lucide-react";

const productCategories = [
  {
    name: "Flex Banners",
    description: "Durable and vibrant flex banners for all your advertising needs.",
    link: "/products/flex-banners",
    image: "https://placehold.co/600x800.png", // More portrait
    imageHint: "outdoor advertising" // More specific hint
  },
  {
    name: "Acrylic Signs",
    description: "Sleek and modern acrylic signs for a professional look.",
    link: "/products/acrylic-signs",
    image: "https://placehold.co/600x800.png",
    imageHint: "office signage"
  },
  {
    name: "Neon Signs",
    description: "Eye-catching custom neon signs to make your brand glow.",
    link: "/products/neon-signs",
    image: "https://placehold.co/600x800.png",
    imageHint: "custom lighting"
  },
];

const heroFeatures = [
    { title: "Banners", icon: <Printer size={20}/>, description: "High-quality vinyl & flex." },
    { title: "Signs", icon: <Palette size={20}/>, description: "Acrylic, metal, and more." },
    { title: "Neon", icon: <Lightbulb size={20}/>, description: "Custom LED neon designs." },
    { title: "AI Design", icon: <Sparkles size={20}/>, description: "Generate unique concepts." },
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
        {/* Background Glow / Image */}
        <div 
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <Image 
            src="https://placehold.co/1920x1080.png" // Placeholder for a space/abstract background
            alt="Abstract background"
            layout="fill"
            objectFit="cover"
            quality={80}
            className="opacity-30"
            data-ai-hint="abstract gradient"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.25) 0%, transparent 60%)'
            }}
          />
        </div>

        <div className="container mx-auto grid md:grid-cols-12 gap-8 items-center relative z-10">
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
                <CardTitle className="text-2xl font-bold text-foreground">Design & Order</CardTitle>
                <p className="text-sm text-muted-foreground">Quickly configure your custom print.</p>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {heroFeatures.map(feature => (
                    <div key={feature.title} className="p-3 rounded-lg bg-background/30 border border-white/10 hover:bg-background/50 transition-colors cursor-pointer flex items-center gap-3">
                        <span className="text-primary p-2 bg-primary/10 rounded-md">{feature.icon}</span>
                        <div>
                            <h4 className="font-semibold text-foreground">{feature.title}</h4>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
                <Button variant="primary" className="w-full text-lg py-6 mt-4">
                  Start Your Design <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories Section - "Popular" */}
      <section>
        <div className="text-left mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Popular Categories</h2>
            <p className="text-md text-muted-foreground mt-3 max-w-xl">Choose a category to start designing your custom print masterpiece.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {productCategories.map((category) => (
            <Card key={category.name} className="glassmorphic rounded-2xl overflow-hidden shadow-xl group flex flex-col">
              <CardHeader className="p-0 relative h-80 w-full"> {/* Increased height */}
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={category.imageHint} 
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <CardTitle className="text-2xl font-semibold text-white mb-1">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
              </CardContent>
              <CardFooter className="p-6 mt-auto">
                 <Link href={category.link} className="w-full">
                    <Button variant="outline" className="w-full border-primary/70 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 py-3 group-hover:border-primary shadow-sm hover:shadow-md">
                        Explore {category.name} <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                 </Link>
              </CardFooter>
            </Card>
          ))}
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
