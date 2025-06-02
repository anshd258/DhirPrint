
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
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full group">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-video relative w-full overflow-hidden">
            <Image
              src={product.defaultImageUrl || `https://placehold.co/600x400.png?text=${product.name.replace(/\s/g, '+')}`}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint="product photo"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/0 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <CardTitle className="text-xl mb-2 font-semibold group-hover:text-primary transition-colors">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-3">{product.description}</CardDescription>
        <p className="text-sm text-primary/80 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-secondary"/> AI Design Options Available
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t border-border/30 mt-auto">
        <div className="flex justify-between items-center w-full">
          <p className="text-xl font-bold text-primary">
            From ${product.basePrice.toFixed(2)}
          </p>
          <Link href={`/product/${product.id}`} passHref>
            <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
              Customize <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
