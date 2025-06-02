
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
import { Card } from '@/components/ui/card';

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
  category: z.enum(['Flex Banner', 'Acrylic Sign', 'Neon Sign'], { required_error: "Category is required"}),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseFloat(val) : (typeof val === 'number' ? val : undefined)),
    z.number({invalid_type_error: "Price must be a number"}).positive("Price must be positive")
  ),
  materials: z.string().min(1, "At least one material is required").transform(val => val.split(',').map(s => s.trim()).filter(s => s.length > 0)),
  sizes: z.string().min(1, "At least one size is required").transform(val => val.split(',').map(s => s.trim()).filter(s => s.length > 0)),
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
    defaultValues: {
        name: "",
        category: undefined, // Or "Flex Banner" as a default if preferred
        description: "",
        basePrice: undefined, // Keep undefined to show placeholder
        materials: [],
        sizes: [],
        defaultImageUrl: ""
    }
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
    if (editingProduct) { 
      const updatedProduct: Product = { ...editingProduct, ...data, materials: data.materials as string[], sizes: data.sizes as string[], updatedAt: new Date() };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      toast({ title: "Product Updated", description: `${data.name} has been updated.` });
    } else { 
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        ...data,
        imageUrls: data.defaultImageUrl ? [data.defaultImageUrl] : [],
        materials: data.materials as string[],
        sizes: data.sizes as string[],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProducts([newProduct, ...products]);
      toast({ title: "Product Added", description: `${data.name} has been added.` });
    }
    reset();
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    reset({
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
    reset({ 
        name: "", category: "Flex Banner", description: "", basePrice: undefined,
        materials: "", sizes: "", defaultImageUrl: ""
    });
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
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
      <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button onClick={openAddForm} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) setEditingProduct(null); }}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border/70">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription className="text-xs">
              {editingProduct ? 'Update the details of this product.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Name</Label>
              <Input id="name" {...register("name")} className="col-span-3 h-9 text-xs" />
              {errors.name && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-xs">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3 h-9 text-xs">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">Categories</SelectLabel>
                        <SelectItem value="Flex Banner" className="text-xs">Flex Banner</SelectItem>
                        <SelectItem value="Acrylic Sign" className="text-xs">Acrylic Sign</SelectItem>
                        <SelectItem value="Neon Sign" className="text-xs">Neon Sign</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.category.message}</p>}
            </div>

             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right text-xs pt-2">Description</Label>
              <Textarea id="description" {...register("description")} className="col-span-3 text-xs min-h-[60px]" />
              {errors.description && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basePrice" className="text-right text-xs">Base Price ($)</Label>
              <Input id="basePrice" type="number" step="0.01" {...register("basePrice")} placeholder="e.g. 25.99" className="col-span-3 h-9 text-xs" />
              {errors.basePrice && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.basePrice.message}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materials" className="text-right text-xs">Materials</Label>
              <Input id="materials" {...register("materials")} placeholder="Comma-separated, e.g., Vinyl, Mesh" className="col-span-3 h-9 text-xs" />
              {errors.materials && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.materials.message}</p>}
            </div>

             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sizes" className="text-right text-xs">Sizes</Label>
              <Input id="sizes" {...register("sizes")} placeholder="Comma-separated, e.g., Sm, Md, Lg" className="col-span-3 h-9 text-xs" />
              {errors.sizes && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.sizes.message}</p>}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="defaultImageUrl" className="text-right text-xs">Image URL</Label>
              <Input id="defaultImageUrl" {...register("defaultImageUrl")} placeholder="https://example.com/image.png" className="col-span-3 h-9 text-xs" />
              {errors.defaultImageUrl && <p className="col-span-4 text-destructive text-xs text-right -mt-2">{errors.defaultImageUrl.message}</p>}
            </div>

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="shadow-lg border-border/70">
        <Table>
        <TableHeader>
          <TableRow className="border-b-border/50"> 
            <TableHead className="w-[60px] text-xs">Image</TableHead>
            <TableHead className="text-xs">Name</TableHead>
            <TableHead className="text-xs">Category</TableHead>
            <TableHead className="text-right text-xs">Price</TableHead>
            <TableHead className="text-center w-[80px] text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id} className="text-sm">
                <TableCell>
                    <Image src={product.defaultImageUrl || 'https://placehold.co/50x50.png'} alt={product.name} width={40} height={40} className="rounded object-cover" data-ai-hint="product photo"/>
                </TableCell>
                <TableCell className="font-medium text-xs">{product.name}</TableCell>
                <TableCell className="text-xs">{product.category}</TableCell>
                <TableCell className="text-right text-xs">${product.basePrice.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditForm(product)} className="text-xs">
                        <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive text-xs">
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm">
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
