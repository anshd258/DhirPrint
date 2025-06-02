
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="glassmorphic rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full group">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.defaultImageUrl || `https://placehold.co/600x450.png?text=${product.name.replace(/\s/g, '+')}`}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint="product photo"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-2.5">{product.description}</CardDescription>
        <p className="text-xs text-primary/90 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-secondary"/> AI Design Assistance
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <div className="flex justify-between items-center w-full">
          <p className="text-xl font-bold text-primary"> {/* Increased price font size */}
            ${product.basePrice.toFixed(2)}
          </p>
          <Link href={`/product/${product.id}`} passHref>
            <Button variant="primary" size="sm" className="group-hover:opacity-90"> {/* Primary is now white button */}
              Customize <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
