
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Mock function to fetch products. Replace with actual Firestore fetching.
async function getAdminProducts(): Promise<Product[]> {
  // TODO: Replace with actual Firestore fetching
  return [
    { id: 'flex001', name: 'Standard Flex Banner', category: 'Flex Banner', description: 'High-quality flex banner.', materials: ['Standard Flex'], sizes: ['3x5 ft'], basePrice: 25, imageUrls: ['https://placehold.co/100x100.png'], defaultImageUrl: 'https://placehold.co/100x100.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'acrylic001', name: 'Clear Acrylic Sign', category: 'Acrylic Sign', description: 'Elegant clear acrylic sign.', materials: ['3mm Acrylic'], sizes: ['12x18 in'], basePrice: 50, imageUrls: ['https://placehold.co/100x100.png'], defaultImageUrl: 'https://placehold.co/100x100.png', createdAt: new Date(), updatedAt: new Date() },
    { id: 'neon001', name: 'Custom Neon Light', category: 'Neon Sign', description: 'Bright neon light sign.', materials: ['LED Neon'], sizes: ['Small'], basePrice: 150, imageUrls: ['https://placehold.co/100x100.png'], defaultImageUrl: 'https://placehold.co/100x100.png', createdAt: new Date(), updatedAt: new Date() },
  ];
}

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.enum(['Flex Banner', 'Acrylic Sign', 'Neon Sign']),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive("Price must be positive")
  ),
  materials: z.string().min(1, "At least one material is required").transform(val => val.split(',').map(s => s.trim())), // Comma-separated
  sizes: z.string().min(1, "At least one size is required").transform(val => val.split(',').map(s => s.trim())), // Comma-separated
  defaultImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      const fetchedProducts = await getAdminProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    }
    loadProducts();
  }, []);
  
  const handleFormSubmit = async (data: ProductFormData) => {
    // TODO: Implement Firestore add/update logic
    if (editingProduct) { // Update existing product
      const updatedProduct: Product = { ...editingProduct, ...data, updatedAt: new Date() };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      toast({ title: "Product Updated", description: `${data.name} has been updated.` });
    } else { // Add new product
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        ...data,
        imageUrls: data.defaultImageUrl ? [data.defaultImageUrl] : [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProducts([...products, newProduct]);
      toast({ title: "Product Added", description: `${data.name} has been added.` });
    }
    reset();
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    reset({ // Pre-fill form
        name: product.name,
        category: product.category,
        description: product.description,
        basePrice: product.basePrice,
        materials: product.materials.join(', '),
        sizes: product.sizes.join(', '),
        defaultImageUrl: product.defaultImageUrl,
    });
    setIsFormOpen(true);
  };
  
  const openAddForm = () => {
    setEditingProduct(null);
    reset({ // Clear form for new product
        name: "", category: "Flex Banner", description: "", basePrice: 0,
        materials: "", sizes: "", defaultImageUrl: ""
    });
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // TODO: Implement Firestore delete logic
    if (confirm("Are you sure you want to delete this product?")) {
        setProducts(products.filter(p => p.id !== productId));
        toast({ title: "Product Deleted", description: "The product has been removed.", variant: "destructive" });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openAddForm}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add Product
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) setEditingProduct(null); }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details of this product.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
            {/* Form Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Controller
                name="category"
                control={control}
                defaultValue="Flex Banner"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="Flex Banner">Flex Banner</SelectItem>
                        <SelectItem value="Acrylic Sign">Acrylic Sign</SelectItem>
                        <SelectItem value="Neon Sign">Neon Sign</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="col-span-4 text-red-500 text-xs text-right">{errors.category.message}</p>}
            </div>

             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" {...register("description")} className="col-span-3" />
              {errors.description && <p className="col-span-4 text-red-500 text-xs text-right">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basePrice" className="text-right">Base Price ($)</Label>
              <Input id="basePrice" type="number" step="0.01" {...register("basePrice")} className="col-span-3" />
              {errors.basePrice && <p className="col-span-4 text-red-500 text-xs text-right">{errors.basePrice.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materials" className="text-right">Materials</Label>
              <Input id="materials" {...register("materials")} placeholder="Comma-separated, e.g., Vinyl, Mesh" className="col-span-3" />
              {errors.materials && <p className="col-span-4 text-red-500 text-xs text-right">{errors.materials.message}</p>}
            </div>

             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sizes" className="text-right">Sizes</Label>
              <Input id="sizes" {...register("sizes")} placeholder="Comma-separated, e.g., Small, Medium, Large" className="col-span-3" />
              {errors.sizes && <p className="col-span-4 text-red-500 text-xs text-right">{errors.sizes.message}</p>}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defaultImageUrl" className="text-right">Image URL</Label>
              <Input id="defaultImageUrl" {...register("defaultImageUrl")} placeholder="https://example.com/image.png" className="col-span-3" />
              {errors.defaultImageUrl && <p className="col-span-4 text-red-500 text-xs text-right">{errors.defaultImageUrl.message}</p>}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="shadow-lg">
        <TableHeader>
          {/* Using TableHeader for styling, not actual thead as it's part of Card */}
          <TableRow className="border-b-0"> 
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <Table>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                    <Image src={product.defaultImageUrl || 'https://placehold.co/50x50.png'} alt={product.name} width={50} height={50} className="rounded object-cover" data-ai-hint="product photo"/>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">${product.basePrice.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditForm(product)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
