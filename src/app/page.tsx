
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Printer, Palette, Lightbulb, ArrowRight } from "lucide-react";

const productCategories = [
  {
    name: "Flex Banners",
    description: "Durable and vibrant flex banners for all your advertising needs.",
    link: "/products/flex-banners",
    icon: <Printer className="h-10 w-10 text-primary" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "banner printing"
  },
  {
    name: "Acrylic Signs",
    description: "Sleek and modern acrylic signs for a professional look.",
    link: "/products/acrylic-signs",
    icon: <Palette className="h-10 w-10 text-secondary" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "acrylic sign"
  },
  {
    name: "Neon Signs",
    description: "Eye-catching custom neon signs to make your brand glow.",
    link: "/products/neon-signs",
    icon: <Lightbulb className="h-10 w-10 text-accent" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "neon sign"
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="relative text-center py-16 md:py-24 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-80"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary-foreground tracking-tight">
            Welcome to <span className="block md:inline">DhirPrint AI</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Craft stunning, AI-powered custom prints. From vibrant flex banners to glowing neon signs, bring your vision to life.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6 font-semibold">
              Explore Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold text-center mb-12 font-headline tracking-tight">Discover Our Creations</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {productCategories.map((category) => (
            <Card key={category.name} className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex flex-col group">
              <CardHeader className="p-0">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={category.imageHint} 
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                 {category.icon}
                </div>
                <CardTitle className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 mt-auto">
                 <Link href={category.link} className="w-full">
                    <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 py-3 text-base group-hover:bg-primary group-hover:text-primary-foreground">
                        View {category.name} <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                 </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center py-16 md:py-20 bg-card/50 rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold mb-6 font-headline tracking-tight">Why <span className="text-primary">DhirPrint AI</span>?</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Experience the future of custom printing with our innovative platform.
        </p>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10 max-w-5xl mx-auto">
          <div className="p-6 border border-border/30 rounded-lg bg-card/70 hover:shadow-secondary/10 shadow-lg transition-shadow">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">AI-Powered Design</h3>
            <p className="text-muted-foreground">Generate unique designs instantly with our cutting-edge AI tools, tailored to your brand.</p>
          </div>
          <div className="p-6 border border-border/30 rounded-lg bg-card/70 hover:shadow-secondary/10 shadow-lg transition-shadow">
            <div className="inline-block p-3 bg-secondary/10 rounded-full mb-4">
              <Printer className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Premium Quality</h3>
            <p className="text-muted-foreground">We use top-tier materials and printing techniques for results that impress and last.</p>
          </div>
          <div className="p-6 border border-border/30 rounded-lg bg-card/70 hover:shadow-secondary/10 shadow-lg transition-shadow">
           <div className="inline-block p-3 bg-accent/10 rounded-full mb-4">
              <Palette className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Limitless Customization</h3>
            <p className="text-muted-foreground">From size and material to intricate design details, control every aspect of your print.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
