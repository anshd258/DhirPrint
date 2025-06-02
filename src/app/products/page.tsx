
// This is a server component by default in Next.js App Router
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';
import { db } from '@/lib/firebase'; // Assuming you have initialized Firebase
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';

// Mock function to fetch products. Replace with actual Firestore fetching.
async function getProducts(): Promise<Product[]> {
  // TODO: Replace with actual Firestore fetching
  // For now, returning mock data. In a real app, this would be:
  /*
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('createdAt', 'desc'), limit(20)); // Example query
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  */
  return [
    { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner for outdoor use.', materials: ['Standard Flex', 'Premium Flex'], sizes: ['3x5 ft', '4x6 ft', '5x8 ft'], basePrice: 25, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign with custom printing.', materials: ['3mm Clear Acrylic', '5mm Frosted Acrylic'], sizes: ['12x18 in', '18x24 in', '24x36 in'], basePrice: 50, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon001', name: 'Custom Neon Light', category: 'Neon Sign', description: 'Bright and customizable neon light sign.', materials: ['LED Neon Flex'], sizes: ['Small (up to 2ft)', 'Medium (up to 4ft)', 'Large (up to 6ft)'], basePrice: 150, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'flex002', name: 'Premium Backlit Banner', category: 'Flex Banner', description: 'Backlit flex banner for stunning night displays.', materials: ['Backlit Flex'], sizes: ['4x8 ft', '6x10 ft'], basePrice: 70, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
  ];
}


export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline">Our Products</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Discover a wide range of customizable printing solutions.
        </p>
      </section>
      <Separator />
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No products found at the moment.</p>
          <p className="mt-2">Please check back later or contact support.</p>
        </div>
      )}
    </div>
  );
}

// Revalidate data periodically (e.g., every hour)
export const revalidate = 3600;
