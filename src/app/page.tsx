
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Printer, Palette, Lightbulb, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

const productCategories = [
  {
    name: "Flex Banners",
    description: "Durable and vibrant flex banners for all your advertising needs.",
    link: "/products/flex-banners",
    icon: <Printer className="h-8 w-8 text-primary" />,
    image: "https://placehold.co/600x400.png", // Replace with actual or relevant placeholder
    imageHint: "banner printing"
  },
  {
    name: "Acrylic Signs",
    description: "Sleek and modern acrylic signs for a professional look.",
    link: "/products/acrylic-signs",
    icon: <Palette className="h-8 w-8 text-primary" />,
    image: "https://placehold.co/600x400.png", // Replace with actual or relevant placeholder
    imageHint: "acrylic sign"
  },
  {
    name: "Neon Signs",
    description: "Eye-catching custom neon signs to make your brand glow.",
    link: "/products/neon-signs",
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    image: "https://placehold.co/600x400.png", // Replace with actual or relevant placeholder
    imageHint: "neon sign"
  },
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
    icon: <Printer className="h-10 w-10 text-primary mb-4" />,
  },
  {
    title: "Limitless Customization",
    description: "From size and material to intricate design details, control every aspect of your print.",
    icon: <Palette className="h-10 w-10 text-primary mb-4" />,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground tracking-tight">
            AI-Powered Custom Prints
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Craft stunning, personalized prints with ease. From vibrant flex banners to glowing neon signs, bring your vision to life using the power of AI.
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-10 py-7 font-semibold">
              Explore Our Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Categories Section */}
      <section>
        <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Discover Our Creations</h2>
            <p className="text-md text-muted-foreground mt-2 max-w-xl mx-auto">Choose a category to start designing your custom print masterpiece.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {productCategories.map((category) => (
            <Card key={category.name} className="bg-card border-border/70 overflow-hidden shadow-lg hover:shadow-primary/10 transition-shadow duration-300 flex flex-col group">
              <CardHeader className="p-0">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={category.imageHint} 
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/0"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                 <div className="mb-3">
                   {category.icon}
                 </div>
                <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-sm flex-grow">{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 mt-auto bg-card/50 border-t border-border/50">
                 <Link href={category.link} className="w-full">
                    <Button variant="outline" className="w-full border-primary/70 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 py-3 group-hover:border-primary">
                        View {category.name} <ArrowRight className="ml-2 h-4 w-4"/>
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
            <p className="text-md text-muted-foreground mt-2 max-w-xl mx-auto">
              Experience the future of custom printing with our innovative platform.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card p-6 md:p-8 text-center border-border/70 shadow-lg hover:shadow-secondary/10 transition-shadow">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-16 md:py-24 bg-card/80 rounded-lg shadow-xl border border-border/50">
        <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Ready to Create?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Start designing your custom prints today or explore our full product catalog.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/products">
            <Button size="lg" className="px-8 py-6 font-semibold text-base">
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
