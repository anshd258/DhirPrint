
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';
import { Separator } from '@/components/ui/separator';
// import { db } from '@/lib/firebase'; // Assuming you have initialized Firebase
// import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Mock function to fetch products by category. Replace with actual Firestore fetching.
async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  // TODO: Replace with actual Firestore fetching based on categoryId
  // const productsCol = collection(db, 'products');
  // const q = query(productsCol, where('categorySlug', '==', categoryId), orderBy('createdAt', 'desc')); // Assuming categorySlug field
  // const productSnapshot = await getDocs(q);
  // return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  const allProducts: Product[] = [
    { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner for outdoor use.', materials: ['Standard Flex', 'Premium Flex'], sizes: ['3x5 ft', '4x6 ft', '5x8 ft'], basePrice: 25, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'flex002', name: 'Premium Backlit Banner', category: 'Flex Banner', description: 'Backlit flex banner for stunning night displays.', materials: ['Backlit Flex'], sizes: ['4x8 ft', '6x10 ft'], basePrice: 70, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign with custom printing.', materials: ['3mm Clear Acrylic', '5mm Frosted Acrylic'], sizes: ['12x18 in', '18x24 in', '24x36 in'], basePrice: 50, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic002', name: 'Frosted Acrylic Plaque', category: 'Acrylic Sign', description: 'Sophisticated frosted acrylic plaque for awards or displays.', materials: ['5mm Frosted Acrylic'], sizes: ['8x10 in', '10x12 in'], basePrice: 65, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon001', name: 'Custom Neon Light Text', category: 'Neon Sign', description: 'Bright and customizable neon light sign with text.', materials: ['LED Neon Flex'], sizes: ['Small (up to 2ft)', 'Medium (up to 4ft)'], basePrice: 150, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon002', name: 'Neon Logo Sign', category: 'Neon Sign', description: 'Recreate your logo in vibrant neon.', materials: ['LED Neon Flex'], sizes: ['Custom'], basePrice: 250, imageUrls: [], defaultImageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
  ];

  const categoryMap: { [key: string]: string } = {
    'flex-banners': 'Flex Banner',
    'acrylic-signs': 'Acrylic Sign',
    'neon-signs': 'Neon Sign',
  };

  const mappedCategory = categoryMap[categoryId.toLowerCase()];
  if (!mappedCategory) return [];

  return allProducts.filter(p => p.category === mappedCategory);
}

// This function can be used to generate static paths if you know all categories beforehand
// export async function generateStaticParams() {
//   const categories = ['flex-banners', 'acrylic-signs', 'neon-signs'];
//   return categories.map((categoryId) => ({
//     categoryId,
//   }));
// }

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  const products = await getProductsByCategory(categoryId);
  
  const categoryName = categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format for display

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline">{categoryName}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore our selection of customizable {categoryName.toLowerCase()}.
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
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
          <p className="mt-2">Please check back later or browse other categories.</p>
        </div>
      )}
    </div>
  );
}

// Revalidate data periodically (e.g., every hour)
export const revalidate = 3600;
