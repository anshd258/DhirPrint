
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Printer, Palette, Lightbulb } from "lucide-react";

const productCategories = [
  {
    name: "Flex Banners",
    description: "Durable and vibrant flex banners for all your advertising needs.",
    link: "/products/flex-banners", // Example link, adjust as per routing for categories
    icon: <Printer className="h-12 w-12 text-primary" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "banner printing"
  },
  {
    name: "Acrylic Signs",
    description: "Sleek and modern acrylic signs for a professional look.",
    link: "/products/acrylic-signs",
    icon: <Palette className="h-12 w-12 text-primary" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "acrylic sign"
  },
  {
    name: "Neon Signs",
    description: "Eye-catching custom neon signs to make your brand glow.",
    link: "/products/neon-signs",
    icon: <Lightbulb className="h-12 w-12 text-primary" />,
    image: "https://placehold.co/600x400.png",
    imageHint: "neon sign"
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">
          Welcome to <span className="text-primary">DhirPrint AI</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create stunning custom prints with the power of AI. Flex banners, acrylic signs, neon signs, and more!
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse All Products
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Our Products</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {productCategories.map((category) => (
            <Card key={category.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                  <Image src={category.image} alt={category.name} layout="fill" objectFit="cover" data-ai-hint={category.imageHint} />
                </div>
                <div className="flex justify-center mb-2">{category.icon}</div>
                <CardTitle className="text-2xl text-center font-headline">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center">{category.description}</CardDescription>
              </CardContent>
              <CardContent className="text-center">
                 <Link href={category.link}>
                    <Button variant="outline" className="w-full">Explore {category.name}</Button>
                 </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center py-12 bg-card rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 font-headline">Why Choose DhirPrint AI?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-primary">AI-Powered Design</h3>
            <p className="text-muted-foreground">Generate unique designs instantly with our cutting-edge AI tools.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-secondary">Premium Quality</h3>
            <p className="text-muted-foreground">We use high-quality materials for prints that last.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-accent">Fast Turnaround</h3>
            <p className="text-muted-foreground">Get your custom prints delivered quickly to your doorstep.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
